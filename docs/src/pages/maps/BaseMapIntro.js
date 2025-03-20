class BaseMapIntro extends BasePage {
  /**
   * Creates a new MapGame page instance.
   * @param {Object} params - The parameters for the map page.
   * @param {string} params.title - The number of robots.
   * @param {string} params.gamePage - The instance of game page.
   * @param {string} params.gamePageKey - The key of game page.
   * @param {string[]} params.playerControlIntros - The number of robots.
   * @param {string} [params.additionalIntro] - The number of robots.
   * @param {boolean} params.hasCountdown - Whether page has countdown
   * @param {number} params.countdownDuration - Duration of countdown in seconds
   * @param {boolean} params.useFrameCountdown - Whether to use frame-based countdown
   */
  constructor(params) {
    super({
      bgm: Resources.sounds.bgm.intro,
      background: params?.background,
    });
    this.title = params.title;
    this.playerControlIntros = params.playerControlIntros;
    this.additionalIntro = params?.additionalIntro;

    this.titleText = null;
    this.playerControlIntroText = null;
    this.additionalIntroText = null;
    this.progressBarText = null;
    this.scoreIndicatorText = null;

    this.playerRobot = null;

    // Initialize score display state
    this.state = {
      scoreDisplay: {
        opacity: 255,
        value: '+1',
        color: '#e69b5e',
      },
    };

    this.gamePage = params.gamePage;
    this.gamePageKey = params.gamePageKey;

    // Initialize countdown manager if countdown is enabled
    this.hasCountdown = params.hasCountdown || false;
    this.countdownDuration = params.countdownDuration || 8;
    this.useFrameCountdown = params.useFrameCountdown || false;

    if (this.hasCountdown) {
      this.countdownManager = new CountdownManager({
        duration: this.countdownDuration,
        useFrameCount: this.useFrameCountdown,
        onComplete: () => {
          if (this.gamePage && this.gamePageKey) {
            Controller.changePage(this.gamePage, this.gamePageKey);
          }
        },
        onTick: (secondsRemaining) => {
          // Can be extended by subclasses if needed
        },
      });
    }
  }

  /** @override */
  setup() {
    super.setup();

    this.playerRobot = new Player({
      idx: 0,
      controls: {},
      shapeType: Constants.EntityType.PLAYER,
      size: Constants.EntitySize.XL,
      color: Theme.palette.player.blue,
      position: {
        x: 145,
        y: height - 240,
      },
    });

    this.titleText = new Text({
      label: this.title,
      x: width / 2,
      y: 180,
      color: Theme.palette.text.primary,
      textSize: 60,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 1,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.playerControlIntroText = new Text({
      label: this.playerControlIntros.join('\n'),
      x: 60,
      y: height - 100,
      color: Theme.palette.text.primary,
      textSize: 18,
      textAlign: [LEFT, CENTER],
      textFont: 'Press Start 2P',
    });

    if (this.additionalIntro) {
      this.additionalIntroText = new Text({
        label: this.additionalIntro,
        x: width / 2,
        y: 500,
        color: Theme.palette.text.primary,
        textSize: 28,
        textAlign: [CENTER, CENTER],
        textFont: 'Press Start 2P',
      });
    }

    this.progressBarText = new Text({
      color: Theme.palette.white,
      textSize: (Theme.text.fontSize.small * 2) / 3,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.scoreIndicatorText = new Text({
      color: Theme.palette.text.primary,
      textSize: (Theme.text.fontSize.large / 4) * 5,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  /** @override */
  draw() {
    super.draw();

    this.titleText.draw();
    this.drawScoreIndicator();
    this.playerRobot.draw();
    this.drawControlsBox();
    this.drawProgressBar();
  }

  /**
   * Start the countdown if it exists
   */
  startCountdown() {
    if (this.hasCountdown && this.countdownManager) {
      this.countdownManager.start();
    }
  }

  /**
   * Draw progress bar for countdown
   * This can be overridden by subclasses to customize appearance
   */
  drawProgressBar() {
    if (!this.countdownManager) {
      return;
    }
    const barWidth = 200;
    const barHeight = 30;
    const barX = width - barWidth - 30;
    const barY = 30;

    push();

    fill(50, 50, 50, 200);
    noStroke();
    rect(barX, barY, barWidth, barHeight, 15);

    const progress = this.countdownManager.getProgress();
    fill(255, 100, 100);
    rect(barX, barY, barWidth * progress, barHeight, 15);

    pop();

    this.progressBarText.draw({
      label: `${this.countdownManager.getSecondsRemaining()}s`,
      x: barX + barWidth / 2,
      y: barY + barHeight / 2,
    });
  }

  /**
   * Draw the score indicator and player instructions
   */
  drawScoreIndicator() {
    if (this.playerRobot) this.playerRobot.draw();

    const { scoreDisplay } = this.state;

    push();
    // Draw background rectangle with dotted line borders
    fill(255, 225, 200, 149);
    noStroke();
    rect(0, 270, width, 270);

    // Draw the dotted lines
    stroke(255, 255, 255, 150);
    strokeWeight(3);
    drawingContext.setLineDash([10, 10]);
    line(0, 270, width, 270);
    line(0, 540, width, 540);
    drawingContext.setLineDash([]);

    // Draw score circle
    fill(scoreDisplay.color);
    noStroke();
    ellipse(width / 2, 370, 150, 150);

    // Draw score value
    this.scoreIndicatorText.draw({
      label: scoreDisplay.value,
      x: width / 2,
      y: 370,
    });

    // Draw instruction text if exists
    this.additionalIntroText?.draw();
    pop();
  }

  /**
   * Draw the controls box with player instructions
   */
  drawControlsBox() {
    if (!this.playerControlIntros || this.playerControlIntros.length === 0) {
      return;
    }

    push();
    // Draw controls container
    fill(255, 255, 255, 240);
    stroke(0);
    strokeWeight(2);
    rect(40, height - 150, 550, 100, 5);

    // Draw each control instruction
    this.playerControlIntroText.draw();
    pop();
  }
}
