#!/usr/bin/env python3
"""Create thumbnails for Processing and P5.js sketches."""

from __future__ import annotations

import argparse
import asyncio
import base64
import contextlib
import json
import logging
import os
import shutil
import socket
import subprocess
import tempfile
import time
from http.server import SimpleHTTPRequestHandler
from pathlib import Path
from socketserver import TCPServer
from threading import Thread
from typing import Iterable


LOGGER = logging.getLogger("generate_thumbnails")
REPO_ROOT = Path(__file__).resolve().parents[1]
SKETCHES_DIR = REPO_ROOT / "sketches"
THUMBNAIL_MANIFEST_PATH = REPO_ROOT / "site" / "data" / "thumbnails.json"


def is_processing_sketch(path: Path) -> bool:
    return any(f.suffix.lower() == ".pde" for f in path.glob("*.pde"))


def is_p5_sketch(path: Path) -> bool:
    return (path / "index.html").exists() and any(path.glob("*.js"))


def iter_sketch_directories(paths: Iterable[Path] | None = None) -> Iterable[Path]:
    """Yield sketch directories to inspect."""

    candidates = list(paths) if paths else [SKETCHES_DIR]
    for candidate in candidates:
        candidate = candidate.resolve()
        if not candidate.exists():
            LOGGER.debug("Skipping missing path %s", candidate)
            continue
        if candidate.is_dir() and (is_processing_sketch(candidate) or is_p5_sketch(candidate)):
            yield candidate
            continue
        if not candidate.is_dir():
            LOGGER.debug("Ignoring non-directory path %s", candidate)
            continue
        for child in sorted(candidate.iterdir(), key=lambda p: p.name.lower()):
            if not child.is_dir():
                continue
            if is_processing_sketch(child) or is_p5_sketch(child):
                yield child
            else:
                yield from iter_sketch_directories([child])


def processing_available() -> bool:
    return shutil.which("processing-java") is not None


def ensure_processing_dependencies() -> bool:
    try:
        import pyvirtualdisplay  # type: ignore  # noqa: F401
        import mss  # type: ignore  # noqa: F401
        from PIL import Image  # type: ignore  # noqa: F401
    except ImportError as exc:  # pragma: no cover - dependency check
        LOGGER.warning("Missing dependency for Processing capture: %s", exc)
        return False
    return True


def run_processing_thumbnail(sketch_dir: Path, thumbnail_path: Path, delay: float) -> bool:
    if not processing_available():
        LOGGER.warning("processing-java command not found; skipping %s", sketch_dir.name)
        return False
    if not ensure_processing_dependencies():
        return False

    from pyvirtualdisplay import Display  # type: ignore
    from mss import mss  # type: ignore
    from PIL import Image  # type: ignore

    processing_java = shutil.which("processing-java")
    assert processing_java is not None

    LOGGER.info("Rendering Processing sketch %s", sketch_dir.name)
    with Display(size=(1280, 720), visible=0) as display, tempfile.TemporaryDirectory(
        prefix="processing-thumb-"
    ) as output_dir:
        env = os.environ.copy()
        env["DISPLAY"] = f":{display.display}"
        cmd = [
            processing_java,
            f"--sketch={sketch_dir}",
            f"--output={output_dir}",
            "--force",
            "--run",
        ]
        proc = subprocess.Popen(
            cmd,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            env=env,
            cwd=sketch_dir,
        )
        time.sleep(delay)

        try:
            with mss(display=env["DISPLAY"]) as grabber:
                monitor_index = 1 if len(grabber.monitors) > 1 else 0
                monitor = grabber.monitors[monitor_index]
                frame = grabber.grab(monitor)
                image = Image.frombytes("RGB", frame.size, frame.rgb)
                thumbnail_path.parent.mkdir(parents=True, exist_ok=True)
                image.save(thumbnail_path)
                LOGGER.info("Saved thumbnail for %s", sketch_dir.name)
        finally:
            proc.terminate()
            with contextlib.suppress(subprocess.TimeoutExpired):
                proc.wait(timeout=5)
            if proc.poll() is None:
                proc.kill()
        return True


