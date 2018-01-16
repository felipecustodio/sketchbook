// golden ratio
var a = 0;
var r = 0;
var c = 1.0053611;

// trail and position
var trail = [];
var x = 0;
var y = 0;
var z = 0;

// velocity
var angle = 0;
var slider;

// array stuff
var index = 0;
var shifts = 0;

function setup() {
	createCanvas(800, 600);
	stroke("#E23E57");
	fill("#E23E57");
	frameRate(60);

    slider = createSlider(0, 10, 0, 0);
    slider.position(20, 20);
}

function draw() {
    push();
    background("#311D3F");
    text(slider.value(), slider.x * 2 + slider.width, 35);

    translate(width / 2, height / 2, -50);
    rotate(angle);
    angle += 0.01;

    // Spiral math
    r = a * pow(c, a);
	x += r * cos(a);
    y += r * sin(a);
    a += slider.value();

    // Some a values:
    // a += 4.2 -- beautiful triangles
    // a += 0.01;

	var pos = createVector(x, y);
    trail[index] = pos;

    // This can be improved a lot
    if (index > 100) {
        trail.shift();
        shifts++;
        index--;
        if (shifts == 300) {
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
        line(trail[i-1].x, trail[i-1].y, trail[i].x, trail[i].y);
		// ellipse(trail[i].x, trail[i].y, 5, 5);
        // triangle(trail[i-2].x, trail[i-2].y,trail[i-1].x, trail[i-1].y,trail[i].x, trail[i].y)
	}
    pop();
}
