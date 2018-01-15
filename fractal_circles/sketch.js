var radius;
var a = 0;

function setup() {
	createCanvas(800, 600);
	stroke("#D45D79");
	fill("#D45D79");
	frameRate(60);
}

function drawCircle(x, y, radius) {
  ellipse(x, y, radius, radius);
  if (radius > 2) {
    radius *= 0.75;
    drawCircle(x + radius/2, y, radius/2);
    drawCircle(x - radius/2, y, radius/2);
  }
}

function draw() {
    push();
    noFill();
    background("#E9E2D0");
    translate(width / 2, height / 2);
    drawCircle(0, 0, 500);
    pop();
}
