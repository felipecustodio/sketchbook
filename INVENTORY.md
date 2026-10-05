# Sketch inventory

Browser sketches use the shared p5.js 2.3.4 runtime. Processing sketches use 4.5.7; only the 3D harmonograph needs PeasyCam 302. Entry paths are relative to each sketch folder. Gallery metadata and preview settings live in `site/catalog.json`.

| Folder | Entry pages | Assets and extra code | Interaction |
| --- | --- | --- | --- |
| `p5/chrysanthemum` | `index.html` | None | Animated 3D curves |
| `p5/conway` | `index.html` | None | Click a cell; Space pauses the grid |
| `p5/flights` | `index.html` | Airport, flight, and route CSVs; data parser | Enter starts/restarts; click pauses |
| `p5/forces` | `index.html` | None | Pointer attracts a moving particle |
| `p5/fractal_circles` | `index.html` | None | Slider changes circle size and recursion |
| `p5/golden_ratio` | `sketch.html`, `index.html` introduction | Background sketch, favicon | Slider; B/T/L/E toggle drawing; H hides UI; P pauses |
| `p5/harmonograph_p5` | `index.html`, `ES6_Version/index.html` | Particle and native Web Audio code | Click creates particles and sound; device orientation rotates the 3D view |
| `p5/klein_cycloid` | `index.html` | None | Three parameter sliders |
| `p5/lissajous_generator` | `sketch.html`, `index.html` introduction | VCR font, video/audio; native Web Audio synthesis | Four sliders; P cycles presets; input starts synthesis |
| `p5/map` | `index.html` | Countries/currencies CSVs, CPMono font, local Natural Earth SVG and GeoJSON | Animated country connections |
| `p5/names` | `index.html` | Brazilian names CSV, background JPEG, font | Click generates a name |
| `p5/prolatespheroid` | `index.html` | None | Three parameter sliders |
| `p5/pubg_circle` | `index.html` | Map PNG; Teko font | Safe zones shrink automatically; pointer positions the final message |
| `processing/harmonograph` | `harmonograph.pde` | Bitmap fonts; original rendered GIF | Click chooses new pendulum parameters |
| `processing/harmonograph_3d` | `harmonograph_3d.pde` | Bitmap fonts, OpenSimplexNoise, PeasyCam JARs, original rendered GIF | PeasyCam camera controls |
| `processing/numeric_sequences` | `numeric_sequences.pde` | Bitmap fonts; commented Fibonacci study | Animated prime number drawing |

The map uses [Natural Earth public-domain data](https://www.naturalearthdata.com/about/terms-of-use/) instead of the expired Mapbox static-map token. PeasyCam's archive hash and license are recorded beside its JARs. Generated Java/classes and duplicate p5 runtimes were removed; historical rendered artwork remains beside its source.
