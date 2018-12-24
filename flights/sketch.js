// drawing
var paused = true;
var start = false;
var running = false;

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
var connections = [];
var max_dist = 0;
var min_dist = 999999;

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
    // console.log("LOADING MAP");

    // mapbox://styles/crochi/cjgadyzig06ba2ss5ngizxhvn
    // mapimg = loadImage('https://api.mapbox.com/styles/v1/crochi/cjgadyzig06ba2ss5ngizxhvn/static/' +
    // clon + ',' + clat + ',' + zoom + '/' +
    // ww + 'x' + hh + '@2x' +
    // '?access_token=pk.eyJ1IjoiY3JvY2hpIiwiYSI6ImNqZzh5dDN3cThzaWMyd21kbzh0cWxvZGgifQ.WGF1BgdeYFXPIC8TStBCxA');

    // mapimg = loadImage('https://api.mapbox.com/styles/v1/crochi/cjga6dqkb33q32ro7ewu2gt0n/static/' +
    // clon + ',' + clat + ',' + zoom + '/' +
    // ww + 'x' + hh + '@2x' +
    // '?access_token=pk.eyJ1IjoiY3JvY2hpIiwiYSI6ImNqZzh5dDN3cThzaWMyd21kbzh0cWxvZGgifQ.WGF1BgdeYFXPIC8TStBCxA');

    console.log("LOADING FILES");
    airports_data = loadStrings("data/airports.csv");
    flights_data = loadStrings("data/flights.csv");
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('sketch-holder');
    background("#fbeed7");

    smooth();
    translate(width/2, height/2);
    

	var cx = mercX(clon);
  	var cy = mercY(clat);

	// parse airports with latitude, longitude
    console.log("PARSING AIRPORTS...");
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
    
    // parse routes
    console.log("PARSING FLIGHTS...");
    for (var i = 0; i < flights_data.length; i++) {
        var data = flights_data[i].split(/,/);
        var src_x = data[0];
        var src_y = data[1];
        var dest_x = data[2];
        var dest_y = data[3];
        var distance = dist(src_x, src_y, dest_x, dest_y);
        if (distance > max_dist) {
            max_dist = distance;
        }
        if (distance < min_dist) {
            min_dist = distance;
        }
        var alpha = 0.001;
        flight = [src_x, src_y, dest_x, dest_y, alpha, distance]
        append(flights, flight)
    }
    console.log(max_dist, min_dist);

    // draw all airports points
    console.log("DRAWING AIRPORTS...");
    for (var j = 0; j < airports.length; j++) {
        strokeWeight(2);
        stroke(colorAlpha("#843b62", 0.4));
        // fill(colorAlpha("#843b62", 0.4));
        noFill();
		ellipse(airports[j].x, airports[j].y, 1, 1);
    }
    
    // draw all flights
    console.log("DRAWING FLIGHTS...");
    var i = 0;
    var startTime = new Date();
    while (i < flights.length) {
        flight = flights[i];
        src_x = flights[i][0];
        src_y = flights[i][1];
        dest_x = flights[i][2];
        dest_y = flights[i][3];
        alpha = flights[i][4];
        distance = flights[i][5];
        strokeWeight(map(distance, min_dist, max_dist, 1, 0.1));
        // ff7657
        // '#d14545'
        stroke(colorAlpha('#ff7657', alpha));
        fill(colorAlpha('#ff7657', alpha));
        line(src_x,src_y,dest_x,dest_y);
        ellipse(src_x, src_y, 1, 1);
        ellipse(dest_x, dest_y, 1, 1);
        i++;
    }
    var endTime = new Date();
    var timeDiff = endTime - startTime;
    timeDiff /= 1000;
    var seconds = Math.round(timeDiff);
    console.log(seconds + " seconds");
    document.getElementById("tips1").style.visibility = "visible";
}

var i = 0;

function draw() {

    translate(width / 2, height / 2);

    // p.value(str(i));
    document.getElementById("counter").innerHTML = str(i) + "/" + str(flights.length);


    if (start && !running) {
        start = false;
        running = true;
        background("#fbeed7");
        // draw all airports points
        for (var j = 0; j < airports.length; j++) {
            strokeWeight(2);
            stroke(colorAlpha("#843b62", 0.4));
            // fill(colorAlpha("#843b62", 0.4));
            noFill();
            ellipse(airports[j].x, airports[j].y, 1, 1);
        }
        document.getElementById("counter").style.visibility = "visible";
        document.getElementById("tips2").style.visibility = "visible";

        return;
    }

    if (paused) {
        return;
    }
 
    // draw current flight
    flight = flights[i];
    src_x = flights[i][0];
    src_y = flights[i][1];
    dest_x = flights[i][2];
    dest_y = flights[i][3];
    alpha = flights[i][4];
    distance = flights[i][5];
    append(connections, flight);

    strokeWeight(map(distance, min_dist, max_dist, 1, 0.1) + 1);
    stroke(colorAlpha('#ff7657', alpha));
    fill(colorAlpha('#ff7657', alpha));
    line(src_x,src_y,dest_x,dest_y);

    i += 1;
}

function mousePressed() {
    if (paused) {
        paused = false;
        loop();
    } else {
        paused = true;
        noLoop();
    }
}

function keyPressed() {
    if (key == 'Enter') {
        start = true;
    }
}
