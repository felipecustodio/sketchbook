/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-const */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable spaced-comment */
/// <reference path="./p5/p5.global-mode.d.ts" />

// https://colorhunt.co/palette/117448


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function colorAlpha(aColor, alpha) {
  // allows usage of HEX colors with alpha
  const c = color(aColor);
  let a = alpha;
  if (alpha <= 0.1) {
    a = 0.1;
  }
  return color('rgba(${[red(c), green(c), blue(c), a].join(', ')})');
}

let w;
let rows;
let cols;
let d;
let r;
let angle = 0;
let i;
let j;
let curve;
let speedV;
let speedH;

// good params: 50, 0.02
let maxSize = 5;
let angleSpeed = 0.02;

// UI
let sliderH;
let sliderV;
let sliderSize;
let sliderSpeed;
let font;
let scanY;

// presets
let presetIndex = 0;
let presets = [
  [23, 337, 50, 0.02],
  [63, 32, 50, 0.02],
  [1000, 471, 50, 0.02],
  [837, 523, 5, 0.02],
  [890, 523, 5, 0.02],
  [52, 523, 5, 0.02],
  [110, 523, 5, 0.02],
  [814, 756, 5, 0.02],
  [907, 901, 5, 0.02],
  [523, 527, 5, 0.02],
  [576, 523, 5, 0.02],
  [58, 372, 5, 0.02],
];

// cool starters:
// 23, 337 max 50 speed 0.02
// 63, 32 max 50 
// 1000, 471 max 50
// 837, 523 com maxSize 5 e angleSpeed 0.02 - fucking awesome
// 837, 523
// 890, 523
// 52, 523
// 110, 523
// 814, 756
// 907, 901
// 523, 527
// 576, 523
// 58, 372

// Synth
// https://p5js.org/examples/sound-frequency-modulation.html
let carrier;
let modulator;

let carrierBaseFreq = 220;
// min/max ranges for modulator
let modMaxFreq = 60;
let modMinFreq = 0;
let modMaxDepth = -50;
let modMinDepth = -150;

// color palette
let bg = '#000000';
// let colorPoint = '#fcf5ee';
let colorPoint = '#00ff66';
// let colorLine = '#c06c84';
// let colorEllipseCol = '#f67280';
// let colorEllipseRow = '#f8b595';


function preload() {
  font = loadFont('font/vcr.ttf');
}


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  canvas.style('display', 'block');
  smooth(8);

  // UI
  textFont(font);
  scanY = 0;

  sliderH = createSlider(0, 1000, 837);
  sliderH.position(20, 20);
  sliderH.style('width', '200px');

  sliderV = createSlider(0, 1000, 523);
  sliderV.position(20, 50);
  sliderV.style('width', '200px');

  sliderSize = createSlider(1, 500, 5);
  sliderSize.position(20, 80);
  sliderSize.style('width', '200px');

  sliderSpeed = createSlider(0, 0.1, 0.02, 0.01);
  sliderSpeed.position(20, 110);
  sliderSpeed.style('width', '200px');

  w = width / 10;
  cols = width / w - 1;
  rows = height / w - 1;
  d = w - 5;
  r = d / 2;
  i = floor(cols / 2);
  j = floor(rows / 2);

  curve = [];

  // initialize synth
  carrier = new p5.Oscillator('triangle');
  carrier.amp(0); // set amplitude
  carrier.freq(carrierBaseFreq); // set frequency
  carrier.start(); // start oscillating

  // try changing the type to 'square', 'sine' or 'triangle'
  modulator = new p5.Oscillator('triangle');
  modulator.start();

  // add the modulator's output to modulate the carrier's frequency
  modulator.disconnect();
  carrier.freq(modulator);
}


