class Welcome extends BasePage {
  constructor() {
    super();
    this.title = null;
    this.gameStartArea = null;
    this.players = [];
    this.startButton = null;
    this.introText = null;
    this.delay = 3000;
  }

  /** @override */
  setup() {
    this.title = new Text({
      label: Constants.Game.TITLE,
      x: width / 2,
      y: height / 8,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.title,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
    });

    this.gameStartArea = new Button({
      x: width / 2,
      y: height / 2,
      width: 560,
      height: 320,
      color: Theme.palette.lightGrey,
      hoverColor: Theme.palette.lightGrey,
      align: [CENTER, CENTER],
      textParams: {
        label: 'COME HERE',
        color: colorHelper.lighter(Theme.palette.text.primary, 0.5),
        textSize: Theme.text.fontSize.large,
        textStyle: BOLD,
      },
    });

    // initialize players
    for (var i = 0; i < Settings.players.length; i++) {
      this.players.push(
        new Player({
          idx: i,
          controls: Settings.players[i].controls,
          color: Object.values(Theme.palette.player)[i],
          size: Constants.EntitySize.L,
        }),
      );
    }

    this.startButton = new Button({
      x: width / 2,
      y: (height + this.gameStartArea.height) / 2 + 80,
      width: 400,
      height: 80,
      action: () =>
        Controller.changePage(new MapIntro1(), Constants.Page.MAP_INTRO_1),
      color: Theme.palette.darkBlue,
      hoverColor: colorHelper.lighter(Theme.palette.darkBlue, 0.5),
      align: [CENTER, TOP],
      textParams: { label: 'Start Game' },
    });

    this.welcomeIntro = new WELCOMEINTRO();

    setTimeout(() => {
      this.welcomeIntro.showWelcomeIntro();
    }, this.delay);

  }

  /** @override */
  draw() {
    this.title?.draw();
    this.gameStartArea?.draw();
    this.introText?.draw();
    this.players.forEach((player) => {
      player.draw();
    });

    if (this.players.every((player) => this.checkPlayersInStartArea(player))) {
      this.startButton?.draw();
    }

    this.players.forEach((player, idx) => {
      if (this.checkPlayersInStartArea(player)) {
        const moveDown = 40 * idx;
        this.drawCheckLine(player.color, moveDown);
      }
    });

    this.welcomeIntro.draw();
  }

  /** @override */
  mousePressed() {
    this.startButton?.mousePressed();
  }

  drawCheckLine(color, moveDown = 0) {
    push();
    stroke(color);
    strokeWeight(5);
    line(
      this.gameStartArea.x - this.gameStartArea.width / 8,
      this.gameStartArea.y + moveDown,
      this.gameStartArea.x,
      this.gameStartArea.y + this.gameStartArea.height / 5 + moveDown,
    );
    line(
      this.gameStartArea.x,
      this.gameStartArea.y + this.gameStartArea.height / 5 + moveDown,
      this.gameStartArea.x + this.gameStartArea.width / 4,
      this.gameStartArea.y - this.gameStartArea.height / 3 + moveDown,
    );
    pop();
  }

  checkPlayersInStartArea(player) {
    const playerWidth =
      28 *
      (1 / Settings.entity.scale[Constants.EntitySize.S]) *
      Settings.entity.scale[player.size];
    const playerHeight =
      32 *
      (1 / Settings.entity.scale[Constants.EntitySize.S]) *
      Settings.entity.scale[player.size];
    return (
      player.x >
        this.gameStartArea.x - this.gameStartArea.width / 2 - playerWidth &&
      player.x < this.gameStartArea.x + this.gameStartArea.width / 2 &&
      player.y >
        this.gameStartArea.y - this.gameStartArea.height / 2 - playerHeight &&
      player.y < this.gameStartArea.y + this.gameStartArea.height / 2
    );
  }
}
