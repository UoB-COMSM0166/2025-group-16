class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Find Your Robot!',
      playerControlIntros: [
        '\n' +
          '\n' +
          'Find your robot! \n' +
          'Move to check which one responds.\n' +
          'Attack 💥 with [Q] or [Shift] before your enemy does!\n',
      ],
    });

    this.countdown = 3;
    this.isCountingDown = false;
    this.background = Resources.images.map.game1;
    this.playerRobot = null;
    this.enemyRobots = [];
    this.demoGif = null;
    this.gifStartTime = 0;
    this.gifDuration = 18000;
    this.showGif = true;
    // For button "Press →"
    this.pressButtonArea = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  /** @override */
  setup() {
    super.setup();

    this.demoGif = loadImage(Resources.images.mapintro1page.demo2.path);
    // Track when the GIF starts
    this.gifStartTime = millis();

    // Create a static player robot
    this.playerRobot = new Player({
      idx: 0,
      controls: {}, // Empty controls to prevent movement
      shapeType: Constants.EntityType.PLAYER,
      size: Constants.EntitySize.XL,
      color: Theme.palette.player.blue,
      position: {
        x: 240,
        y: height - 240,
      },
    });
  }

  /** @override */
  draw() {
    // Draw background
    if (this.background?.image) {
      imageMode(CORNER);
      image(this.background.image, 0, 0, width, height);
    } else {
      background(Theme.palette.lightGrey);
    }

    // Then draw player robot on top
    this.playerRobot.draw();

    this.drawInteractionBox();

    // Check if GIF has finished playing
    if (this.showGif) {
      this.drawGifFrame();

      // Check if GIF has completed
      if (millis() - this.gifStartTime > this.gifDuration) {
        this.showGif = false;
        this.startCountdown();
      }
    }
  }

  drawInteractionBox() {
    // Box parameters
    const boxHeight = 150;
    const boxWidth = width - 4;
    const boxX = 2;
    const boxY = height - boxHeight - 3;
    // const borderRadius = 20;

    push();
    fill(255, 250, 240);
    stroke(0);
    strokeWeight(2);
    rect(boxX, boxY, boxWidth, boxHeight);

    // Instruction text
    fill(0);
    noStroke();
    textSize(33);
    textAlign(LEFT, CENTER);
    textLeading(38);

    const instructionText = this.playerControlIntros[0];
    text(instructionText, boxX + 20, boxY + boxHeight / 2 - 10);

    // Draw "Press →" with enhanced triangle
    textSize(35);
    textAlign(RIGHT, CENTER);
    text('Press →', width - 25, height - 25);
    pop();

    // Update press button area based on text position
    this.pressButtonArea = {
      x: width - 150,
      y: height - 50,
      width: 125,
      height: 50,
    };

    pop();

    // add progress box
    if (this.isCountingDown && this.countdown > 0) {
      let progress = (3 - this.countdown) / 3;

      let barWidth = 300;
      let barHeight = 30;
      let x = width - barWidth - 20;
      let y = 20;

      // progress outside box
      push();
      stroke(255);
      strokeWeight(4);
      noFill();
      rect(x, y, barWidth, barHeight);
      pop();

      // Progress box
      push();
      noStroke();
      fill(50, 50, 50);
      rect(x, y, barWidth * progress, barHeight);
      pop();
    }
  }

  drawGifFrame() {
    // Increase the size of the GIF frame
    let gifBoxWidth = 600;
    let gifBoxHeight = 400;

    // Position more to the right side (increase the offset to move more right)
    let rightOffset = 100;
    let gifboxX = width / 2 - gifBoxWidth / 2 + rightOffset;

    // Adjust vertical position to avoid overlapping with interaction box
    let gifBoxY = (height - gifBoxHeight) / 2 - 70;

    // Draw semi-transparent overlay over the entire screen
    push();
    fill(0, 0, 0, 100);
    noStroke();
    rect(0, 0, width, height);
    pop();

    push();
    // Add a background for the GIF frame
    fill(255, 255, 255, 245);
    stroke(0);
    strokeWeight(3);
    rect(gifboxX, gifBoxY, gifBoxWidth, gifBoxHeight, 15);

    // Add a frame title
    fill(0);
    textSize(35);
    textStyle(NORMAL);
    textAlign(CENTER, TOP);
    text('DEMO', gifboxX + gifBoxWidth / 2, gifBoxY + 20);

    // Draw a line under the title
    stroke(0);
    strokeWeight(2);
    line(gifboxX + 40, gifBoxY + 55, gifboxX + gifBoxWidth - 40, gifBoxY + 55);

    // Add skip text at bottom
    textSize(20);
    textStyle(ITALIC);
    textAlign(CENTER, BOTTOM);
    fill(100);
    text(
      'Press any key to skip',
      gifboxX + gifBoxWidth / 2,
      gifBoxY + gifBoxHeight - 10,
    );
    pop();

    // Draw the GIF inside the frame
    if (this.demoGif) {
      imageMode(CORNER);
      image(
        this.demoGif,
        gifboxX + 25,
        gifBoxY + 65,
        gifBoxWidth - 50,
        gifBoxHeight - 100,
      );
    }
  }

  /** @override */
  mousePressed() {
    super.mousePressed();
    // Check if click is within the press button area
    // Can use two meathds to press
    if (
      mouseX >= this.pressButtonArea.x &&
      mouseX <= this.pressButtonArea.x + this.pressButtonArea.width &&
      mouseY >= this.pressButtonArea.y &&
      mouseY <= this.pressButtonArea.y + this.pressButtonArea.height
    ) {
      // Skip the GIF if it's still showing
      this.showGif = false;
      this.startCountdown();
    } else if (this.showGif) {
      // Allow clicking anywhere to skip the GIF
      this.showGif = false;
      this.startCountdown();
    }
  }

  /** @override */
  keyPressed() {
    super.keyPressed();
    // Skip the GIF if it's still showing
    this.showGif = false;
    this.startCountdown();
  }

  startCountdown() {
    // Don't start countdown if it's already counting down
    if (this.isCountingDown) return;
    this.isCountingDown = true;
    let interval = setInterval(() => {
      if (this.countdown > 1) {
        this.countdown--;
      } else {
        clearInterval(interval);
        Controller.changePage(new MapGame1(), Constants.Page.MAP_GAME_1);
      }
    }, 1000);
  }
}
