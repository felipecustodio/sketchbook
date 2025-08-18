# p5.js Projects

This directory contains web-based interactive sketches built with [p5.js](https://p5js.org/), the JavaScript creative coding library.

## Simple Projects

### 🌸 [chrysanthemum](./chrysanthemum/)
Floral pattern generation using mathematical curves and organic growth algorithms.

### 🔄 [conway](./conway/)
Interactive implementation of Conway's Game of Life with customizable rules and patterns.

### ⚡ [forces](./forces/)
Physics simulation demonstrating gravitational forces, attraction, and particle systems.

### ⭕ [fractal_circles](./fractal_circles/)
Recursive circle fractals that create mesmerizing nested patterns.

### 🌀 [golden-ratio](./golden-ratio/)
Beautiful visualizations of the golden ratio, spirals, and related mathematical concepts.

### 🎵 [harmonograph_p5](./harmonograph_p5/)
Web version of the harmonograph with interactive audio features and real-time controls.

### 🔄 [klein_cycloid](./klein_cycloid/)
Mathematical visualization of Klein bottles and cycloid curves in interactive form.

### 📊 [lissajous_generator](./lissajous_generator/)
Interactive Lissajous curve generator with real-time parameter controls.

### 🥚 [prolatespheroid](./prolatespheroid/)
3D visualization of prolate spheroid geometry with interactive rotation.

### 🎯 [pubg_circle](./pubg_circle/)
PUBG-style shrinking circle simulation with timing and area calculations.

## Advanced Projects (with Data Processing)

### ✈️ [flights](./flights/)
Flight data visualization with Python preprocessing for real-world aviation data.
- **Additional tech**: Python data processing

### 🗺️ [map](./map/)
Interactive map visualizations with geospatial data processing.
- **Additional tech**: Python geospatial libraries

### 📝 [names](./names/)
Creative visualization of name data with statistical analysis and interactive exploration.

## Requirements

- Modern web browser with JavaScript enabled
- Local web server for advanced projects (optional but recommended)

## Getting Started

### Simple Method
1. Navigate to any project directory
2. Open `index.html` in your web browser
3. Interact with the sketch!

### With Local Server (Recommended)
```bash
# Using Python
cd project_directory
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## Project Structure

Each p5.js project typically contains:
- `index.html` - Main HTML file
- `sketch.js` - Main p5.js code
- `style.css` - Styling
- `p5.min.js` - p5.js library
- Additional libraries as needed

## Creating New Projects

Use the template script from the repository root:
```bash
./templates/new_p5 my_new_sketch
```

This will create a new p5.js project with proper structure and Intellisense support.

## Resources

- [p5.js Reference](https://p5js.org/reference/)
- [p5.js Examples](https://p5js.org/examples/)
- [The Coding Train](https://www.youtube.com/thecodingtrain) - Excellent p5.js tutorials