void settings() {
  size(600, 400);
}

void setup() {
  if (System.getenv("SKETCHBOOK_PREVIEW_OUT") != null) randomSeed(42);
}

void draw() {
  background(244, 247, 241);
  fill(22, 142, 145);
  noStroke();
  circle(width / 2 + sin(frameCount * 0.03) * 90, height / 2, 110);

  String preview = System.getenv("SKETCHBOOK_PREVIEW_OUT");
  if (preview != null && frameCount >= Integer.parseInt(System.getenv("SKETCHBOOK_PREVIEW_FRAME"))) {
    saveFrame(preview);
    exit();
  }
}
