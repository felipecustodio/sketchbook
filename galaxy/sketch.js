var a = 0;
var r = 0;
var c = 1.0053611;
var trail = [];
var x = 0;
var y = 0;
var z = 0;
var angle = 0;

function setup() {
	createCanvas(800, 600);
	stroke("#E23E57");
	fill("#E23E57");
	frameRate(60);
}

function draw() {
    push();
    background("#311D3F");
    translate(width / 2, height / 2, -50);

    r = a * pow(c, a);
	x += r * cos(a);
    y += r * sin(a);

	var pos = createVector(x, y);
    if (trail.length > 100) {
        trail.unshift();
    }
    trail.unshift(pos);


    a += 1;
    rotate(angle);
    angle += 0.01;

	for (var i = 0; i < trail.length; i++) {
        strokeWeight(i * 0.05);
        // line(trail[i-1].x, trail[i-1].y, trail[i].x, trail[i].y);
		ellipse(trail[i].x, trail[i].y, i * 0.5, i * 0.5);
	}
    pop();
}
