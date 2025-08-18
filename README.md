# Sketchbook

<h1 align="center">Studies in Processing and Creative Coding</h1>
<p align="center">
Experimenting with Processing and p5.js to make some cool stuff.
</p>

<p align="center">
🌐 <a href="https://felipecustodio.github.io/sketchbook/">Live Gallery</a>
</p>

<p align="center"><img align="center" src="https://i.imgur.com/n5067c3.gif"/></p>

## 📁 Repository Structure

This repository is organized by technology and project type for better navigation and maintainability:

### 🎨 [Processing Projects](./processing/)
Desktop applications built with Processing (Java-based creative coding framework):
- **[harmonograph](./processing/harmonograph/)** - Classical harmonograph simulation
- **[harmonograph3D](./processing/harmonograph3D/)** - 3D harmonograph with noise and animation
- **[numeric_sequences](./processing/numeric_sequences/)** - Mathematical sequence visualizations

### 🌐 [p5.js Projects](./p5js/)
Web-based interactive sketches built with p5.js:
- **[chrysanthemum](./p5js/chrysanthemum/)** - Floral pattern generation
- **[conway](./p5js/conway/)** - Conway's Game of Life implementation
- **[forces](./p5js/forces/)** - Physics simulation with forces and attraction
- **[fractal_circles](./p5js/fractal_circles/)** - Recursive circle fractals
- **[golden-ratio](./p5js/golden-ratio/)** - Golden ratio and spiral visualizations
- **[harmonograph_p5](./p5js/harmonograph_p5/)** - Web version of harmonograph with audio
- **[klein_cycloid](./p5js/klein_cycloid/)** - Klein bottle and cycloid curves
- **[lissajous_generator](./p5js/lissajous_generator/)** - Interactive Lissajous curve generator
- **[prolatespheroid](./p5js/prolatespheroid/)** - 3D prolate spheroid visualization
- **[pubg_circle](./p5js/pubg_circle/)** - PUBG-style shrinking circle simulation

#### Advanced p5.js Projects (with data processing)
- **[flights](./p5js/flights/)** - Flight data visualization with Python preprocessing
- **[map](./p5js/map/)** - Interactive map visualizations
- **[names](./p5js/names/)** - Name data visualization

### 🛠️ [Templates](./templates/)
Starter templates and build scripts for new projects:
- **[p5-starter](./templates/p5-starter/)** - p5.js project template with Intellisense
- **[pde-starter](./templates/pde-starter/)** - Processing project template
- **[new_p5](./templates/new_p5)** - Script to create new p5.js projects
- **[new_pde](./templates/new_pde)** - Script to create new Processing projects

### 📦 [Assets](./assets/)
Shared resources:
- **[et-book](./assets/et-book/)** - Typography resources
- **[img](./assets/img/)** - Shared images and media

## 🚀 Getting Started

### For p5.js Projects
1. Navigate to any project in the `p5js/` directory
2. Open `index.html` in a web browser
3. Or serve locally with: `python -m http.server 8000`

### For Processing Projects
1. Install [Processing IDE](https://processing.org/download/)
2. Open any `.pde` file in the `processing/` directory
3. Click the play button to run

### Creating New Projects
```bash
# Create a new p5.js project
./templates/new_p5 my_new_sketch

# Create a new Processing project
./templates/new_pde my_new_sketch
```

## 🎯 Technologies Used

- **[Processing](https://processing.org/)** - Java-based creative coding framework
- **[p5.js](https://p5js.org/)** - JavaScript creative coding library
- **Python** - Data preprocessing and analysis
- **HTML/CSS/JavaScript** - Web technologies for interactive projects

## 📄 License

Individual projects may have their own licenses. Check project directories for specific license information.

---

*Happy coding! 🎨*
