# Sketchbook

A creative coding sketchbook built with Processing and P5.js.

👉 Live gallery: https://felipecustodio.github.io/sketchbook/

![3D Harmonograph animation](site/img/3d_harmonograph.gif)

## Repository layout

- `site/` – static site that lists every sketch and links to demos.
- `sketches/` – standalone sketches (Processing or P5.js). Each folder contains its own source files and assets.
- `templates/` – starter projects for new sketches.
- `scripts/` – helper scripts that copy templates into a new directory.

## Creating a new sketch

Use the helper scripts to bootstrap a fresh sketch directory:

```bash
./scripts/new_p5 path/to/new-sketch
# or
./scripts/new_pde path/to/new-processing-sketch
```

Both scripts copy the matching template and ensure the destination directory exists. The Processing helper also renames the `.pde` file to match your folder.

Once copied, open the new folder to develop and run your sketch.
