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
    });
    this.title = params.title;
    this.playerControlIntros = params.playerControlIntros;
    this.additionalIntro = params?.additionalIntro;

    this.titleText = null;
    this.playerControlIntroTexts = null;
    this.additionalIntroText = null;
    this.startButton = null;

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

    this.titleText = new Text({
      label: this.title,
      x: width / 2,
      y: (height / 6) * 2,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
    });

    this.playerControlIntroTexts = this.playerControlIntros.map(
      (intro, idx) =>
        new Text({
          label: intro,
          x: width / 2,
          y: (height / 6) * 2 + 80 + 55 * idx,
          color: Theme.palette.text.primary,
          textSize: Theme.text.fontSize.medium,
          textAlign: [CENTER, CENTER],
        }),
    );

    if (this.additionalIntroText) {
      this.additionalIntroText = new Text({
        label: this.additionalIntroText,
        x: width / 2,
        y: (height / 4) * 3 - 80,
        color: Theme.palette.text.primary,
        textSize: Theme.text.fontSize.large,
        textStyle: BOLD,
        textAlign: [CENTER, CENTER],
      });
    }

    this.startButton = new Button({
      x: width / 2,
      y: (height / 4) * 3,
      width: 400,
      height: 80,
      action: () => Controller.changePage(this.gamePage, this.gamePageKey),
      color: Theme.palette.darkBlue,
      hoverColor: colorHelper.lighter(Theme.palette.darkBlue, 0.5),
      align: [CENTER, TOP],
      textParams: {
        textSize: Theme.text.fontSize.medium,
        label: 'Ready!',
      },
    });
  }

  /** @override */
  draw() {
    this.titleText?.draw();
    this.additionalIntroText?.draw();
    this.playerControlIntroTexts.map((text) => text?.draw());
    this.startButton?.draw();

    // Update countdown if it exists
    if (this.hasCountdown && this.countdownManager) {
      if (this.useFrameCountdown) {
        this.countdownManager.update();
      }

      // Draw progress bar if countdown is running
      if (this.countdownManager.isRunning) {
        this.drawProgressBar();
      }
    }
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
    if (!this.countdownManager) return;

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

    fill(255);
    textAlign(CENTER, CENTER);
    textFont('Press Start 2P');
    textSize(16);
    text(
      `${this.countdownManager.getSecondsRemaining()}s`,
      barX + barWidth / 2,
      barY + barHeight / 2,
    );
    pop();
  }

  /** @override */
  mousePressed() {
    super.mousePressed();
    this.startButton?.mousePressed();
  }
}
