import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class template_pde extends PApplet {

//////////////////////////////////////////////////////////////////////
// recording controls room \u2022|\u9fb4\u25e1\u9fb4|\u2022
// motion blur settings
int samplesPerFrame = 5;
float shutterAngle = 1.5f;
// assets
PFont font;
// film roll
int[][] result;
float t, c;
//////////////////////////////////////////////////////////////////////

public float ease(float p, float g) {
  if (p < 0.5f)
    return 0.5f * pow(2*p, g);
  else
    return 1 - 0.5f * pow(2*(1 - p), g);
}

public void push() {
  pushMatrix();
  pushStyle();
}

public void pop() {
  popStyle();
  popMatrix();
}

public void draw() {
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
        PApplet.parseInt(result[i][0]*1.0f/samplesPerFrame) << 16 |
        PApplet.parseInt(result[i][1]*1.0f/samplesPerFrame) << 8 |
        PApplet.parseInt(result[i][2]*1.0f/samplesPerFrame);
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
// filming room - \\u02da\u3125\u02da\
boolean recording = true;
int numFrames = 1;
//////////////////////////////////////////////////////////////////////

public void setup() {
  
  result = new int[width*height][3];
  font = loadFont("CMUSerif-BoldItalic-64.vlw");
  textFont(font, 18);
}

public void draw_() {
  surface.setTitle(getClass().getSimpleName() + " /// " + str(frameRate));
  background(0xffECE9E4);
  fill(0xff5E5554);
  stroke(0xff5E5554);
  text("Template",20,35);

}
  public void settings() {  size(500, 500); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "template_pde" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