function draw() {
  push();
  background(0, 0, 0, random(50));
  noFill();

  stroke(colorPoint);
  fill(colorPoint);
  textSize(22);
  text(`TOP: ${str(sliderH.value())}`, sliderH.x * 2 + sliderH.width, sliderH.y + 25);
  text(`BOTTOM: ${str(sliderV.value())}`, sliderV.x * 2 + sliderV.width, sliderV.y + 25);
  text(`TRAIL: ${str(sliderSize.value())}`, sliderSize.x * 2 + sliderSize.width, sliderSize.y + 25);
  text(`SPEED: ${str(sliderSpeed.value())}`, sliderSpeed.x * 2 + sliderSpeed.width, sliderSpeed.y + 25);

  textSize(floor(random(21, 22)));
  text('SINGLE LISSAJOUS CURVE GENERATOR V0.1 // PRESS P TO CYCLE PRESETS', sliderH.x, height - 20);


  maxSize = sliderSize.value();
  angleSpeed = sliderSpeed.value();

  let cx = w + i * w + (w / 2);
  let cy = w / 2;

  noFill();
  strokeWeight(2);
  stroke(colorPoint);
  ellipse(cx, cy, random((d / 2), (d / 2 - 5)), random((d / 2), (d / 2 - 5)));

  speedH = sliderH.value();
  let x = r * cos(angle * speedH - HALF_PI);
  let y = r * sin(angle * speedH - HALF_PI);

  let colPoint = createVector(cx + x, cy + y);

  strokeWeight(8);
  stroke(colorPoint);
  point(cx + x, cy + y);

  let curveX = cx + x;

  cy = w + j * w + (w / 2);
  cx = w / 2;

  speedV = sliderV.value();
  x = r * cos(angle * speedV - HALF_PI);
  y = r * sin(angle * speedV - HALF_PI);

  // synthVal = map(speedV, 0, 1000, 0.5, 2);

  let rowPoint = createVector(cx + x, cy + y);

  strokeWeight(2);
  stroke(colorPoint);
  ellipse(cx, cy, random((d / 2), (d / 2 - 5)), random((d / 2), (d / 2 - 5)));

  strokeWeight(8);
  stroke(colorPoint);
  point(cx + x, cy + y);
  fill(255);

  let curveY = cy + y;

  let curvePath = createVector(curveX, curveY);

  curve.push(curvePath);

  if (curve.length > maxSize) {
    curve.splice(0, 1);
  }

  strokeWeight(1);
  stroke(colorPoint);
  line(curve[curve.length - 1].x, curve[curve.length - 1].y, colPoint.x, colPoint.y);
  line(curve[curve.length - 1].x, curve[curve.length - 1].y, rowPoint.x, rowPoint.y);

  // curve
  noFill();
  strokeWeight(2);
  stroke(colorPoint);
  // fill(colorPoint);
  beginShape();
  for (let n = 0; n < curve.length; n += 1) {
    vertex(curve[n].x, curve[n].y);
  }
  endShape();

  // noFill();
  // stroke(colorLine);
  // ellipse(curve[curve.length - 1].x, curve[curve.length - 1].y, 50, 50);
  // fill(colorLine);
  // ellipse(curve[curve.length - 1].x, curve[curve.length - 1].y, 5, 5);

  // scanlines
  strokeWeight(10);
  line(0, scanY, width, scanY);
  scanY += 1;
  if (scanY > height) {
    scanY = 0;
  }

  angle += angleSpeed;

  // synth
  let modFreq = map(speedH, 0, 1000, modMinFreq, modMaxFreq);
  modulator.freq(modFreq);

  // change the amplitude of the modulator
  // negative amp reverses the sawtooth waveform, and sounds percussive
  //
  let modDepth = map(speedV, 1000, 0, modMinDepth, modMaxDepth);
  modulator.amp(modDepth);

  carrier.amp(0.1);

  pop();
}

function cyclePresets() {
  console.log('Cycling preset...');
  presetIndex += 1;
  if (presetIndex > presets.length) {
    presetIndex = 0;
  } else {
    let currentPreset = presets[presetIndex];
    sliderH.value(currentPreset[0]);
    sliderV.value(currentPreset[1]);
    sliderSize.value(currentPreset[2]);
    sliderSpeed.value(currentPreset[3]);
  }
}

function keyPressed() {
  if (key === 'p' || key === 'P') {
    background(0);
    cyclePresets();
  }
}
