

var a = 0;
var r = 0;
var c = 1.0053611;
var trail = [];
var x = 0;
var y = 0;
var z = 0;
var angle = 0;
var index = 0;
var shifts = 0;

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
    rotate(angle);
    angle += 0.01;

    // Spiral math
    r = a * pow(c, a);
		x += r * cos(a);
    y += r * sin(a);
    a += 2;

	var pos = createVector(x, y);
    trail[index] = pos;

    // This can be improved a lot
    if (index > 200) {
        trail.shift();
        shifts++;
        index--;
        if (shifts == 500) {
            index = -1;
            shifts = 0;
            trail = [];
            x = 0;
            y = 0;
            r = 0;
            a = 0;
        }
    }
    index += 1;

	for (var i = 2; i < trail.length; i++) {
        // noFill();
        strokeWeight(i * 0.05);
        // line(trail[i-1].x, trail[i-1].y, trail[i].x, trail[i].y);
		ellipse(trail[i].x, trail[i].y, i * 0.5, i * 0.5);
        // triangle(trail[i-2].x, trail[i-2].y,trail[i-1].x, trail[i-1].y,trail[i].x, trail[i].y)
	}
    pop();
}
