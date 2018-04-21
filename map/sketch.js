// map
var mapimg;
var clat = 0;
var clon = 0;
var ww = 1280;
var hh = 720;
var zoom = 1.4;

// dataset
var countries;

// trail
var i = 1;
var time = 0;
var points = [];

var connections = [];

// web mercator
function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  if (alpha <= 0.05) {
      alpha = 0.05;
  }
  return color('rgba(' +  [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clon + ',' + clat + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY3JvY2hpIiwiYSI6ImNqZzh5dDN3cThzaWMyd21kbzh0cWxvZGgifQ.WGF1BgdeYFXPIC8TStBCxA');
  countries = loadStrings('data/countries.csv');
}

function setup() {
	createCanvas(ww, hh);

    smooth();
	frameRate(20);

	translate(width / 2, height / 2);
	imageMode(CENTER);
	image(mapimg, 0, 0);

	var cx = mercX(clon);
  	var cy = mercY(clat);

	// parse countries with latitude, longitude
	for (var i = 1; i < countries.length; i++) {
		var data = countries[i].split(/,/);

		var lat = data[1];
    	var lon = data[2];

		var x = mercX(lon) - cx;
	    var y = mercY(lat) - cy;

		if (x < - width/2) {
	    	x += width;
	    } else if (x > width / 2) {
	    	x -= width;
	    }

		var pos = createVector(x,y);
		append(points,pos);
	}
}

function draw() {
	translate(width / 2, height / 2);
    imageMode(CENTER);
	image(mapimg, 0, 0);

    for (var j = 0; j < points.length; j++) {
        stroke("#FBF0F0");
        fill("#FBF0F0");
        // noFill();
		ellipse(points[j].x, points[j].y, 4, 4);
	}

    stroke("#D45D79");
	fill("#D45D79");
	ellipse(points[i-1].x, points[i-1].y, 5);
	ellipse(points[i].x, points[i].y, 5);

    // 0 = max
    // time atual = min
    strokeWeight(2);
    var alpha = 1;
    stroke(colorAlpha('#D45D79', alpha));
	// line(points[i-1].x,points[i-1].y,points[i].x,points[i].y);

    country1 = countries[i].split(/,/);
    country2 = countries[i+1].split(/,/);
    console.log(country1[3] + " -> " + country2[3]);

    var connection = createVector(i-1,i,1);
    append(connections, connection);
    console.log(connections.length);

    // draw all connections
    for (var j = 0; j < connections.length; j++) {
        connection = connections[j];
        stroke(colorAlpha('#D45D79', connection.z));
        connections[j].z -= 0.15;
        line(points[connection.x].x,points[connection.x].y,points[connection.y].x,points[connection.y].y);
    }

    i++;
    time += 1;
    if (i >= points.length) {
		i = 1;
        // points.shift();
	}
}
