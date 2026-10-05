let font;
let fontsize = 180;
let names;
let name;

let from;
let to;
let bg;

function genName() {
    name1 = random(names);
    name2 = random(names);
    name = name1 + ' ' + name2;
}

function mouseClicked() {
  genName();
}

async function setup() {
  [font, table, bg] = await Promise.all([
    loadFont("font.otf"),
    loadTable("names.csv", ",", "header"),
    loadImage("brazil.jpg")
  ]);
  createCanvas(windowWidth, windowHeight);

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
