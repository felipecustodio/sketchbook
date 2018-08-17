function Particle(x, y) {

  this.f1 = 2;
  this.p1 = PI/16;
  this.d1 = -0.02;

  this.f2 = 6;
  this.p2 = PI/2;
  this.d2 = -0.0315;

  this.f3 = 1.002;
  this.p3 = 13 * PI/16;
  this.d3 = -0.02;

  this.f4 = 3;
  this.p4 = PI;
  this.d4 = -0.02;

  this.t = 0;

  this.x = x;
  this.y = y;
  this.z = 0;

  colors = ["#35477d", "#6c5b7b", "#c06c84", "#f67280"];
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.alpha = 0.001;

  this.trail_length = Math.floor(Math.random() * 20);

  this.head_size = Math.floor((Math.random() * 8) + 2);
  
  console.log("Spawned particle.");

  this.history = [];
  
  this.update = function() {
    this.x = exp(-this.d1 * this.t) * sin((this.t * this.f1) + this.p1) + exp(-this.d2 * this.t) * sin(this.t * this.f2 + this.p2);
    this.y = exp(-this.d3 * this.t) * sin((this.t * this.f3) + this.p3) + exp(-this.d4 * this.t) * sin(this.t * this.f4 + this.p4);
    this.z = sin(this.p4 + this.f4 * this.t) * exp(this.d4 * this.t);

    this.x *= 120;
    this.y *= 120;
    this.z *= 120;

    if (this.alpha < 5) {
      this.alpha += 0.001;
    }

    this.t += 0.01;
    if (this.t >= 200) {
      this.t = 0;
    }

    var v = createVector(this.x, this.y, this.z);
    this.history.push(v);
    if (this.history.length > this.trail_length) {
      this.history.splice(0, 1);
    }
  }
  
  this.show = function() {
    strokeWeight(this.alpha);
    stroke(this.color);
    noFill();
    beginShape(POINTS);
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      vertex(pos.x, pos.y, pos.z);
    }
    endShape();

    fill(this.color);
    // ellipse(this.x, this.y, this.head_size, this.head_size);
    translate(this.x, this.y, this.z);
    sphere(this.head_size, 5, 5);
    translate(-this.x, -this.y, -this.z);
  }
}