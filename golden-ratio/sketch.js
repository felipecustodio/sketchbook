// golden ratio spiral
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

// UI
var canvas;
var slider;
var val = 0;
var old_val = 0;

var toggle_triangle = false;
var toggle_ellipse = false;
var toggle_line = true;
var toggle_bg = true;
var toggle_ui = true;
var toggle_pause = false;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('display', 'block');

    frameRate(60);

    textFont("Computer Modern");

    slider = createSlider(0, 10, 2.513, 0);
    slider.position(20, 20);
    slider.style('width', '200px');
}


function draw() {
    if (toggle_bg) {
        background("#311D3F");
    }

    val = slider.value();

    // reset when slider value changes
    if (val != old_val) {
        old_val = val;
        index = -1;
        shifts = 0;
        trail = [];
        x = 0;
        y = 0;
        r = 0;
        a = 0;
    }

    stroke("#FBEED7");
    fill("#FBEED7");
    textSize(22);
    if (toggle_ui) {
        text(val, slider.x * 2 + slider.width, 40);
        text("B - Toggle background T - Toggle triangles L - Toggle lines E - Toggle ellipses H - Hide UI P - Pause", 20, height-20);
    }
    
    // UI
    if (toggle_ui) {
        stroke("#ff7657");
        fill("#ff7657");
        if (toggle_line) {
            stroke("#FBEED7");
            fill("#FBEED7");
        }
        text("Lines", 20, 70);
        
        stroke("#ff7657");
        fill("#ff7657");
        if (toggle_ellipse) {
            stroke("#FBEED7");
            fill("#FBEED7");
        }
        text("Ellipses", 20, 100);
        
        stroke("#ff7657");
        fill("#ff7657");
        if (toggle_triangle) {
            stroke("#FBEED7");
            fill("#FBEED7");
        }
        text("Triangles", 20, 130);

        stroke("#ff7657");
        fill("#ff7657");
        if (toggle_bg) {
            stroke("#FBEED7");
            fill("#FBEED7");
        }
        text("Background", 20, 160);

        slider.show();
    } else {
        slider.hide();
    }

    push();
    translate(width / 2, height / 2, -50);
    rotate(angle);
    angle += 0.01;

    // Spiral math
    r = a * pow(c, a);
    x += r * cos(a);
    y += r * sin(a);
    a += val;

    var pos = createVector(x, y);
    trail[index] = pos;

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

    stroke("#E23E57");
    fill("#E23E57");
    for (var i = 2; i < trail.length; i++) {
        strokeWeight(i * 0.05);

        if (toggle_line) {
            line(trail[i-1].x, trail[i-1].y, trail[i].x, trail[i].y);
        }

        if (toggle_ellipse) {
            ellipse(trail[i].x, trail[i].y, 5, 5);
        }

        if (toggle_triangle) {
            triangle(trail[i-2].x, trail[i-2].y,trail[i-1].x, trail[i-1].y,trail[i].x, trail[i].y)
        }
    }

    pop();
}

function keyPressed() {
    if (key == 'b' || key == 'B') {
        if (toggle_bg) {
            toggle_bg = false;
        } else {
            toggle_bg = true;
        }
    }

    if (key == 'e' || key == 'E') {
        if (toggle_ellipse) {
            toggle_ellipse = false;
        } else {
            toggle_ellipse = true;
        }
    }

    if (key == 'l' || key == 'L') {
        if (toggle_line) {
            toggle_line = false;
        } else {
            toggle_line = true;
        }
    }

    if (key == 't' || key == 'T') {
        if (toggle_triangle) {
            toggle_triangle = false;
        } else {
            toggle_triangle = true;
        }
    }

    if (key == 'h' || key == 'H') {
        if (toggle_ui) {
            toggle_ui = false;
        } else {
            toggle_ui = true;
        }
    }

    if (key == 'p' || key == 'P') {
        if (toggle_pause) {
            toggle_pause = false;
            loop();
            
        } else {
            toggle_pause = true;
            noLoop();
        }
    }
}