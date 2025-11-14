let fontsize = 180;
let names;
let name;

let from;
let to;
let bg;
let bgDataLines;

function preload() {
    table = loadTable("names.csv", "csv", "header");
    bgDataLines = loadStrings('brazil.base64.txt');
}

function genName() {
    name1 = random(names);
    name2 = random(names);
    name = name1 + ' ' + name2;
}

function mouseClicked() {
  genName();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (bgDataLines && bgDataLines.length) {
    var dataUri = 'data:image/jpeg;base64,' + bgDataLines.join('');
    bg = loadImage(dataUri);
  }

  textFont('sans-serif');
  textSize(fontsize);
  textAlign(CENTER, CENTER);

  names = table.getColumn("name");

  genName();
}

function draw() {
  if (bg) {
    background(bg);
  } else {
    background(0);
  }

  strokeWeight(20);
  stroke(0);
  fill(255);

  text(name, windowWidth/2, windowHeight/2);
}