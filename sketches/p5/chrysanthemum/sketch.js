// Chrysanthemum Curve
// http://paulbourke.net/geometry/chrysanthemum/

var x,y,r;
var pos = [[]];
var current = 0;
var angle = 0;

function setup() {
  createCanvas(600, 400, WEBGL);
  ambientLight(255,255,255);
  positions();
}

function positions() {
    for (var u = 0; u < 21 * PI; u+=0.01) {
        r = 5 * (1 + sin(11 * u / 5)) - 4 * pow(sin((17*u)/3),4) * pow(sin(2*cos(3*u) - 28 * u),8);
        x = r * cos(u) * 15;
        y = r * sin(u) * 15;
        z = (r/20+.2)*sin(r*2*PI/7) * 25;
        pos.push([x,y,z]);
    }
}

function draw() {
  background("#F8F1D0");
  rotateY(angle);
  angle += 0.01;

  ambientMaterial("#0B8457");
  beginShape(POINTS);
  for (var i = 1; i < pos.length; i++) {
      vertex(pos[i][0],pos[i][1],pos[i][2]);
  }
  endShape();

  ambientMaterial("#EAC100");
  beginShape();
  for (var i = 0; i < current; i++) {
      vertex(pos[i][0],pos[i][1],pos[i][2]);
  }
  endShape();

  if (current < pos.length) {
      current++;
  }

}
