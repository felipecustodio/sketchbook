//////////////////////////////////////////////////////////////////////
// recording controls room •|龴◡龴|•
// motion blur settings
int samplesPerFrame = 5;
float shutterAngle = 1.5;
// assets
PFont font;
// film roll
int[][] result;
float t, c;
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
      t = map(frameCount-1 + sa*shutterAngle/samplesPerFrame, 0, numFrames, 0, 1);
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

void setup() {
  size(500, 500);
  result = new int[width*height][3];
  font = loadFont("CMUSerif-BoldItalic-64.vlw");
  textFont(font, 18);
}

void draw_() {
  surface.setTitle(getClass().getSimpleName() + " /// " + str(frameRate));
  background(#ECE9E4);
  fill(#5E5554);
  stroke(#5E5554);
  text("Template",20,35);

}
