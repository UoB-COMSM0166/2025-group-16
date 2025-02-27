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

    this.gameOverText = null;
    this.playerListUI = null;

    this.isWaitingForGameOver = false;
  }

  /** @override */
  setup() {
    super.setup();

    this.gameOverText = new Text({
      label: '',
      x: width / 2,
      y: height / 2,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 1,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    // initialize players
    for (let pIdx = 0; pIdx < Settings.players.length; pIdx++) {
      const createPlayer = {
        ...this.playerParams,
        idx: pIdx,
        controls: Settings.players[pIdx].controls,
        shapeType: this.shapeType,
        size: Constants.EntitySize.M,
        canDie: true,
      };

      if (this.shapeType == Constants.EntityType.PLAYER) {
        createPlayer.color = Object.values(Theme.palette.player)[pIdx];
      }

      const newPlayer = new Player(createPlayer);
      this.players.push(newPlayer);
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

    // initialize player list and text
    this.playerListUI = new PlayerList({
      label: 'Fight',
      textSize: Theme.text.fontSize.large,
    });
  }

  /** @override */
  draw() {
    super.draw();

    // draw dying entities first to show alive entities on the top
    const sortedEntities = [...this.players, ...this.robots];
    sortedEntities.sort(
      (a, b) =>
        (b.status === Constants.EntityStatus.DIED) -
        (a.status === Constants.EntityStatus.DIED),
    );
    sortedEntities.forEach((entity) => entity.draw());

    //draw player list
    this.playerListUI.drawPlayerAvatars();

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

      // show winner text for 3 seconds, and add score to the winner
      if (this.isWaitingForGameOver) return;
      this.isWaitingForGameOver = true;
      Controller.addPlayerScore(alivePlayer.idx, 1);
      window.setTimeout(() => {
        Controller.changePage(new Results(), Constants.Page.RESULTS);
      }, 3000);
    }
  }

  /** @override */
  keyPressed(event) {
    super.keyPressed();
    this.players.forEach((player) => {
      if (player.status === Constants.EntityStatus.DIED) return;
      player.keyPressed(
        event,
        [...this.robots, ...this.players],
        (diedEntity) => {
          if (diedEntity.type === Constants.EntityType.PLAYER) {
            this.alivePlayerCtn--;
          }
        },
      );
    });
  }
}
