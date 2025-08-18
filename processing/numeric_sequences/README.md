# Numeric Sequences

Mathematical sequence visualizations with a focus on prime numbers and their visual patterns.

## Features

- **Prime Number Visualization**: Real-time visualization of prime number sequences
- **Interactive Animation**: Dynamic progression through number sequences
- **Visual Patterns**: Geometric representation of mathematical properties
- **Motion Blur Rendering**: High-quality rendering with motion blur effects
- **Multiple Templates**: Different visualization approaches for various sequences

## Implementations

### Prime Number Visualizer (`template_pde.pde`)
- Visualizes prime numbers as they appear in the number line
- Shows progression through integers with prime numbers highlighted
- Creates visual patterns based on prime distribution
- Real-time sequence display with text output

### Fibonacci Template (`template_pde_fib.pde`)
- Template structure for Fibonacci sequence visualization
- Contains framework for extending to other numeric sequences
- Includes motion blur and recording capabilities

## How It Works

The visualization treats numbers as points on a coordinate system and applies different visual treatments based on their mathematical properties:

- **Prime Detection**: Uses precomputed prime arrays for efficient lookup
- **Visual Mapping**: Maps numeric properties to visual elements (position, color, size)
- **Animation**: Time-based progression through the sequence
- **Pattern Recognition**: Reveals mathematical patterns through visual representation

## Usage

1. Open either `.pde` file in Processing IDE
2. Run the sketch to see the sequence visualization
3. Watch as numbers progress and patterns emerge
4. Prime numbers are highlighted with special visual treatment
5. The sequence text is displayed at the bottom of the screen

## Technical Features

- **Efficient Prime Detection**: Precomputed prime arrays for fast lookup
- **Motion Blur**: Configurable motion blur for smooth animations
- **Frame Recording**: Built-in frame export for creating videos
- **Typography**: Custom font loading for text display
- **Offset Arrays**: Dynamic offset calculations for visual effects

## Mathematical Background

This project explores the visual nature of mathematical sequences, particularly focusing on:
- Prime number distribution and patterns
- The gaps between consecutive primes
- Visual representation of number theory concepts
- The beauty of mathematical structures when rendered graphically

## Customization

The templates provide a foundation for visualizing other numeric sequences:
- Fibonacci numbers
- Perfect squares
- Triangular numbers
- Any custom mathematical sequence