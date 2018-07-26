var slider;

function setup() {
	createCanvas(800, 600);
	stroke("#D45D79");
	fill("#D45D79");

    slider = createSlider(100,800,0,1);
    slider.position(20, 20);
}

function draw() {
    background("#E9E2D0");
    text(slider.value(), slider.x * 2 + slider.width, 35);
    translate(width / 2, height / 2);
}
