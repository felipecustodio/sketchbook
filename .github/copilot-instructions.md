# Contributor instructions

Read the root [README](../README.md) for current setup and commands. This repository has one root npm package, 13 p5.js sketches in `sketches/p5/`, and three Processing 4 sketches in `sketches/processing/`.

- Use `npm ci`, then `npm run dev` for the gallery at `http://localhost:8000/sketchbook/`.
- Add a sketch with `npm run new -- p5 my_sketch` or `npm run new -- processing my_sketch`. Edit its entry in `site/catalog.json`.
- Keep assets in the sketch folder. Processing main `.pde` names must match the folder name.
- Run `npm run preview -- <id>` after changing a sketch. It updates `site/previews/<id>.png`; commit the preview.
- Run `npm run check` before a PR. CI runs the complete preview suite and publishes `dist/` from `master`.
- Processing 4.5.7 uses `processing cli --sketch=<absolute folder> --build` and `--run`. See the [current CLI reference](https://github.com/processing/processing4/wiki/Command-Line). Set `PROCESSING_CLI` for `npm run preview`; on Linux it uses `xvfb-run`.
- The 3D harmonograph's PeasyCam 302 JARs are pinned in its `code/` folder.
