class WelcomeIntro extends BasePage {
  constructor() {
    super();
    this.maskIsVisible = false;
    this.maskColor = color(211, 211, 211, 150);
    this.boxWidth = width - 4;
    this.boxHeight = 200;
    this.boxX = (width - this.boxWidth) / 2;
    this.boxY = height - this.boxHeight - 4;
  }

  showWelcomeIntro() {
    this.maskIsVisible = true;
  }

  hideWelcomeIntro() {
    this.maskIsVisible = false;
  }

  draw() {
    if (this.maskIsVisible) {
      //Grey transparent background
      push();
      fill(this.maskColor);
      rect(0, 0, width, height);
      pop();

      //Robot
      const resources =
        Resources.images.entity.PLAYER[Theme.palette.player.red].IDLE.DOWN[0];
      const scale = Settings.entity.scale[Constants.EntitySize.XL];
      const scaledWidth = resources.width * scale;
      const scaledHeight = resources.height * scale;
      image(
        resources.image,
        this.boxX + 150,
        this.boxY - 100,
        scaledWidth,
        scaledHeight,
      );

      //BoxShadow
      push();
      stroke(Theme.palette.black);
      strokeWeight(3); // 設置合適的線條寬度
      drawingContext.shadowColor = color(0, 0, 0, 255); // 設置陰影顏色
      drawingContext.shadowBlur = 15; // 設置陰影模糊程度，不要太大
      drawingContext.shadowOffsetX = 0; // 設置陰影水平偏移量
      drawingContext.shadowOffsetY = 5; // 設置陰影垂直偏移量
      line(
        this.boxX,
        this.boxY + this.boxHeight,
        this.boxX + this.boxWidth,
        this.boxY + this.boxHeight,
      ); // 繪製底部邊框
      pop();

      //Box
      push();
      fill(Theme.palette.lightGrey);
      stroke(Theme.palette.black);
      strokeWeight(3);
      rect(this.boxX, this.boxY, this.boxWidth, this.boxHeight);
      pop();

      //Intro Text
      push();
      fill(Theme.palette.black);
      textSize(Theme.text.fontSize.medium);
      textAlign(LEFT, TOP);
      text(
        'Welcome to UNSTOPPABLE. Player 1: move with [W A S D], ',
        10,
        height - 175,
      );
      text(
        'Player 2: move with [↑ ← ↓ →] to COME HERE area to start! Shall we?',
        10,
        height - 125,
      );
      pop();

      //Press
      push();
      fill(Theme.palette.black);
      textSize(Theme.text.fontSize.medium);
      textAlign(RIGHT, BOTTOM);
      text('Press →', width - 10, height - 10);
      pop();
    }
  }

  keyPressed() {
    if (this.maskIsVisible && keyCode === RIGHT_ARROW) {
      this.hideWelcomeIntro();
    }
  }
}