def find_open_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind(("127.0.0.1", 0))
        return sock.getsockname()[1]


def serve_directory(path: Path, port: int) -> TCPServer:
    class Handler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(path), **kwargs)

        def log_message(self, format: str, *args: object) -> None:  # noqa: A003 - matches signature
            LOGGER.debug("HTTP: " + format, *args)

    class Server(TCPServer):
        allow_reuse_address = True

    httpd = Server(("127.0.0.1", port), Handler)
    return httpd


async def capture_p5_thumbnail(sketch_dir: Path, thumbnail_path: Path, delay: float) -> bool:
    try:
        from playwright.async_api import async_playwright  # type: ignore
    except ImportError as exc:  # pragma: no cover - dependency check
        LOGGER.warning("Playwright not available for %s: %s", sketch_dir.name, exc)
        return False

    port = find_open_port()
    server = serve_directory(sketch_dir, port)

    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()

    url = f"http://127.0.0.1:{port}/index.html"
    LOGGER.info("Rendering P5 sketch %s", sketch_dir.name)
    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page(viewport={"width": 1280, "height": 720})
            await page.goto(url, wait_until="networkidle")
            await asyncio.sleep(delay)
            await page.screenshot(path=str(thumbnail_path))
            await browser.close()
            LOGGER.info("Saved thumbnail for %s", sketch_dir.name)
            return True
    finally:
        server.shutdown()
        thread.join(timeout=2)


def process_sketch(sketch_dir: Path, delay: float) -> bool:
    thumbnail_path = sketch_dir / "thumbnail.png"
    if thumbnail_path.exists():
        LOGGER.debug("Thumbnail already exists for %s", sketch_dir.name)
        return False

    if is_processing_sketch(sketch_dir):
        return run_processing_thumbnail(sketch_dir, thumbnail_path, delay)
    if is_p5_sketch(sketch_dir):
        return asyncio.run(capture_p5_thumbnail(sketch_dir, thumbnail_path, delay))

    LOGGER.debug("No supported sketch found in %s", sketch_dir)
    return False


def configure_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(levelname)s: %(message)s",
    )


def encode_thumbnail(path: Path) -> str:
    data = path.read_bytes()
    return base64.b64encode(data).decode("ascii")


def build_thumbnail_manifest(sketches: Iterable[Path]) -> dict[str, str]:
    manifest: dict[str, str] = {}
    for sketch_dir in sketches:
        thumbnail_path = sketch_dir / "thumbnail.png"
        if not thumbnail_path.exists():
            continue
        slug = sketch_dir.name
        try:
            manifest[slug] = encode_thumbnail(thumbnail_path)
        except OSError as exc:
            LOGGER.warning("Could not read thumbnail for %s: %s", slug, exc)
    return manifest


def write_thumbnail_manifest(manifest: dict[str, str]) -> None:
    THUMBNAIL_MANIFEST_PATH.parent.mkdir(parents=True, exist_ok=True)
    with THUMBNAIL_MANIFEST_PATH.open("w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, sort_keys=True)
        fh.write("\n")
    count = len(manifest)
    LOGGER.info(
        "Wrote thumbnail manifest with %d %s.",
        count,
        "entry" if count == 1 else "entries",
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "paths",
        nargs="*",
        type=Path,
        help="Specific sketch directories to process. Defaults to all sketches.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=3.0,
        help="Seconds to wait before capturing each thumbnail.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    configure_logging(args.verbose)

    sketches = list(iter_sketch_directories(args.paths))
    if not sketches:
        LOGGER.info("No sketches found to process.")
        return

    created = 0
    for sketch_dir in sketches:
        try:
            if process_sketch(sketch_dir, args.delay):
                created += 1
        except Exception as exc:  # pragma: no cover - defensive
            LOGGER.error("Failed to process %s: %s", sketch_dir.name, exc, exc_info=args.verbose)

    if created:
        LOGGER.info("Created %s new thumbnail(s).", created)
    else:
        LOGGER.info("No new thumbnails were created.")

    manifest = build_thumbnail_manifest(sketches)
    write_thumbnail_manifest(manifest)


if __name__ == "__main__":
    main()
