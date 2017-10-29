var a = 0;
var r = 1;
var c = 1.0053611;
var trail = [];
var x = 0;
var y = 0;
var z = 0;
var angle = 0;

function setup() {
	createCanvas(800, 600);
	background("#311D3F");
	stroke("#E23E57");
	fill("#E23E57");
	frameRate(15);
}

function draw() {
	
	//x += a;
	x = r * cos(a);
  y = r * sin(a);
	
	var pos = createVector(x, y);
	trail.push(pos);
	
	a += 7;
	// z += 0.01;
  print(a);
	r = a * pow(c, a);
		
	translate(width / 2, height / 2);
	strokeWeight(2);
  
	for (var i = 1; i < trail.length; i++) {
		line(trail[i-1].x, trail[i-1].y, trail[i].x, trail[i].y);
		ellipse(trail[i].x, trail[i].y, 5, 5);
	}
		
}