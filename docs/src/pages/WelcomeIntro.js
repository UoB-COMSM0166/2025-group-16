class WelcomIntro extends BasePage {
  constructor() {
    super();
    this.maskIsVisible = false; //hide Intro
    this.maskColor = color(211, 211, 211, 150); //grey transparent background
    this.height = 320; //height of the welcome page
    this.width = 640; //width of the welcome page
    this.boxX = 0; //box x position
    this.boxY = this.height - this.boxHeight; //box y position
    this.boxWidth = this.width; //box width
    this.boxHeight = 100; //box height

  }

  showWelcomeIntro() {
    this.maskIsVisible = true; //顯示視窗
  }

  hideWelcomeIntro(){
    this.maskIsVisible = false; //隱藏視窗
  }

  draw(){
    if (this.maskIsVisible){
      //Grey transparent background
      push(); //保存當前welcome頁面
      fill(this.maskColor);
      rect(0, 0, this.width, this.height); //覆蓋整個畫布
      pop(); //恢復當前welcome頁面
    
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
      textAlign(LEFT, BOTTOM);
      text('welcome to UNSTOPPABLE. Player 1: move with [W A S D], Player 2: move with [↑ ← ↓ →] to COME HERE area to start! Shall we?', 10, this.height-10);
      pop();

      //Press →
      push();
      fill(Theme.palette.black);
      textSize(Theme.text.fontSize.medium);
      textAlign(RIGHT, BOTTOM);
      text('Press →', this.width-10, this.height-10);
      pop();
    
    }
  }
  
  keyPressed(){
    if (this.maskIsVisible && keyCode === RIGHT_ARROW){
      this.hideWelcomeIntro();
    }
  }


}