var bg;

var safe_radius = 250;
var storm_radius = 500;

var safe_center = 0;
var storm_center = 0;

var safe_points = [];
var storm_points = [];

var speed = 0.01;
var distance = 0;
var farthest_point_distance = 0;
var farthest_point;

var zoom = 1;
var end_game = 0;

function setup() {
	bg = loadImage("map.png");
	background(bg);
	createCanvas(800, 800);
	rectMode(CENTER);

	safe_center = createVector(random(0,60),random(0,60));
	storm_center = createVector(0,0);
	start_storm_circle();
	start_safe_circle();

	// reposition();
	noFill();
}

function reposition() {

	if (safe_radius > 20) {
		safe_center.x += random(-safe_radius/4, safe_radius/4);
		safe_center.y += random(-safe_radius/4, safe_radius/4);
		safe_radius -= random(100,100);
		if (safe_radius < 20) {
			safe_radius = 20;
			end_game = 1;
		}
	}
	start_safe_circle();
}

function start_safe_circle() {
	safe_points = [];
	for (var i = 0; i < 360; i++) {
		var x = safe_radius * cos(i) + safe_center.x;
		var y = safe_radius * sin(i) + safe_center.y;
		safe_points.push(createVector(x, y));
	}
}

function start_storm_circle() {
	storm_points = [];
	for (var i = 0; i < 360; i++) {
		var x = storm_radius * cos(i) + storm_center.x;
		var y = storm_radius * sin(i) + storm_center.y;
		storm_points.push(createVector(x,y));
	}
}

function calc_storm_points() {

	for (var i = 0; i < 360; i++) {
    // https://math.stackexchange.com/questions/333350/moving-point-along-the-vector
		// Calculate new position
		var vector = storm_points[i]; // B
		var safe = safe_points[i].copy();
		var distance_vector = safe.sub(vector);

		// Search for biggest distance
		var distance = vector.dist(safe);
		if (distance > farthest_point_distance) {
			farthest_point_distance = distance;
			farthest_point = i;
		}

		// Check if farthest point arrived on safe circle
		if ((storm_points[farthest_point].dist(safe_points[farthest_point].copy())) <= 10) {
			reposition();
		}

		vector = vector.add(distance_vector.mult(speed));
		storm_points[i] = vector;

	}
}

function draw() {
	background(bg);
	if (end_game) {
		textSize(32);
		strokeWeight(0.9);
		stroke("#EE9D0E");
		fill("#FBDB1D");
		textFont("Teko");
	 	text("WINNER WINNER CHICKEN DINNER!",
				mouseX, mouseY, 200, 200);
	}

	translate(width/2,height/2);
	strokeWeight(8);

	noFill();
	// Safe
	stroke("#FFFFFF");
	beginShape(POINTS);
	for (var i = 0; i < 360; i++) {
		vertex(safe_points[i].x,safe_points[i].y);
	}
	endShape();

	// Storm
	calc_storm_points();
	stroke("#0A3B72");
	beginShape(POINTS);
	for (var i = 0; i < 360; i++) {
		vertex(storm_points[i].x,storm_points[i].y);
	}
	endShape();
}
