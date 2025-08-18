# Lissajous Curve Generator

An interactive generator for creating beautiful Lissajous curves with real-time parameter controls.

## 🎯 Description

Lissajous curves are fascinating mathematical patterns created by the intersection of two sinusoidal waves at different frequencies. Named after French physicist Jules Antoine Lissajous, these curves create beautiful, symmetric patterns that have both mathematical significance and aesthetic appeal.

## ✨ Features

- **Real-time Generation**: Watch curves form as you adjust parameters
- **Interactive Controls**: Modify frequency ratios, phase, and amplitude
- **Multiple Modes**: Different visualization styles and color schemes
- **Smooth Animation**: Fluid curve drawing with trail effects
- **Mathematical Precision**: Accurate implementation of Lissajous equations
- **Export Options**: Save your favorite curves as images

## 🚀 How to Run

1. Open `index.html` in a modern web browser
2. Or serve locally:
   ```bash
   python -m http.server 8000
   ```
3. Use the controls to create beautiful mathematical art!

## 🎮 Controls

- **Frequency Sliders**: Adjust X and Y wave frequencies
- **Phase Control**: Change the phase relationship between waves
- **Amplitude Settings**: Modify curve size and proportions
- **Speed Control**: Change animation speed
- **Color Palette**: Switch between different color schemes
- **Reset Button**: Return to default parameters

## 🔢 Mathematics

Lissajous curves are defined by parametric equations:
- x = A × sin(a × t + δ)
- y = B × sin(b × t)

Where:
- A, B = amplitudes
- a, b = frequencies
- δ = phase difference
- t = time parameter

## 🎨 Pattern Types

Different frequency ratios create distinct patterns:
- **1:1** - Diagonal lines or circles
- **1:2** - Figure-eight patterns
- **2:3** - Complex three-lobed curves
- **3:4** - Intricate four-lobed patterns
- **Irrational ratios** - Never-repeating, dense patterns

## 🛠️ Technology

- **p5.js**: Mathematical computation and rendering
- **HTML5 Canvas**: High-performance curve drawing
- **CSS3**: Modern UI controls and styling
- **JavaScript**: Real-time parameter manipulation

## 🎵 Applications

Lissajous curves appear in:
- **Audio Engineering**: Oscilloscope displays of stereo signals
- **Physics**: Harmonic oscillator combinations
- **Art**: Geometric pattern design
- **Music Visualization**: Frequency relationship displays

## 🔗 References

- Named after Jules Antoine Lissajous (1822-1880)
- Used in early oscilloscope technology
- Related to Bowditch curves and harmonographs