// Klein Cycloid
// http://paulbourke.net/geometry/kleincycloid/
// http://colorhunt.co/c/98625

var x,y,z;
var angle = 0;

var vectors = [[]];
var vectors_2 = [[]];

var i = Number(0);
var j = 0;
var nu = 400;
var nv = 50;

var a = 10.0;
var prev_a;
var b = 3.0;
var prev_b;
var c = 2.0;
var prev_c;
var u,v;

var slider_a;
var slider_b;
var slider_c;

function positions() {
    vectors = [[]];
    for (var i = 0; i < nu; i++) {
      for (var j = 0; j < nv; j++) {
        u = i * 2 * b * c * PI / nu;
        v = j * 4 * PI / nv;
        x = cos(u/c) * cos(u/b) * (a + cos(v)) + sin(u/b) * sin(v) * cos(v);
        y = sin(u/c) * cos(u/b) * (a + cos(v)) + sin(u/b) * sin(v) * cos(v);
        z = -sin(u/b) * (a + cos(v)) + cos(u/b) * sin(v) * cos(v);
        vectors.push([x,y,z]);
      }
    }
    prev_a = a;
    prev_b = b;
    prev_c = c;
}

function setup() {
  createCanvas(600, 400, WEBGL);
  slider_a = createSlider(0,100,10);
  slider_b = createSlider(0,100,3);
  slider_c = createSlider(0,100,2);

  ambientLight(255,255,255);
  positions();

}

function draw() {
  background("#F2E8C6");
  scale(15);
  rotateY(angle);
  angle += 0.01;

  a = slider_a.value();
  b = slider_b.value();
  c = slider_c.value();
  // Calculate positions
  if (a != prev_a || b != prev_b || c != prev_c) {
      positions();
  }

  // Draw points
  ambientMaterial("#BB0029");
  beginShape(LINES);
  for (var i = 1; i < vectors.length; i++) {
    vertex(vectors[i][0], vectors[i][1], vectors[i][2]);
    vertex(vectors[i-1][0], vectors[i-1][1], vectors[i-1][2]);
  }
  endShape();


}
