let w;

function setup() {
  createCanvas(600, 600);
  stroke("#5E5554");
  fill("#5E5554");
  w = new Walker();
}

function draw() {
  background("#ECE9E4");
  w.update();
  w.show();
}

class Walker {

  constructor() {
    this.pos = createVector(width / 2, height / 2);
    this.velocity = createVector(0, 0);
  }

  update() {
    let mouse = createVector(mouseX, mouseY);
    this.accel = p5.Vector.sub(mouse, this.pos);
    // this.accel.normalize();
    // this.accel.mult(0.1);
    this.accel.setMag(0.1);

    this.velocity.add(this.accel);
    this.pos.add(this.velocity);
  }

  show() {
    ellipse(this.pos.x, this.pos.y, 24, 24);
  }
}
