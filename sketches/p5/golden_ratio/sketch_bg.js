// golden ratio spiral
var presets = [2.513, 4.2, 8.386, 9.391, 4.735, 3.04, 2.037, 1.03, 2.142];
var current_preset = 0;

// parameters
var a = 0;
var r = 0;
var c = 1.0053611;

// trail of positions
var trail = [];
var index = 0;
var shifts = 0;

var x = 0;
var y = 0;
var z = 0;

// rotation
var angle = 0;
var val;
var old_val;

// UI
var canvas;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);

    stroke("#E23E57");
    fill("#E23E57");
    frameRate(60);

    val = presets[current_preset];
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
    a += val;

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

            current_preset += 1;
            val = presets[current_preset];
            if (current_preset >= presets.length) {
                current_preset = 0;
            }
        }
    }
    index += 1;

    for (var i = 2; i < trail.length; i++) {
        noFill();
        strokeWeight(i * 0.05);
        line(trail[i-1].x, trail[i-1].y, trail[i].x, trail[i].y);
        // ellipse(trail[i].x, trail[i].y, 5, 5);
        // triangle(trail[i-2].x, trail[i-2].y,trail[i-1].x, trail[i-1].y,trail[i].x, trail[i].y)
    }
    pop();
}
