var mapimg;
var clat = 0;
var clon = 0;
var ww = 1280;
var hh = 720;
var zoom = 1;

var countries;

var trail = [];
var shifts = 0;

var current;
var ellipse_size = 5;
var i = 1;
var points = [];

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

function preload() {
  // The clon and clat in this url are edited to be in the correct order.
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clon + ',' + clat + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY3JvY2hpIiwiYSI6ImNqZzh5dDN3cThzaWMyd21kbzh0cWxvZGgifQ.WGF1BgdeYFXPIC8TStBCxA');
  countries = loadStrings('data/countries.csv');
}

function setup() {
	createCanvas(ww, hh);
	frameRate(5);
	stroke("#D45D79");
	fill("#D45D79");
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

		ellipse(x, y, 2, 2);
	}
}

function draw() {
	translate(width / 2, height / 2);

	image(mapimg, 0, 0);
	if (i >= points.length) {
		i = 1;
	}

	if (ellipse_size == 5) {
		current = i;
	}


	stroke("#D45D79");
	fill("#D45D79");
	ellipse(points[i-1].x,points[i-1].y,5);
	ellipse(points[i].x,points[i].y,5);

	strokeWeight(2);
	line(points[i-1].x,points[i-1].y,points[i].x,points[i].y);
	i++;

}
