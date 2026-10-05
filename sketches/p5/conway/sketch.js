const cell = 12;
const columns = 64;
const rows = 48;
let grid;
let paused = false;

function setup() {
  createCanvas(columns * cell, rows * cell);
  frameRate(10);
  grid = Array.from({ length: rows }, () => Array.from({ length: columns }, () => random() < 0.28));
}

function draw() {
  background('#E9E2D0');
  noStroke();
  fill('#D45D79');
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      if (grid[y][x]) rect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
    }
  }
  if (paused) return;
  grid = grid.map((row, y) => row.map((alive, x) => {
    let neighbors = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if ((dx || dy) && grid[(y + dy + rows) % rows][(x + dx + columns) % columns]) neighbors++;
      }
    }
    return neighbors === 3 || (alive && neighbors === 2);
  }));
}

function mousePressed() {
  const x = floor(mouseX / cell);
  const y = floor(mouseY / cell);
  if (x >= 0 && x < columns && y >= 0 && y < rows) grid[y][x] = !grid[y][x];
}

function keyPressed() {
  if (key === ' ') paused = !paused;
}
