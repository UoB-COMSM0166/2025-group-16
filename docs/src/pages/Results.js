class Results extends BasePage {
  constructor() {
    super({
      bgm: Resources.sounds.bgm.intro, // TODO: check bgm
      background: Resources.images.welcome.background,
    });

    this.gameOverText = null;
    this.backHint = null;
    this.winText = this.playerSettings = [];

    this.showLostImgTime = millis() + 1000;
    this.showBackHintTime = millis() + 1500;

    this.winner = { idx: null, score: 0 };
  }

  /** @override */
  setup() {
    super.setup();

    this.gameOverText = new Text({
      label: 'GAME\nOVER',
      x: width / 2,
      y: height / 3 - 24,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.largeTitle,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 1,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.backHint = new Text({
      label: 'Press Any Key to Continue',
      x: width / 2,
      y: height / 3 + 132,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.small,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.winText = new Text({
      label: 'You \nWin!',
      color: Theme.palette.yellow,
      textSize: Theme.text.fontSize.small,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.playerSettings = this._getPlayerSettings();
    this.winner = this._getWinner();
  }

  _getPlayerSettings() {
    const currPlayers = Store.getPlayers();
    return currPlayers.map((player, pIdx) => {
      const color = Object.values(Theme.palette.player)[pIdx];
      return {
        resource: Resources.images.entity.PLAYER[color].IDLE.DOWN[0],
        loseResource: Resources.images.playerLose[color],
        x: width / 2 + (pIdx - (currPlayers.length - 1) / 2) * 420,
        y: height - 155,
        score: player.score,
      };
    });
  }

  _getWinner() {
    return this.playerSettings.reduce(
      (winner, player, idx) => {
        return player.score > winner.score
          ? { idx, score: player.score }
          : winner;
      },
      { idx: null, score: 0 },
    );
  }

  /** @override */
  draw() {
    super.draw();

    this.gameOverText?.draw();

    const scale = Settings.entity.scale[Constants.EntitySize.L];
    this.playerSettings.forEach(({ resource, loseResource, x, y }, idx) => {
      push();
      imageMode(CENTER);
      const img =
        idx === this.winner.idx || millis() < this.showLostImgTime
          ? resource
          : loseResource;
      image(img.image, x, y, img.width * scale, img.height * scale);
      pop();

      if (idx === this.winner.idx) this.winText?.draw({ x, y: y - 128 });
    });

    // check is after showBackHintTime and make it flicker
    if (millis() > this.showBackHintTime && Math.floor(millis() / 1000) % 2) {
      this.backHint?.draw();
    }
  }

  /** @override */
  keyPressed() {
    super.keyPressed();

    if (millis() > this.showBackHintTime) {
      Controller.resetPlayersScore();
      Controller.changePage(new Welcome(), Constants.Page.WELCOME);
    }
  }
}
