// // graphics
// PFont font;
//
// // motion blur
// int samplesPerFrame = 5;
// float shutterAngle = 1.5;
// int[][] result;
// float t, c;
//
// float ease(float p, float g) {
//   if (p < 0.5)
//     return 0.5 * pow(2*p, g);
//   else
//     return 1 - 0.5 * pow(2*(1 - p), g);
// }
//
// void push() {
//   pushMatrix();
//   pushStyle();
// }
//
// void pop() {
//   popStyle();
//   popMatrix();
// }
//
// void draw() {
//     for (int i=0; i<width*height; i++)
//       for (int a=0; a<3; a++)
//         result[i][a] = 0;
//
//     for (int sa=0; sa<samplesPerFrame; sa++) {
//       t = map(frameCount-1 + sa*shutterAngle/samplesPerFrame, 0, numFrames, 0, 1);
//       draw_();
//       loadPixels();
//       for (int i=0; i<pixels.length; i++) {
//         result[i][0] += pixels[i] >> 16 & 0xff;
//         result[i][1] += pixels[i] >> 8 & 0xff;
//         result[i][2] += pixels[i] & 0xff;
//       }
//     }
//
//     loadPixels();
//     for (int i=0; i<pixels.length; i++)
//       pixels[i] = 0xff << 24 |
//         int(result[i][0]*1.0/samplesPerFrame) << 16 |
//         int(result[i][1]*1.0/samplesPerFrame) << 8 |
//         int(result[i][2]*1.0/samplesPerFrame);
//     updatePixels();
//     println(frameCount);
//
//     if (frameCount <= numFrames && recording) {
//       TImage frame = new TImage(width,height,RGB,sketchPath("frame_"+nf(frameCount,3)+".png"));
//       frame.set(0,0,get());
//       frame.saveThreaded();
//       println(frameCount,"/",numFrames);
//     }
// }
//
// class TImage extends PImage implements Runnable{//separate thread for saving images
//   String filename;
//
//   TImage(int w,int h,int format,String filename){
//     this.filename = filename;
//     init(w,h,format);
//   }
//
//   public void saveThreaded(){
//     new Thread(this).start();
//   }
//
//   public void run(){
//     this.save(filename);
//   }
// }
//
// //////////////////////////////////////////////////////////////////////
// // Welcome to the filming room - \˚ㄥ˚\
// // recording
// boolean recording = true;
// int numFrames = 161;
// //////////////////////////////////////////////////////////////////////
//
// int num;
// FloatList fibs;
// IntList trail;
// int current = 0;
// float[] y_offsets;
// boolean backwards = false;
// String sequence = "";
//
// void setup() {
//   size(800, 800, P3D);
//   result = new int[width*height][3];
//   font = loadFont("CMUSerif-BoldItalic-64.vlw");
//   textFont(font, 18);
//   num = 0;
//   fibs = new FloatList();
//   y_offsets = new float[width + 1];
//   float fib = 0;
//
//   for (int i = 0; i <= width; i++) {
//       y_offsets[i] = 0;
//       fib = fib(i);
//       fibs.append(fib(i));
//       if (fib >= width)
//         break;
//   }
// }
//
// void draw_() {
//   background(#ECE9E4);
//
//   fill(#5E5554);
//   stroke(#5E5554);
//   strokeWeight(5);
//   line(0, height/2, width, height/2);
//
//   strokeWeight(1);
//   text("Fibonacci",20,35);
//   text(sequence,20,height-20);
//   if (fibs.hasValue(num)) {
//     current = num;
//     sequence += " ";
//     if (num == 1) {
//         sequence += str(current) + " " + str(current);
//     } else {
//         sequence += str(current);
//     }
//   }
//
//   strokeWeight(1);
//   fill(#D56073);
//   stroke(#D56073);
//   ellipse(num, height/2, 8, 8);
//   strokeWeight(5);
//   line(num, height/2, 0, height/2);
//
//
//   fill(#D56073);
//   stroke(#D56073);
//   for (int i = num; i > 0; i--) {
//     if (fibs.hasValue(i)) {
//         strokeWeight(5);
//         ellipse(i, height/2, 5, 5);
//         ellipse(i, height/2 - y_offsets[i], 5, 5);
//         ellipse(i, height/2 + y_offsets[i], 5, 5);
//
//         strokeWeight(1);
//         line(num, height/2, i, height/2 + y_offsets[i]);
//         line(num, height/2, i, height/2 - y_offsets[i]);
//         line(i, height/2 + y_offsets[i], i, height/2);
//         line(i, height/2 - y_offsets[i], i, height/2);
//       }
//     for (int j = i; j > 0; j--) {
//       y_offsets[j] += 0.05;
//     }
//   }
//
//   if (num >= width) {
//     noLoop();
//       backwards = true;
//   } else if (num < 0) {
//       backwards = false;
//   }
//
//   if (backwards) {
//       num--;
//   } else {
//       num++;
//   }
// }
//
// float fib(float num) {
//   float fib = 0;
//   float prev = 0;
//   for (int i = 1; i <= num; i++) {
//     if (i == 1) {
//       fib = 1;
//       prev = 0;
//     } else {
//       fib += prev;
//       prev = fib - prev;
//     }
//   }
//   return fib;
// }
