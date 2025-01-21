let bgColor; // background color

function setup() {
  createCanvas(800, 600);
  bgColor = color(200); // default background
  penColor = color(255,100,200)
  background(bgColor); // background
}

function draw() {
        
  cursor('https://pic.pimg.tw/alicec0328/1372591876-3274038246.gif')
  
  // navbar
  fill(50);
  noStroke();
  rect(0, 0, width, 50);

  // draw color
  drawNavButton(50, "Red", color(255, 100, 100));
  drawNavButton(150, "Green", color(100, 255, 100));
  drawNavButton(250, "Blue", color(100, 100, 255));
    drawNavButton(350, "Clear", color(0,0,0));
  if (mouseIsPressed) {
      noStroke();
      fill(penColor);
      ellipse(mouseX, mouseY, 20, 20);
  }
  
  
  
  
}

// draw color button
function drawNavButton(x, label, buttonColor) {
  fill(buttonColor);
  rect(x, 10, 80, 30); // button

  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text(label, x + 40, 25); // btn word
}

// mousePressed
function mousePressed() {
  // first btn
  if (mouseX > 50 && mouseX < 130 && mouseY > 10 && mouseY < 40) {
    penColor = color(255, 100, 100); // red
  }

  // 2 btn
  if (mouseX > 150 && mouseX < 230 && mouseY > 10 && mouseY < 40) {
    penColor = color(100, 255, 100); // green
  }

  // 3 btn
  if (mouseX > 250 && mouseX < 330 && mouseY > 10 && mouseY < 40) {
    penColor = color(100, 100, 255); // blue
  }
  if (mouseX > 350 && mouseX < 430 && mouseY > 10 && mouseY < 40) {
    // penColor = color(0, 0, 0);
    clear();
    background(200);
    
  }
  
  
}