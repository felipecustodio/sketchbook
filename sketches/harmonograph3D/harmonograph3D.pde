//////////////////////////////////////////////////////////////////////
// recording controls room •|龴◡龴|•
// motion blur settings
int samplesPerFrame = 5;
float shutterAngle = 1.5;
// assets
PFont font;
// film roll
int[][] result;
// camera 
import peasy.*;
PeasyCam cam;
//////////////////////////////////////////////////////////////////////

float ease(float p, float g) {
  if (p < 0.5)
    return 0.5 * pow(2*p, g);
  else
    return 1 - 0.5 * pow(2*(1 - p), g);
}

void push() {
  pushMatrix();
  pushStyle();
}

void pop() {
  popStyle();
  popMatrix();
}

void draw() {
    for (int i=0; i<width*height; i++)
      for (int a=0; a<3; a++)
        result[i][a] = 0;

    for (int sa=0; sa<samplesPerFrame; sa++) {
      draw_();
      loadPixels();
      for (int i=0; i<pixels.length; i++) {
        result[i][0] += pixels[i] >> 16 & 0xff;
        result[i][1] += pixels[i] >> 8 & 0xff;
        result[i][2] += pixels[i] & 0xff;
      }
    }

    loadPixels();
    for (int i=0; i<pixels.length; i++)
      pixels[i] = 0xff << 24 |
        int(result[i][0]*1.0/samplesPerFrame) << 16 |
        int(result[i][1]*1.0/samplesPerFrame) << 8 |
        int(result[i][2]*1.0/samplesPerFrame);
    updatePixels();

    if (frameCount <= numFrames && recording) {
      TImage frame = new TImage(width,height,RGB,sketchPath("frames/frame_"+nf(frameCount,3)+".png"));
      frame.set(0,0,get());
      frame.saveThreaded();
      println(frameCount,"/",numFrames);
    }
}

class TImage extends PImage implements Runnable{
  //separate thread for saving images
  String filename;

  TImage(int w,int h,int format,String filename){
    this.filename = filename;
    init(w,h,format);
  }

  public void saveThreaded(){
    new Thread(this).start();
  }

  public void run(){
    this.save(filename);
  }
}

//////////////////////////////////////////////////////////////////////
// filming room - \˚ㄥ˚\
boolean recording = true;
int numFrames = 600;
//////////////////////////////////////////////////////////////////////

// pendulums
float d1, d2, d3, d4;
float f1, f2, f3, f4;
float p1, p2, p3, p4;
float x, y, z;

// time steps
int t;
int i = 1;

// position vectors
PVector position, current, previous;
ArrayList<PVector> points;

// noise
OpenSimplexNoise noise;
float motion_radius = 0.5;
float seed = 500;

void setup() {
  size(500, 500, P3D);
  blendMode(MULTIPLY);
  smooth(8);
  sphereDetail(30);

  cam = new PeasyCam(this, width/2, height/2, 0, 500);
  cam.setMinimumDistance(50);
  cam.setMaximumDistance(500);
  cam.setPitchRotationMode();
  cam.rotateX(65);

  result = new int[width*height][3];
  font = loadFont("CMUSerif-BoldItalic-64.vlw");
  textFont(font, 18);

  noise = new OpenSimplexNoise();

  // initial parameters for pendulums
  f1=3.001; 
  f2=2;
  f3=3;
  f4=2;
  d1=0.004;
  d2=0.0065;
  d3=0.008;
  d4=0.019;
  p1=0;
  p2=0;
  p3=PI/2;
  p4=3*PI/2;

  // calculate points
  points = new ArrayList<PVector>();
  x = 0;
  y = 0;
  z = 0;

  for (float t = 0; t < 100; t += 0.01) {
    x = exp(-d1*t)*sin((t*f1)+p1) + exp(-d2*t)*sin(t*f2+p2);
    y = exp(-d3*t)*sin((t*f3)+p3) + exp(-d4*t)*sin(t*f4+p4);
    z = sin(p4 + f4 * t) * exp(d4 * t);

    position = new PVector(x * 120, y * 120, z * 120);
    // position = new PVector(x, y, z);
    points.add(position);
    println("Calculating... | t:", t, 200);
  }
}

void draw_() {
  push();
  surface.setTitle(getClass().getSimpleName() + " /// " + str(frameRate));
  background(#ECE9E4);
  fill(#5E5554);
  stroke(#5E5554);
  translate(width/2, height/2);

  cam.setPitchRotationMode();
  rotateX(0.001);

  // draw entire thing with background
  // noFill();
  pushMatrix();
  beginShape(LINES);
  for (int j = 1; j < i; j++) {
    strokeWeight(map(j, 1, 3000, 0.5, 3));
    stroke(#ff6767);
    fill(#ff6767);

    current = points.get(j);
    previous = points.get(j-1);

    vertex(current.x, current.y, current.z);
    vertex(previous.x, previous.y, previous.z);
  }
  endShape();
  popMatrix();

  pushMatrix();
  beginShape(LINES);
  for (int j = 1; j < i; j++) {
    strokeWeight(map(j, 1, 3000, 0.5, 3));
    stroke(#5E5554);
    fill(#5E5554);

    current = points.get(j);
    previous = points.get(j-1);

    vertex(current.x, current.y, 0);
    vertex(previous.x, previous.y, 0);
  }
  endShape();
  popMatrix();

  current = points.get(i);
  previous = points.get(i-1);
  // line(current.x, current.y, 0, current.x, current.y, current.z);
  
  pushMatrix();
  translate(current.x, current.y, current.z);
  stroke(#ff6767);
  fill(#ff6767);
  sphere(5);
  popMatrix();

  pushMatrix();
  translate(current.x, current.y, 0);
  stroke(#5E5554);
  fill(#5E5554);
  sphere(2);
  popMatrix();

  if (i < 3000) {
    i++;
    println("Rendering frame:",frameCount,"| i:", i, "/ 3000");
  }

  pop();
}