// map
var mapimg;
var clat = 0;
var clon = 0;
var ww = 1280;
var hh = 720;
var zoom = 1.4;

// dataset
var airports_data;
var flights_data;
// lat,lon converted to x,y coordinates
var airports = [];
var flights = [];

// colors
// mapbox 'standard' designer style
// #d14545
// #f0e9d8
// #31339e

// trail
var i = 0;
var connections = [];

var stop;
var runs = 0;

// font
var font;

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
  if (alpha <= 0.1) {
      alpha = 0.1;
  }
  return color('rgba(' +  [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function preload() {
    console.log("LOADING MAP");

    // mapbox://styles/crochi/cjgadyzig06ba2ss5ngizxhvn
    mapimg = loadImage('https://api.mapbox.com/styles/v1/crochi/cjgadyzig06ba2ss5ngizxhvn/static/' +
    clon + ',' + clat + ',' + zoom + '/' +
    ww + 'x' + hh + '@2x' +
    '?access_token=pk.eyJ1IjoiY3JvY2hpIiwiYSI6ImNqZzh5dDN3cThzaWMyd21kbzh0cWxvZGgifQ.WGF1BgdeYFXPIC8TStBCxA');

    // mapimg = loadImage('https://api.mapbox.com/styles/v1/crochi/cjga6dqkb33q32ro7ewu2gt0n/static/' +
    // clon + ',' + clat + ',' + zoom + '/' +
    // ww + 'x' + hh + '@2x' +
    // '?access_token=pk.eyJ1IjoiY3JvY2hpIiwiYSI6ImNqZzh5dDN3cThzaWMyd21kbzh0cWxvZGgifQ.WGF1BgdeYFXPIC8TStBCxA');

    console.log("LOADING FILES");
    airports_data = loadStrings("data/airports.csv");
    flights_data = loadStrings("data/flights.csv");
    font = loadFont('assets/CPMono_Bold.otf');
}

function setup() {
	var canvas = createCanvas(ww, hh);

    smooth();

	translate(width/2, height/2);

	imageMode(CENTER);
	image(mapimg, 0, 0, 1280, 720);

	var cx = mercX(clon);
  	var cy = mercY(clat);

	// parse airports with latitude, longitude
    console.log("PARSING AIRPORTS");
	for (var i = 1; i < airports_data.length; i++) {
		var data = airports_data[i].split(/,/);

		var lat = data[6]; // latitude
    	var lon = data[7]; // longitude
        var id = data[0]; // OpenFlights id

		var x = mercX(lon) - cx;
	    var y = mercY(lat) - cy;

		if (x < - width/2) {
	    	x += width;
	    } else if (x > width / 2) {
	    	x -= width;
	    }
        // store coordinates and id
		var info = createVector(x,y,id);
		append(airports,info);
	}
    console.log("FINISHED PARSING AIRPORTS");

    // parse routes
    console.log("PARSING FLIGHTS");
    for (var i = 0; i < flights_data.length; i++) {
        var data = flights_data[i].split(/,/);
        var src_x = data[0];
        var src_y = data[1];
        var dest_x = data[2];
        var dest_y = data[3];
        var alpha = 0.8;
        flight = [src_x, src_y, dest_x, dest_y, alpha]
        append(flights, flight)
    }

    // draw all airports points
    for (var j = 0; j < airports.length; j++) {
        strokeWeight(1);
        stroke("#000000");
        fill("#000000");
		ellipse(airports[j].x, airports[j].y, 1, 1);
	}

    console.time("1%");
}

function draw() {
	translate(width / 2, height / 2);

    imageMode(CENTER);
    image(mapimg, 0, 0, 1280, 720);

    // draw all flights
    // src_x, src_y, dest_x, dest_y, alpha
    flight = flights[i];
    src_x = flights[i][0];
    src_y = flights[i][1];
    dest_x = flights[i][2];
    dest_y = flights[i][3];
    alpha = flights[i][4];

    append(connections, flight)

    // draw all previous connections
    for (var j = 0; j < connections.length; j++) {
        flight = connections[j]
        src_x = flight[0];
        src_y = flight[1];
        dest_x = flight[2];
        dest_y = flight[3];
        alpha = flight[4];
        strokeWeight(0.5);
        stroke(colorAlpha('#d14545', alpha));
        fill(colorAlpha('#d14545', alpha));
        connections[j][4] -= 0.012; // decrease alpha
        line(src_x,src_y,dest_x,dest_y);
        ellipse(src_x, src_y, 1, 1);
        ellipse(dest_x, dest_y, 1, 1);
    }

    if (i >= flights.length) {
        i = 0;
        save(canvas, 'canvas.png');
        noLoop();
    }
    console.log(str(i) + "/" + str(flights.length));
    i++;

    // GUI
    strokeWeight(1);
    textFont(font);
    textSize(16);
    text(str(i) + "/" + str(flights.length), -500, 350);

}
