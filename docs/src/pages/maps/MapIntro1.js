class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Desert',
      playerControlIntros: [
        'P1: Move with [W A S D]\nP1: Punch with [Q]',
        'P2: Move with [↑ ↓ ← →]\nP2: Punch with [?]',
      ],
      additionalIntro: '🌵Punch another player🌵',
      hasCountdown: true,
      countdownDuration: 4,
      useFrameCountdown: false,
      gamePage: new MapGame1(),
      gamePageKey: Constants.Page.MAP_GAME_1,
    });

    // Initialize background image
    this.background = Resources.images.map.game1;
  }

  /** @override */
  setup() {
    super.setup();

    // Initialize player robot
    this.playerRobot = new Player({
      idx: 0,
      controls: {}, // prevent movement
      shapeType: Constants.EntityType.PLAYER,
      size: Constants.EntitySize.XL,
      color: Theme.palette.player.blue,
      position: {
        x: 145,
        y: height - 240,
      },
    });

    this.startCountdown();
  }

  /** @override */
  draw() {
    super.draw();
    this.drawBackground();
    this.drawMapTitle();
    this.drawScoreIndicator();
    this.playerRobot.draw();
    this.drawControlsBox();
    this.drawProgressBar();
  }
}
