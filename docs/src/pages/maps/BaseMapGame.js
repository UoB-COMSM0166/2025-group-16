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
    super();
    this.players = [];
    this.robots = [];
    this.alivePlayerCtn = Store.getPlayerNumber();

    this.robotNumber = params?.robotNumber || 20;
    this.playerParams = params.playerParams || {};
    this.robotParams = params.robotParams || {};

    this.gameOverButton = null;
    this.gameOverText = null;

    this.background = params?.background || null;
    this.playerAvatars = [];
    this.fightImage = [];
  }

  /** @override */
  setup() {
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

    // initialize players
    for (let pIdx = 0; pIdx < Settings.players.length; pIdx++) {
      const newPlayer = new Player({
        ...this.playerParams,
        idx: pIdx,
        controls: Settings.players[pIdx].controls,
        shapeType: Constants.EntityType.ROBOT,
        size: Constants.EntitySize.M,
      });
      this.players.push(newPlayer);

      this.playerAvatars.push(Resources.images.playerlist[pIdx + 1]);
      this.fightImage.push(Resources.images.playerlist[pIdx + 1]);
    }

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
    if (this.background) {
      image(this.background.image, 0, 0, width, height);
    }

    // if game is finished
    this.players.forEach((player) => {
      player.draw();
    });
    this.robots.forEach((robot) => {
      robot.draw();
    });

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
    //draw players
    this.drawPlayerAvatars();
  }

  /** @override */
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

  /** @override */
  mousePressed() {
    this.gameOverButton?.mousePressed();
  }

  drawPlayerAvatars() {
    let avatarSize = 80;
    let fightImageSize = 60; // image size
    let numPlayers = Object.keys(Resources.images.playerlist).length;
    if (numPlayers === 0) return;

    let spacing = width / (numPlayers + 1);

    for (let i = 0; i < numPlayers; i++) {
      let xPos = spacing * (i + 1) - avatarSize / 2;
      let yPos = height - avatarSize - 20;

      let playerAvatar = Resources.images.playerlist[i + 1];
      if (playerAvatar?.image) {
        image(playerAvatar.image, xPos, yPos, avatarSize, avatarSize);
      }

      let fightXPos = xPos + avatarSize + 5;
      let fightYPos = yPos + avatarSize / 2 - fightImageSize / 2;
      let fightImage = Resources.images.playerlist[i + 1]; // TODO: change to fight image
      if (fightImage?.image) {
        image(
          fightImage.image,
          fightXPos,
          fightYPos,
          fightImageSize,
          fightImageSize,
        );
      }
    }
  }
}
