class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Find Your Robot!',
      playerControlIntros: [
        '\n' +
          'In this stage, Find out which robot you control! Move around to check which one\n' +
          'responds to your controls. Once you know who you are, find and attack your\n' +
          '💥opponent before they attack you!',
      ],
    });

    this.background = Resources.images.map.game1;
    this.playerRobot = null;
    this.enemyRobots = [];
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

    // Create a static player robot
    this.playerRobot = new Player({
      idx: 0,
      controls: {}, // Empty controls to prevent movement
      shapeType: Constants.EntityType.PLAYER,
      size: Constants.EntitySize.XL,
      color: Theme.palette.player.blue,
      scale: 2.0,
    });

    this.playerRobot.x = 200;
    this.playerRobot.y = height - 200;

    // Create robot for demo
    const startX = width / 2;
    const startY = height / 2 - 100;
    const spacingX = 120;
    const spacingY = 150;

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 3; col++) {
        const robotIdx = row * 3 + col;
        this.enemyRobots.push(
          new Robot({
            idx: robotIdx,
            x: startX + col * spacingX,
            y: startY + row * spacingY,
            size: Constants.EntitySize.M,
            isMovable: false,
            scale: 1.5,
          }),
        );
      }
    }
  }

  /** @override */
  draw() {
    // Draw background
    if (this.background?.image) {
      image(this.background.image, 0, 0, width, height);
    } else {
      background(Theme.palette.lightGrey);
    }

    // Draw all enemy robots
    this.enemyRobots.forEach((robot) => {
      push();
      translate(robot.x, robot.y);
      scale(1.2);
      translate(-robot.x, -robot.y);
      robot.draw();
      pop();

      // Draw "ROBOT" labels under each enemyrobot
      fill(0);
      noStroke();
      textSize(18);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text('ROBOT', robot.x + 50, robot.y + 130);
    });

    // Then draw player robot on top
    if (this.playerRobot) {
      this.playerRobot.x = 100;
      this.playerRobot.y = height - 330;

      push();
      translate(this.playerRobot.x, this.playerRobot.y);
      scale(1.5);
      translate(-this.playerRobot.x, -this.playerRobot.y);
      this.playerRobot.draw();
      pop();
    }

    this.drawInteractionBox();
  }

  drawInteractionBox() {
    // Box parameters
    const boxHeight = 100;
    const boxWidth = width - 100;
    const boxX = 50;
    const boxY = height - boxHeight - 50;
    const borderRadius = 20;

    fill(255, 250, 240);
    stroke(0);
    strokeWeight(2);
    rect(boxX, boxY, boxWidth, boxHeight, borderRadius);

    // Instruction text
    fill(0);
    noStroke();
    textSize(16);
    textAlign(LEFT, CENTER);
    textLeading(24);

    const instructionText = this.playerControlIntros[0];
    text(instructionText, boxX + 20, boxY + boxHeight / 2 - 10);

    // Save the press button area for click detection
    const pressX = boxX + boxWidth - 100;
    const pressY = boxY + boxHeight - 30;
    const pressWidth = 100;
    const pressHeight = 20;
    this.pressButtonArea = {
      x: pressX,
      y: pressY - pressHeight / 2,
      width: pressWidth,
      height: pressHeight,
    };

    // Draw "Press →" with enhanced triangle
    textSize(16);
    textAlign(RIGHT, CENTER);
    text('Press →', pressX + pressWidth - 30, pressY);

    // Draw enhanced triangle arrow
    fill(0);
    noStroke();
    push();
    translate(pressX + pressWidth - 10, pressY);
    beginShape();
    vertex(-12, -8);
    vertex(0, 0);
    vertex(-12, 8);
    endShape(CLOSE);
    pop();
  }

  /** @override */
  mousePressed() {
    // Check if click is within the press button area
    // Can use two meathds to press
    if (
      mouseX >= this.pressButtonArea.x &&
      mouseX <= this.pressButtonArea.x + this.pressButtonArea.width &&
      mouseY >= this.pressButtonArea.y &&
      mouseY <= this.pressButtonArea.y + this.pressButtonArea.height
    ) {
      Controller.changePage(new MapGame1(), Constants.Page.MAP_GAME_1);
    }
  }

  /** @override */
  keyPressed() {
    if (keyCode === RIGHT_ARROW) {
      Controller.changePage(new MapGame1(), Constants.Page.MAP_GAME_1);
    }
  }
}
