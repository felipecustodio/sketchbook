let font;
let fontsize = 180;
let names;
let name;

let from;
let to;
let bg;

function preload() {
    font = loadFont("font.otf");
    table = loadTable("names.csv", "csv", "header");
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

  bg = loadImage("brazil.jpg");

  textFont(font);
  textSize(fontsize);
  textAlign(CENTER, CENTER);

  names = table.getColumn("name");

  genName();
}

function draw() {
  background(bg);

  strokeWeight(20);
  stroke(0);
  fill(255);

  text(name, windowWidth/2, windowHeight/2);
}