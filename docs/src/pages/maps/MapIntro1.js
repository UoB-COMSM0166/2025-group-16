class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Desert',
      playerControlIntros: ['\n' + '\n' + 'Punch a player 🌵\n'],
      hasCountdown: true,
      countdownDuration: 4,
      useFrameCountdown: false,
      gamePage: new MapGame1(),
      gamePageKey: Constants.Page.MAP_GAME_1,
    });

    this.state = {
      gifState: {
        overlayOpacity: 0,
        frameOpacity: 0,
        gifOpacity: 0,
        stage: 'init',
        startTime: 0,
        delay: 2000,
        transitionDuration: 500, // Smooth transition time
      },
      scoreDisplay: {
        opacity: 255,
        value: '+1',
        color: '#e69b5e',
      },
    };

    this.background = Resources.images.map.game1;
    this.playerRobot = null;
  }

  /** @override */
  setup() {
    super.setup();

    this.demoGif = loadImage(Resources.images.mapIntro.demo2.path);

    this.playerRobot = new Player({
      idx: 0,
      controls: {}, // prevent movement
      shapeType: Constants.EntityType.PLAYER,
      size: Constants.EntitySize.XL,
      color: Theme.palette.player.blue,
      position: {
        x: 145, // Updated position based on the image
        y: height - 240,
      },
    });

    this.startCountdown();

  }

  /** @override */
  draw() {
    super.draw();

    this.drawBackground();
    this.drawDesertTitle();
    this.drawScoreIndicator();
    this.playerRobot.draw();
    this.drawControlsBox();
    this.drawProgressBar();
  }

  drawBackground() {
    if (this.background?.image) {
      imageMode(CORNER);
      image(this.background.image, 0, 0, width, height);
    } else {
      background(Theme.palette.lightGrey);
    }
  }

  drawDesertTitle() {
    push();
    textFont('Press Start 2P'); // font
    textSize(65);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    // likewas mapselect page
    fill(Theme.palette.text.primary);
    stroke(Theme.palette.text.primary);
    strokeWeight(1);
    text('Desert', width / 2, 180);
    pop();
  }

  drawScoreIndicator() {
    this.playerRobot.draw();
    const { scoreDisplay } = this.state;

    push();
    // Draw background rectangle with dotted line borders
    fill(255, 225, 200, 149); // Light beige semi-transparent background
    noStroke();
    rect(0, 270, width, 270);

    // Draw the dotted lines above and below the score section
    stroke(255, 255, 255, 150);
    strokeWeight(3);
    drawingContext.setLineDash([10, 10]);
    line(0, 270, width, 270);
    line(0, 540, width, 540);
    drawingContext.setLineDash([]);

    // Draw the circle with the +1 score
    fill(scoreDisplay.color);
    noStroke();
    ellipse(width / 2, 370, 150, 150);

    // Draw the +1 text
    textSize(60);
    textFont('Press Start 2P');
    textAlign(CENTER, CENTER);
    fill(0);
    text(scoreDisplay.value, width / 2, 370);

    // Draw "Punch a player 🌵" text
    textSize(28);
    textFont('Press Start 2P');
    text('🌵Punch another player🌵', width / 2, 500);
    pop();
  }

  drawControlsBox() {
    push();
    // Draw the controls box at the bottom
    fill(255, 255, 255, 240);
    stroke(0);
    strokeWeight(2);
    rect(40, height - 150, 550, 100, 5);

    // Draw the control
    fill(0);
    noStroke();
    textSize(18);
    textFont('Press Start 2P');
    textAlign(LEFT, CENTER);
    text(
      'P1: Move with [W A S D]' + ' \n' + 'P1: Punch with [Q]',
      60,
      height - 120,
    );
    text(
      'P2: Move with [↑ ↓ ← →]' + '\n' + 'P2: Punch with [?]',
      60,
      height - 80,
    );
    pop();
  }
}
