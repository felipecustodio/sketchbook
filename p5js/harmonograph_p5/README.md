# Harmonograph p5.js

An interactive web-based harmonograph simulation with audio synthesis and 3D visualization capabilities.

## 🎯 Description

This is the web version of the classic harmonograph, featuring real-time pattern generation, interactive audio synthesis, and immersive 3D visualization. The harmonograph simulates the complex patterns created by the intersection of multiple pendulums, enhanced with modern web technologies and sound generation.

## ✨ Features

- **Real-time Harmonograph**: Interactive simulation of multiple pendulum systems
- **Audio Synthesis**: Sound generation using the Timbre.js library
- **3D Visualization**: Immersive camera controls with p5.easycam
- **Particle Systems**: Beautiful particle trails and effects
- **Windchime Audio**: Musical elements synchronized with visual patterns
- **ES6 Version**: Modern JavaScript implementation available
- **Interactive Controls**: Mouse and keyboard interaction for real-time parameter adjustment

## 🚀 How to Run

1. Open `index.html` in a modern web browser
2. Or serve locally for better audio performance:
   ```bash
   python -m http.server 8000
   ```
3. Use headphones for the best audio experience!

## 🎮 Controls

- **Mouse Movement**: Influences harmonograph parameters
- **Click**: Add new particle systems
- **Keyboard**: Various keys modify audio and visual parameters
- **3D Navigation**: Drag to rotate, scroll to zoom (3D mode)

## 🎵 Audio Features

- **Timbre.js Integration**: Advanced audio synthesis
- **Windchime Effects**: Musical tones based on pattern generation
- **Real-time Audio**: Sound parameters linked to visual elements
- **Spatial Audio**: 3D positioned audio sources

## 📂 Project Structure

- `sketch.js` - Main harmonograph logic
- `particle.js` - Particle system implementation
- `windchime.js` - Audio synthesis and musical elements
- `ES6_Version/` - Modern JavaScript implementation
- `timbre.js` - Audio synthesis library
- `p5.easycam.min.js` - 3D camera controls

## 🛠️ Technology

- **p5.js**: Core graphics and interaction
- **p5.sound**: Web Audio API integration
- **Timbre.js**: Advanced audio synthesis
- **p5.easycam**: 3D navigation and camera controls
- **HTML5**: Canvas and Web Audio API

## 🔗 Related Projects

- [Processing Harmonograph](../../processing/harmonograph/) - Desktop version
- [3D Harmonograph](../../processing/harmonograph3D/) - Advanced 3D Processing version

## 🎨 Mathematical Background

The harmonograph creates patterns based on the mathematical principles of:
- **Lissajous Curves**: Parametric curves from harmonic oscillation
- **Phase Relationships**: Complex interactions between multiple frequencies
- **Damping Functions**: Natural decay of oscillating systems
- **Harmonic Series**: Musical relationships in frequency ratios