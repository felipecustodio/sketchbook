# Sketchbook

Thirteen p5.js sketches and three Processing sketches, collected in a [filterable gallery](https://felipecustodio.github.io/sketchbook/). Each folder is an independent work with its own source and assets.
See [the inventory](INVENTORY.md) for entry pages, assets, and controls.

## Run locally

Requires Node.js 22 or newer. From the repository root:

```sh
npm ci
npx playwright install chromium
npm run dev
```

Open <http://localhost:8000/sketchbook/>. `npm run build` writes the static site to `dist/`. The gallery is built from `site/` and the p5 sketches; it does not need a frontend framework.

## Create and verify a sketch

```sh
npm run new -- p5 my_sketch
# or
npm run new -- processing my_sketch
npm run preview -- my_sketch
npm run check
```

The command copies a working template into `sketches/p5/` or `sketches/processing/` and adds one entry to `site/catalog.json`. Edit its title, description, and tags there. Keep data, fonts, and images beside the sketch. Folder names use lowercase letters, digits, and underscores. A Processing folder must contain a matching main `.pde` file, such as `my_sketch/my_sketch.pde`.

All browser sketches load the pinned p5.js version from the root package. For a browser sketch, `npm run preview -- <id> --browser-only` opens the built demo in Playwright, checks for uncaught errors, and captures the canvas into `site/previews/`. Animated previews are sampled frames, so pixel matching is not required. Test controls in the browser as well as the automated capture.

Processing sketches use Processing 4.5.7. Install the [Processing 4 application](https://github.com/processing/processing4/releases/tag/processing-1435-4.5.7) and put its `processing` executable on `PATH`, or set `PROCESSING_CLI` to its path. Since Processing 4.4.3, the command is `processing cli` ([CLI reference](https://github.com/processing/processing4/wiki/Command-Line)). On Linux, install `xvfb-run` for headless preview capture. The 3D harmonograph has pinned PeasyCam 302 JARs in its `code/` folder, so no separate library install is needed.

```sh
processing cli --sketch="$PWD/sketches/processing/harmonograph" --build
npm run preview -- harmonograph --processing-only
```

The Processing preview mode reads `SKETCHBOOK_PREVIEW_OUT` and `SKETCHBOOK_PREVIEW_FRAME`, saves that frame with `saveFrame()`, and exits. `npm run preview` captures every browser and Processing sketch, then rebuilds `dist/`. `npm run check` validates catalog entries, sketch paths, and committed preview files, and builds the site. CI runs both commands before publishing the freshly generated `dist/` artifact to GitHub Pages on `master`.

Run `npm run preview -- --verify-only` to check the gallery and browser demos without changing preview files. Set `SKETCHBOOK_SITE_URL` to a deployed URL ending in `/sketchbook/` to run those same checks against the published site. In repository Settings → Pages, the publishing source must be **GitHub Actions**.

## Layout

| Path | Contents |
| --- | --- |
| `sketches/p5/` | Browser sketches and their assets |
| `sketches/processing/` | Processing sketches and their assets |
| `site/catalog.json` | Gallery metadata, demo entries, preview settings |
| `site/previews/` | Committed generated gallery images |
| `site/` | Shared gallery and detail page |
| `templates/` | New sketch starters |
| `tools/` | Build, preview, and new sketch commands |
| `dist/` | Ignored generated site |
