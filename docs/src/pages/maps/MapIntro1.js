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

    this.countdown = 5;
    this.isCountingDown = false;
    this.background = Resources.images.map.game1;
    this.playerRobot = null;
    this.playerAvatar = null;
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
      position: {
        x: 240,
        y: height - 240,
      },
    });

    // // Create a player avatar to demonstrate attacks
    // this.playerAvatar = new Player({
    //   idx: 0,
    //   controls: {},
    //   shapeType: Constants.EntityType.PLAYER,
    //   size: Constants.EntitySize.M,
    //   color: Theme.palette.player.red,
    //   position: { x: width / 3, y: height / 2 },
    // });

    // Create a single robot for the demo
    this.demoRobot = new Robot({
      idx: 0,
      x: width / 2,
      y: height / 2 - 50,
      size: Constants.EntitySize.M,
      isMovable: false,
    });

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
          }),
        );
      }
    }
    // this.startDemoAttack();
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

    // Draw the player avatar for demo
    if (this.playerAvatar) {
      this.playerAvatar.draw();
    }

    // Draw all enemy robots
    this.enemyRobots.forEach((robot) => {
      push();
      translate(robot.x, robot.y);
      translate(-robot.x, -robot.y);
      robot.draw();
      pop();

      // Draw "ROBOT" labels under each enemyrobot
      push();
      fill(0);
      noStroke();
      textSize(18);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text(
        'ROBOT',
        robot.x,
        robot.y +
          (Settings.entity.baseSize.height *
            Settings.entity.scale[robot.size]) /
            2 +
          32,
      );
      pop();
    });

    // Then draw player robot on top
    this.playerRobot.draw();

    this.drawInteractionBox();
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

    // add progress box
    if (this.isCountingDown && this.countdown > 0) {
      let progress = (5 - this.countdown) / 5;

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

  // startDemoAttack() {
  //   // Flag to track which robot we're attacking
  //   let currentRobotIndex = 0;

  //   this.attackInterval = setInterval(() => {
  //     if (currentRobotIndex >= this.enemyRobots.length || this.demoCompleted) {
  //       clearInterval(this.attackInterval);
  //       this.demoCompleted = true;
  //       return;
  //     }

  //     let targetRobot = this.enemyRobots[currentRobotIndex];

  //     // Move avatar near the robot
  //     this.playerAvatar.position = {
  //       x: targetRobot.x - 50,
  //       y: targetRobot.y,
  //     };

  //     // Add a visual attack indicator
  //     setTimeout(() => {
  //       // Simulate attack animation
  //       this.playerAvatar.attack();

  //       // Make robot show hit effect
  //       setTimeout(() => {
  //         targetRobot.status = Constants.EntityStatus.HIT;

  //         // After a moment, move to next robot
  //         setTimeout(() => {
  //           currentRobotIndex++;

  //           // If we've attacked two robots, end the demo
  //           if (currentRobotIndex >= 2) {
  //             this.demoCompleted = true;
  //             clearInterval(this.attackInterval);
  //             // Start countdown after showing demo
  //             setTimeout(() => {
  //               this.startCountdown();
  //             }, 1000);
  //           }
  //         }, 500);
  //       }, 200);
  //     }, 300);
  //   }, 2000); // Attack every 2 seconds
  // }

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
      this.startCountdown();
      // startCountdown(new MapGame1(), Constants.Page.MAP_GAME_1);
      // Controller.changePage(new MapGame1(), Constants.Page.MAP_GAME_1);
    }
  }

  // /** @override */
  // mousePressed() {
  //   super.mousePressed();
  //   // Check if click is within the press button area
  //   if (
  //     mouseX >= this.pressButtonArea.x &&
  //     mouseX <= this.pressButtonArea.x + this.pressButtonArea.width &&
  //     mouseY >= this.pressButtonArea.y &&
  //     mouseY <= this.pressButtonArea.y + this.pressButtonArea.height
  //   ) {
  //     // Skip the demo if it's still running and start countdown
  //     if (!this.demoCompleted) {
  //       this.demoCompleted = true;
  //       clearInterval(this.attackInterval);
  //     }
  //     this.startCountdown();
  //   }
  // }

  /** @override */
  keyPressed() {
    super.keyPressed();
    this.startCountdown();
    // Controller.changePage(new MapGame1(), Constants.Page.MAP_GAME_1);
  }

  // /** @override */
  // keyPressed() {
  //   super.keyPressed();
  //   // Skip the demo if it's still running and start countdown
  //   if (!this.demoCompleted) {
  //     this.demoCompleted = true;
  //     clearInterval(this.attackInterval);
  //   }
  //   this.startCountdown();
  // }

  startCountdown() {
    // Only start countdown if demo is completed or skipped
    // if (!this.demoCompleted) {
    //   this.demoCompleted = true;
    //   clearInterval(this.attackInterval);
    // }

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
