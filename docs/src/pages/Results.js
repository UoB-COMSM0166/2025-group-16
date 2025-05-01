/**
 * Game results page showing scores and winner
 * Handles victory animations and transitions
 */
class Results extends BasePage {
  constructor() {
    super({
      bgm: Resources.sounds.bgm.resultPage,
      background: Resources.images.welcome.background,
    });

    this.title = null;
    this.backHint = null;
    this.winner = { idx: null, score: 0 };

    // animation timings
    this.showDropScoreAniTime = millis() + 300;
    this.showPlayerAniTime = millis() + 1000;
    this.showBackHintTime = millis() + 1500;

    // score drop animation settings
    this.dropStartY;
    this.dropScoreSpeed = 8;
    this.scoreHeight = 128;
  }

  /**
   * Initialize result page elements
   * @override
   */
  setup() {
    super.setup();

    this.title = new Text({
      label: 'RESULT',
      x: width / 2,
      y: height / 3 - 24,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.largeTitle,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 0,
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
    this.dropStartY = this.title.y - this.scoreHeight;
  }

  /** Get player positions and scores for display */
  _getPlayerSettings() {
    const currPlayers = Store.getPlayers();
    return currPlayers.map((player, pIdx) => ({
      x: width / 2 + (pIdx - (currPlayers.length - 1) / 2) * 420,
      y: height - 155,
      score: player.score,
      isJustWon: player.isJustWon,
      color: Object.values(Theme.palette.player)[pIdx],
      idx: pIdx,
    }));
  }

  /** Determine winner based on scores */
  _getWinner() {
    return this.playerSettings.reduce(
      (winner, { score }, idx) =>
        score >= Store.getTargetScore() ? { idx, score } : winner,
      { idx: null, score: 0 },
    );
  }

  /**
   * Render results page with animations
   * @override
   */
  draw() {
    super.draw();

    this._drawTitle();

    // draw player images
    const scale = Settings.entity.scale[Constants.EntitySize.L];
    this.playerSettings.forEach((setting) => {
      this._drawPlayerImage(setting, scale);
      // draw confetti for round winner
      if (setting.idx === this.winner.idx) {
        this._drawConfetti(setting.x, setting.y);
      }
    });

    // draw backHint: check is after showBackHintTime and make it flicker
    const timeSinceHint = millis() - this.showBackHintTime;
    if (timeSinceHint && Math.floor(timeSinceHint / 1000) % 2) {
      this.backHint?.draw();
    }
  }

  /** Draw title with score drop animation */
  _drawTitle() {
    if (!this.title) return;

    if (this.winner.idx !== null) {
      // draw title if win in round
      this.title.draw();
    } else {
      // draw drop score animation if win in single game
      const timeSinceDrop = millis() - this.showDropScoreAniTime;
      const isDropping = timeSinceDrop < 1500;
      if (isDropping) {
        this.dropStartY = Math.min(
          this.dropStartY + this.dropScoreSpeed,
          this.title.y,
        );
        this.dropScoreSpeed *= 0.95;
      }

      this.playerSettings.forEach((setting) => {
        if (setting.isJustWon && setting.score > 0) {
          push();
          clip(() => {
            rectMode(CENTER);
            rect(setting.x, this.title.y, 120, this.scoreHeight);
          });
          // dropping score animation for winner
          this.title.draw({
            label: setting.score - 1,
            x: setting.x,
            y: this.dropStartY + this.scoreHeight,
          });
          this.title.draw({
            label: setting.score,
            x: setting.x,
            y: this.dropStartY,
          });
          pop();
        } else {
          // no score animation for loser
          this.title.draw({
            label: setting.score,
            x: setting.x,
          });
        }
      });
      this.title.draw({
        label: ':',
      });
    }
  }

  /** Draw player image with animation */
  _drawPlayerImage(setting, scale) {
    const aniType = this._getPlayerAniType(setting);
    const imageResource = this._getPlayerImageResource(aniType, setting.color);

    push();
    imageMode(CENTER);
    image(
      imageResource.image,
      setting.x,
      setting.y,
      imageResource.width * scale,
      imageResource.height * scale,
    );
    pop();
  }

  /** Determine player animation type based on game state */
  _getPlayerAniType(player) {
    const isShowAni = millis() > this.showPlayerAniTime;
    // change animation frame every 0.4s
    const frameIdx = Math.round((millis() - this.showPlayerAniTime) / 400) % 2;
    if (this.winner.idx !== null) {
      if (player.idx === this.winner.idx) {
        return isShowAni && frameIdx ? 'jump' : 'default';
      } else {
        return isShowAni ? 'lose' : 'default';
      }
    } else {
      if (player.isJustWon) {
        if (!isShowAni) return 'default';
        return frameIdx ? 'wave_1' : 'wave_2';
      } else {
        return isShowAni ? 'lose' : 'default';
      }
    }
  }

  /**
   * Retrieves the image resource for a player based on the type and color.
   * @param {string} type - The type of player image to retrieve. Must be one of 'jump', 'wave_1', 'wave_2', 'lose' or 'default'.
   * @param {string} color - The color of the player.
   * @returns {Object} The image resource for the specified player type and color.
   */
  _getPlayerImageResource(type, color) {
    if (type === 'default') {
      return Resources.images.entity.PLAYER[color].IDLE.DOWN[0];
    }
    return Resources.images.playerAnimation[type][color];
  }

  /** Draw victory confetti effect */
  _drawConfetti(x, y) {
    const confettiImg = Resources.images.resultsPage.confetti;
    const scale = 3;
    const confettiWidth = confettiImg.image.width * scale;
    const confettiHeight = confettiImg.image.height * scale;
    const clipHeight = 72 * scale;
    const adjustedY = y - 32;

    push();
    clip(() => {
      rectMode(CENTER);
      rect(x, adjustedY, confettiWidth, clipHeight);
    });
    imageMode(CENTER);
    image(confettiImg?.image, x, adjustedY, confettiWidth, confettiHeight);
    pop();
  }

  /**
   * Handle key press for page transition
   * @override
   */
  keyPressed() {
    super.keyPressed();

    if (millis() > this.showBackHintTime) {
      if (this.winner.idx === null) {
        Controller.resetPlayerJustWon();
        Controller.changePage(new MapSelection(), Constants.Page.MAP_SELECTION);
      } else {
        Controller.resetPlayersScore();
        Controller.changePage(new Welcome(), Constants.Page.WELCOME);
      }
    }
  }
}
