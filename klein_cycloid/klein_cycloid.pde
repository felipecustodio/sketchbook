// Klein Cycloid
// http://paulbourke.net/geometry/kleincycloid/
// http://colorhunt.co/c/98625

float x,y,z;
float angle = 0;

ArrayList<PVector> vectors = new ArrayList<PVector>();
ArrayList<PVector> vectors_2 = new ArrayList<PVector>();

int i, j = 0;
int nu=200;
int nv=50;

float a = 10.0;
float b = 3.0;
float c = 2.0;
float u,v;

void setup() {
  size(600, 400, P3D);
  // Calculate positions
  for (int i = 0; i < nu; i++) {
    for (int j = 0; j < nv; j++) {
      u = i * 2 * b * c * PI / nu;
      v = j * 4 * PI / nv;
      x = cos(u/c) * cos(u/b) * (a + cos(v)) + sin(u/b) * sin(v) * cos(v);
      y = sin(u/c) * cos(u/b) * (a + cos(v)) + sin(u/b) * sin(v) * cos(v);
      z = -sin(u/b) * (a + cos(v)) + cos(u/b) * sin(v) * cos(v);
      println(i,j);
      vectors.add(new PVector(x,y,z));
    }
  }  
}

void draw() {
  background(#2C2E3E);
  translate(width/2, height/2);
  rotateY(angle);
  
  
  if (mouseX > width/2 && mouseX < width/2 + 10) {
    angle += 0.01;
  } else if (mouseX > width/2 - 10) {
    angle -= 0.01;
  }
  
  u = i * 2 * b * c * PI / nu;
  v = j * 4 * PI / nv;
  x = cos(u/c) * cos(u/b) * (a + cos(v)) + sin(u/b) * sin(v) * cos(v);
  y = sin(u/c) * cos(u/b) * (a + cos(v)) + sin(u/b) * sin(v) * cos(v);
  z = -sin(u/b) * (a + cos(v)) + cos(u/b) * sin(v) * cos(v);
  vectors_2.add(new PVector(x,y,z));

  j += 1;
  if (i > nu) {
    i = 0;
  }  
  if (j > nv) {
    j = 0;
    i += 1;
  }
  
  println(i, j);

  noFill();
  strokeWeight(0.2);
  scale(20);
  
  stroke(#F6F6F6);
  beginShape(POINTS);
  for (PVector v : vectors) {
    vertex(v.x, v.y, v.z);
  }
  endShape();
  
  stroke(#EE2B47);
  beginShape();
  for (PVector v : vectors_2) {
    vertex(v.x, v.y, v.z);
  }
  endShape();
}