# Conway's Game of Life

An interactive implementation of Conway's famous cellular automaton - a zero-player game that demonstrates how complex patterns can emerge from simple rules.

## 🎯 Description

Conway's Game of Life is a cellular automaton devised by mathematician John Conway. Despite its simplicity, it can produce remarkably complex and interesting patterns. Each cell in the grid follows simple rules based on its neighbors, yet the overall behavior can be surprisingly intricate.

## 📋 Rules

1. **Birth**: A dead cell with exactly 3 live neighbors becomes alive
2. **Survival**: A live cell with 2 or 3 live neighbors stays alive
3. **Death**: A live cell with fewer than 2 or more than 3 neighbors dies

## ✨ Features

- **Interactive Grid**: Click to toggle cells on/off
- **Play/Pause Controls**: Start and stop the simulation
- **Speed Control**: Adjust simulation speed
- **Clear/Random**: Reset grid or generate random patterns
- **Pattern Library**: Load classic Game of Life patterns
- **Real-time Statistics**: Population count and generation tracking

## 🚀 How to Run

1. Open `index.html` in a modern web browser
2. Or serve locally:
   ```bash
   python -m http.server 8000
   ```
3. Click cells to create initial patterns and hit play!

## 🎮 Interaction

- **Mouse Click**: Toggle individual cells
- **Spacebar**: Play/pause simulation
- **R Key**: Generate random pattern
- **C Key**: Clear all cells
- **+ / - Keys**: Adjust simulation speed

## 🎨 Famous Patterns

Try creating these classic patterns:
- **Glider**: A simple moving pattern
- **Blinker**: Oscillates between two states
- **Block**: A stable 2x2 square
- **Gosper Glider Gun**: Continuously produces gliders

## 🛠️ Technology

- **p5.js**: Graphics and interaction
- **HTML5 Canvas**: High-performance grid rendering
- **JavaScript**: Game logic and controls

## 🔬 Mathematical Significance

The Game of Life demonstrates important concepts in computer science and mathematics:
- **Emergence**: Complex behavior from simple rules
- **Turing Completeness**: Can simulate any computer program
- **Cellular Automata**: Foundation for studying complex systems