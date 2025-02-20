class WelcomeIntro extends BasePage {
  constructor() {
    super();
    this.maskIsVisible = false; 
    this.maskColor = color(211, 211, 211, 150); 
    this.boxWidth = width-4; 
    this.boxHeight = 200; 
    this.boxX = 2;
    this.boxY = height - this.boxHeight-2; 
  }

  showWelcomeIntro() {
    this.maskIsVisible = true; 
  }

  hideWelcomeIntro(){
    this.maskIsVisible = false;
  }

  draw(){
    if (this.maskIsVisible){
      //Grey transparent background
      push(); 
      fill(this.maskColor);
      rect(0, 0, width, height); 
      pop(); 
    
      //Robot
      const resources =
        Resources.images.entity.PLAYER[Theme.palette.player.red].IDLE.DOWN[0];
      const scale = Constants.EntitySize.XL; 
      const scaledWidth = resources.width * scale;
      const scaledHeight = resources.height * scale;
      image(resources.image, this.boxX + 30, this.boxY - 200, scaledWidth, scaledHeight);

      //Box
      push();
      fill(Theme.palette.lightGrey);
      stroke(Theme.palette.black);
      strokeWeight(2);
      rect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
      pop();

      //Intro Text
      push();
      fill(Theme.palette.black);
      textSize(Theme.text.fontSize.medium);
      textAlign(LEFT, TOP);
      text('Welcome to UNSTOPPABLE. Player 1: move with [W A S D], ', 10, height-175);
      text('Player 2: move with [↑ ← ↓ →] to COME HERE area to start! Shall we?', 10, height-125);
      pop();

      //Press
      push();
      fill(Theme.palette.black);
      textSize(Theme.text.fontSize.medium);
      textAlign(RIGHT, BOTTOM);
      text('Press →', width-10, height-10);
      pop();
    }
  }
  
  keyPressed(){
    if (this.maskIsVisible && keyCode === RIGHT_ARROW){
      this.hideWelcomeIntro();
    }
  }


}