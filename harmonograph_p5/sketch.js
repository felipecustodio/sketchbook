// Daniel Shiffman
// code for https://youtu.be/vqE8DMfOajk

var particles = [];

function setup() {
  createCanvas(600, 600);
}

function mousePressed() {
  particles.push(new Particle(width/2, height/2));
  if (particles.length > 1000) {
    particles.splice(0, 1);
  }
}

function draw() {
  background("#182952");
  translate(width / 2, height / 2);
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
  
}