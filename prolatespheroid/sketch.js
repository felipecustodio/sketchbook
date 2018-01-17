// Prolatespheroid
// http://paulbourke.net/geometry/prolatespheroid/

var a = 2;
var b = 2.5;
var c = 2;
var previous_a = a;
var previous_b = b;
var previous_c = c;

var slider_a;
var slider_b;
var slider_c;

var x,y,r;
var radius = 10;
var pos = [[]];
var current = 100;
var angle = 0;

function setup() {
    createCanvas(600, 400, WEBGL);
    ambientLight(255,255,255);

    slider_a = createSlider(-10,20,2);
    slider_b = createSlider(-10,20,2.5);
    slider_c = createSlider(-10,20,2);

    positions();
}

function positions() {
    pos = [[]];
    for (var theta = 0; theta < 2 * PI; theta+=0.1) {
        for (var phi = -PI; phi < PI; phi+=0.1) {
            x = a * cos(theta) * cos(phi);
            y = b * cos(theta) * sin(phi);
            z = c * sin(phi);
            pos.push([x,y,z]);
        }
    }
    previous_a = a;
    previous_b = b;
    previous_c = c;
}

function draw() {
    push();
    background("#2C2E3E");
    rotateY(angle);
    angle += 0.01;

    scale(50);

    a = slider_a.value();
    b = slider_b.value();
    c = slider_c.value();
    if (a != previous_a || b != previous_b || c != previous_c) {
        positions();
    }

    ambientMaterial("#F6F6F6");
    beginShape();
    for (var i = 1; i < pos.length; i++) {
        vertex(pos[i][0],pos[i][1],pos[i][2]);
    }
    endShape();


    ambientMaterial("#EE2B47");
    beginShape(TRIANGLE_FAN);
    for (var i = current - 100; i < current; i++) {
        vertex(pos[i][0],pos[i][1],pos[i][2]);
    }
    endShape();

    if (current < pos.length) {
        current++;
    } else {
        current = 100;
    }
    pop();

}
