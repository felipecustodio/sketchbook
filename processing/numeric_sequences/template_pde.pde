// graphics
PFont font;

// motion blur
int samplesPerFrame = 5;
float shutterAngle = 1.5;
int[][] result;
float t, c;

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
    println(frameCount);

    if (frameCount <= numFrames && recording) {
      TImage frame = new TImage(width,height,RGB,sketchPath("frame_"+nf(frameCount,3)+".png"));
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
// Welcome to the filming room - \˚ㄥ˚\
// recording
boolean recording = true;
int numFrames = 161;
//////////////////////////////////////////////////////////////////////

int num;
int current = 0;
int[] p;
IntList primes;
float[] y_offsets;
String sequence = "";

void setup() {
  size(800, 800, P3D);
  result = new int[width*height][3];
  font = loadFont("CMUSerif-BoldItalic-64.vlw");
  textFont(font, 18);
  num = 0;
  p = new int[]{2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811};
  y_offsets = new float[width + 1];
  primes = new IntList();

  for (int i = 0; i < p.length; i++) {
      primes.append(p[i]);
  }

  for (int i = 0; i <= width; i++) {
      y_offsets[i] = 0;
  }
}

void draw_() {
  background(#ECE9E4);

  fill(#5E5554);
  stroke(#5E5554);
  strokeWeight(5);
  line(0, height/2, width, height/2);

  strokeWeight(1);
  text("Prime Numbers",20,35);
  text(sequence,20,height-20);
  if (primes.hasValue(num)) {
    current = num;
    sequence += " ";
    if (num == 1) {
        sequence += str(current) + " " + str(current);
    } else {
        sequence += str(current);
    }
  }

  strokeWeight(1);
  fill(#D56073);
  stroke(#D56073);
  ellipse(num, height/2, 8, 8);
  strokeWeight(5);
  line(num, height/2, 0, height/2);

  fill(#D56073);
  stroke(#D56073);
  for (int i = num; i > 0; i--) {
    if (primes.hasValue(i)) {
        strokeWeight(5);
        ellipse(i, height/2, 5, 5);
        ellipse(i, height/2 - y_offsets[i], 5, 5);
        ellipse(i, height/2 + y_offsets[i], 5, 5);

        strokeWeight(1);
        line(num, height/2, i, height/2 + y_offsets[i]);
        line(num, height/2, i, height/2 - y_offsets[i]);
        line(i, height/2 + y_offsets[i], i, height/2);
        line(i, height/2 - y_offsets[i], i, height/2);
      }
    for (int j = i; j > 0; j--) {
      y_offsets[j] += 0.05;
    }
  }

  num++;
  if (num >= width) {
    noLoop();
  }
}
