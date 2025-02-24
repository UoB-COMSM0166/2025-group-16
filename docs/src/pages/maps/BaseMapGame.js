class BaseMapGame extends BasePage {
  /**
   * Creates a new MapGame page instance.
   * @param {Object} params - The parameters for the map page.
   * @param {number} [params.robotNumber] - Optional. The number of robots.
   * @param {image} [params.background] - Optional. Image resources path.
   * @param {{ size: keyof typeof Constants.EntitySize }} [params.playerParams] - Optional. The params of players.
   * @param {{ size: keyof typeof Constants.EntitySize }} [params.robotParams] - Optional. The params of robots.
   */
  constructor(params) {
    super(params);
    this.players = [];
    this.robots = [];
    this.alivePlayerCtn = Store.getPlayerNumber();

    this.robotNumber = params?.robotNumber || 20;
    this.playerParams = params.playerParams || {};
    this.robotParams = params.robotParams || {};

    this.gameOverButton = null;
    this.gameOverText = null;

    this.playerAvatars = [];
    this.statusTextImages = [];
  }

  /** @override */
  setup() {
    super.setup();
    this.gameOverButton = new Button({
      x: width / 2,
      y: (height / 4) * 3,
      width: 400,
      height: 100,
      action: () =>
        Controller.changePage(new Results(), Constants.Page.RESULTS),
      color: Theme.palette.darkBlue,
      hoverColor: colorHelper.lighter(Theme.palette.darkBlue, 0.5),
      align: [CENTER, TOP],
      textParams: {
        label: 'Finish',
        textSize: Theme.text.fontSize.medium,
      },
    });

    this.gameOverText = new Text({
      label: '',
      x: width / 2,
      y: (height / 7) * 3,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
    });

    // initialize robots
    for (var rIdx = 0; rIdx < this.robotNumber; rIdx++) {
      this.robots.push(
        new Robot({
          ...this.robotParams,
          idx: rIdx,
          size: Constants.EntitySize.M,
        }),
      );
    }
  }

  /** @override */
  draw() {
    super.draw();

    // if game is finished
    this.players.forEach((player) => {
      player.draw();
    });
    this.robots.forEach((robot) => {
      robot.draw();
    });

    //draw PlayerAvatars
    this.drawPlayerAvatars();

    if (this.alivePlayerCtn === 1) {
      const alivePlayer = this.players.find(
        ({ status }) => status !== Constants.EntityStatus.DIED,
      );
      alivePlayer.updateParams({
        shapeType: Constants.EntityType.PLAYER,
        color: Object.values(Theme.palette.player)[alivePlayer.idx],
      });
      this.gameOverText?.draw({
        label: `Winner is player ${alivePlayer.idx + 1}`,
      });
      this.gameOverButton?.draw();
    }
  }

  /** @override */
  keyPressed() {
    super.keyPressed();
    this.players.forEach((player) => {
      if (player.status === Constants.EntityStatus.DIED) return;
      player.keyPressed([...this.robots, ...this.players], (diedEntity) => {
        if (diedEntity.type === Constants.EntityType.PLAYER) {
          this.alivePlayerCtn--;
        }
      });
    });
  }

  /** @override */
  mousePressed() {
    super.mousePressed();
    this.gameOverButton?.mousePressed();
  }
}
