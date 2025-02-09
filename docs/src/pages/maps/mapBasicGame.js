class MapBasicGame extends BasePage {
  constructor() {
    super();
    this.robotNumber = 30;
    this.players = [];
    this.robots = [];
    this.alivePlayerCtn = Store.getPlayerNumber();

    this.gameOverButton = null;
    this.gameOverText = null;
  }

  setup() {
    this.gameOverButton = new Button({
      x: width / 2 - 100,
      y: (height / 4) * 3,
      width: 200,
      height: 50,
      label: 'Finish',
      action: () =>
        Controller.changePage(new Results(), Constants.Page.RESULTS),
      color: Theme.palette.primary,
      hoverColor: colorHelper.lighter(Theme.palette.primary, 0.5),
    });

    this.gameOverText = new Text({
      label: '',
      x: width / 2,
      y: (height / 7) * 3,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      textAlign: CENTER,
    });

    // initialize players
    for (var pIdx = 0; pIdx < Settings.players.length; pIdx++) {
      const newPlayer = new Player({
        idx: pIdx,
        controls: Settings.players[pIdx].controls,
      });
      this.players.push(newPlayer);
    }

    // initialize robots
    for (var rIdx = 0; rIdx < this.robotNumber; rIdx++) {
      this.robots.push(new Robot({ idx: rIdx }));
    }
  }

  draw() {
    if (this.alivePlayerCtn === 1) {
      // if game is finished
      const alivePlayer = this.players.find(
        (player) => player.status !== Constants.EntityStatus.DIED,
      );
      this.gameOverText?.draw({
        label: `Winner is player ${alivePlayer.idx + 1}`,
      });
      this.gameOverButton?.draw();
    } else {
      // continue
      this.players.forEach((player) => {
        if (player.status === Constants.EntityStatus.DIED) return;
        player.move();
        player.draw();
      });
      this.robots.forEach((robot) => {
        if (robot.status === Constants.EntityStatus.DIED) return;
        robot.update();
        robot.draw();
      });
    }
  }

  keyPressed() {
    this.players.forEach((player) => {
      if (player.status === Constants.EntityStatus.DIED) return;
      player.keyPressed([...this.robots, ...this.players], (diedEntity) => {
        if (diedEntity.type === Constants.EntityType.PLAYER) {
          this.alivePlayerCtn--;
        }
      });
    });
  }

  mousePressed() {
    this.gameOverButton?.mousePressed();
  }
}
