var radius;
var a = 0;
var slider;
var speed = 0;

function setup() {
	createCanvas(800, 600);
	stroke("#D45D79");
	fill("#D45D79");

    slider = createSlider(100,800,0,1);
    slider.position(20, 20);

	frameRate(60);
}

function drawCircle(x, y, radius) {
  ellipse(x, y, radius, radius);
  if (radius > 2) {
    radius *= slider.value()/1000;

    // to animate:
    // radius *= slider.value()/1000 + speed;
    
    drawCircle(x + radius/2, y, radius/1.5);
    drawCircle(x - radius/2, y, radius/1.5);
  }
}

function draw() {
    noFill();
    background("#E9E2D0");
    text(slider.value(), slider.x * 2 + slider.width, 35);
    translate(width / 2, height / 2);
    drawCircle(0, 0, slider.value());
    if (speed + slider.value()/1000 < 0.9) {
        speed += 0.01;
    }
}
