class Welcome extends BasePage {
  constructor() {
    super();
    this.title = null;
    this.gameStartArea = null;
    this.players = [];
    this.startButton = null;
    this.introText = null;
  }

  setup() {
    this.title = new Text({
      label: Constants.Game.TITLE,
      x: width / 2,
      y: (height / 10) * 1,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.title,
      textStyle: BOLD,
      textAlign: CENTER,
    });

    this.gameStartArea = new Button({
      x: this.title.x - 180,
      y: (height / 10) * 2,
      width: 360,
      height: 300,
      color: Theme.palette.background,
      hoverColor: Theme.palette.background,
    });

    // initialize players
    for (var i = 0; i < Settings.players.length; i++) {
      this.players.push(
        new Player({
          idx: i,
          controls: Settings.players[i].controls,
          color: Theme.palette.player[i],
        }),
      );
    }

    this.startButton = new Button({
      x: width / 2 - 100,
      y: (height / 4) * 3.5,
      width: 200,
      height: 50,
      label: 'Start Game',
      action: () =>
        Controller.changePage(
          new MapBasicIntro(),
          Constants.Page.MAP_BASIC_INTRO,
        ),
      color: Theme.palette.primary,
      hoverColor: colorHelper.lighter(Theme.palette.primary, 0.5),
    });

    this.introText = new Text({
      label: 'COME HERE',
      x: width / 2,
      y: (height / 10) * 3,
      color: colorHelper.lighter(Theme.palette.text.primary, 0.5),
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      textAlign: CENTER,
    });
  }

  draw() {
    this.title?.draw();
    this.gameStartArea?.draw();
    this.introText?.draw();
    this.players.forEach((player) => {
      player.move();
      player.draw();
    });

    if (this.players.every((player) => this.checkPlayersInStartArea(player))) {
      this.startButton?.draw();
    }

    this.players.forEach((player, idx) => {
      if (this.checkPlayersInStartArea(player)) {
        const moveDown = 38 * idx;
        this.drawCheckLine(player.color, moveDown);
      }
    });
  }

  mousePressed() {
    this.startButton?.mousePressed();
  }

  drawCheckLine(color, moveDown = 0) {
    push();
    stroke(color);
    strokeWeight(5);
    line(
      this.gameStartArea.x + 50,
      this.gameStartArea.y + 20 + moveDown,
      this.gameStartArea.x + 150,
      this.gameStartArea.y + 150 + moveDown,
    );
    line(
      this.gameStartArea.x + 150,
      this.gameStartArea.y + 150 + moveDown,
      this.gameStartArea.x + this.gameStartArea.width - 10,
      this.gameStartArea.y + 10 + moveDown,
    );
    pop();
  }

  checkPlayersInStartArea(player) {
    return (
      player.x > this.gameStartArea.x &&
      player.x < this.gameStartArea.x + this.gameStartArea.width &&
      player.y > this.gameStartArea.y &&
      player.y < this.gameStartArea.y + this.gameStartArea.height
    );
  }
}
