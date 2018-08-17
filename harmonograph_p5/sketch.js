var particles = [];
const windchime = new Windchime();

var gamma;
var xpos, ypos;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // default values
  gamma = 0;
}

function mousePressed() {
  particles.push(new Particle(0, 0));
  windchime.soundNewUser();
  windchime.soundWikiChange();
  if (particles.length > 1000) {
    particles.splice(0, 1);
  }
}

function draw() {
  background("#262525");
  rotate(radians(gamma));
  for (var i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
}

// accelerometer
window.addEventListener('deviceorientation', function (e) {
  gamma = e.gamma;
});