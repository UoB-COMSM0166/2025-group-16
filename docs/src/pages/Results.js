class Results extends BasePage {
  constructor() {
    super({
      bgm: Resources.sounds.bgm.intro, // TODO: check bgm
      background: Resources.images.welcome.background,
    });

    this.gameOverText = null;
    this.backHint = null;

    this.showLoseImgTime = millis() + 1000;
    this.showBackHintTime = millis() + 1500;

    this.winner = { idx: null, score: 0 };
  }

  /** @override */
  setup() {
    super.setup();

    this.gameOverText = new Text({
      label: 'RESULT',
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
    const isShowingLoseImage = millis() > this.showLoseImgTime;
    this.playerSettings.forEach((player, idx) => {
      this._drawPlayerImage(player, idx, scale, isShowingLoseImage);
      if (idx === this.winner.idx) this._drawConfetti(player.x, player.y - 32);
    });

    // check is after showBackHintTime and make it flicker
    const timeSinceHint = millis() - this.showBackHintTime;
    if (timeSinceHint && Math.floor(timeSinceHint / 1000) % 2) {
      this.backHint?.draw();
    }
  }

  _drawPlayerImage(
    { resource, loseResource, x, y },
    index,
    scale,
    isShowingLoseImage,
  ) {
    const isWinner = index === this.winner.idx;
    const imageResource =
      isWinner || !isShowingLoseImage ? resource : loseResource;

    push();
    imageMode(CENTER);
    image(
      imageResource.image,
      x,
      y,
      imageResource.width * scale,
      imageResource.height * scale,
    );
    pop();
  }

  _drawConfetti(x, y) {
    const confettiImg = Resources.images.resultsPage.confetti;
    const scale = 3;
    const confettiWidth = confettiImg.image.width * scale;
    const confettiHeight = confettiImg.image.height * scale;
    const clipHeight = 72 * scale;

    push();
    clip(() => {
      rectMode(CENTER);
      rect(x, y, confettiWidth, clipHeight);
    });
    imageMode(CENTER);
    image(confettiImg?.image, x, y, confettiWidth, confettiHeight);
    pop();
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
