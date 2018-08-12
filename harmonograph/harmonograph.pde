//////////////////////////////////////////////////////////////////////
// recording controls room •|龴◡龴|•
// motion blur settings
int samplesPerFrame = 5;
float shutterAngle = 1.5;
// assets
PFont font;
// film roll
int[][] result;
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

class TImage extends PImage implements Runnable{//separate thread for saving images
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
int numFrames = 1;
//////////////////////////////////////////////////////////////////////

float d1, d2, d3, d4;
float f1, f2, f3, f4;
float p1, p2, p3, p4;
float x, y;
int t;
int i = 1;

PVector position, current, previous;
ArrayList<PVector> points;

void setup() {
  size(500, 500);
  // smooth(4);

  result = new int[width*height][3];
  font = loadFont("CMUSerif-BoldItalic-64.vlw");
  textFont(font, 18);

  // initial parameters for pendulums
  f1 = 2;
  p1 = PI/16;
  d1 = -0.02;

  f2 = 6;
  p2 = PI/2;
  d2 = -0.0315;

  f3 = 1.002;
  p3 = 13 * PI/16;
  d3 = -0.02;

  f4 = 3;
  p4 = PI;
  d4 = -0.02;

  // calculate points
  points = new ArrayList<PVector>();

  for (float t = 0; t < 50; t += 0.01) {
    x = exp(d1*t)*sin((t*f1)+p1) + exp(d2*t)*sin(t*f2+p2);
    y = exp(d3*t)*sin((t*f3)+p3) + exp(d4*t)*sin(t*f4+p4);

    position = new PVector(x * 120, y * 120);
    points.add(position);
    println("t:", t, 200);
  }
}

void draw_() {
  push();
  surface.setTitle(getClass().getSimpleName() + " /// " + str(frameRate));
  // background(#ECE9E4);
  fill(#5E5554);
  stroke(#5E5554);
  strokeWeight(1);
  // text("Harmonograph", 20, 35);
  translate(width/2, height/2);

  // draw entire thing at once
  // beginShape(POINTS);
  // for (PVector current : points) {
  //   vertex(current.x, current.y);
  // }
  // endShape();
  // noLoop();
 
  // draw entire thing with background
  background(#ECE9E4);
  fill(#5E5554);
  stroke(#5E5554);
  strokeWeight(1);
  for (int j = 1; j < i; j++) {
    current = points.get(j);
    previous = points.get(j-1);
    line(previous.x, previous.y, current.x, current.y);
  }
  current = points.get(i);
  ellipse(current.x, current.y, 5, 5);

  if (i < points.size() - 1) {
    i++;
    println("frame:",frameCount,"| i:", i, "/", points.size());
  }

  // draw trail without background
  // PVector current = points.get(i);
  // PVector previous = points.get(i-1);
  // line(previous.x, previous.y, current.x, current.y);

  // if (i < points.size() - 1) {
  //   i++;
  //   println("i:", i, "/", points.size());
  // }

  pop();
}