class RulesSettingDialog extends Dialog {
  constructor() {
    super({
      title: 'RULES',
    });

    this.targetScoreOptions = [1, 3, 5];
    this.selectingIdx = 0;
    this.targetScoreOptionIdx = this._getTargetScoreIdx(Store.getTargetScore());
  }

  /** @override */
  drawDialog() {
    super.drawDialog();

    const targetScore = this.targetScoreOptions[this.targetScoreOptionIdx];
    this.optionTargetScore.draw({
      label: `Play to:  ${targetScore}`,
    });
    this.optionStart.draw();
    this._drawOptionArrow();
  }

  /** @override */
  initDialog() {
    super.initDialog();

    this.optionYOffset = 32;

    this.optionTargetScore = new Text({
      x: this.contentBounds.x,
      y: this.contentBounds.y - this.optionYOffset,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.small,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
    this.optionStart = new Text({
      label: 'Start',
      x: this.contentBounds.x,
      y: this.contentBounds.y + this.optionYOffset,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.small,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
    this.optionArrow = new Text({
      label: '>',
      color: Theme.palette.text.primary,
      stroke: Theme.palette.text.primary,
      strokeWeight: 2,
      textSize: Theme.text.fontSize.small * (2 / 3),
      textStyle: BOLD,
      textAlign: [RIGHT, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  // if initial score is not in the target score options, set it to the default
  _getTargetScoreIdx(currentScore) {
    const DEFAULT_SCORE_IDX = 1;

    const scoreIdx = this.targetScoreOptions.indexOf(currentScore);
    const isValid = scoreIdx !== -1;
    if (!isValid) {
      Controller.updateTargetScore(this.targetScoreOptions[1]);
    }
    return isValid ? scoreIdx : DEFAULT_SCORE_IDX;
  }

  _drawOptionArrow() {
    // option arrow blink every 0.4 seconds
    if (Math.round(frameCount / (0.4 * Constants.FramePerSecond)) % 2) return;

    const currentOption = this.selectingIdx
      ? this.optionStart
      : this.optionTargetScore;
    this.optionArrow.draw({
      x: currentOption.x - currentOption.textWidth / 2 - 24,
      y: currentOption.y,
    });
  }
  /* @override */
  open() {
    this.selectingIdx = 0;

    super.open();
  }

  keyPressed() {
    if (!this.isOpen) return;

    // change to next page when on 'Start' and press 'Enter' or 'HIT'
    if (this.selectingIdx === 1) {
      const isPressSelect = this._isPressed('HIT', keyCode) || keyCode === 13;
      if (isPressSelect) {
        const newTargetScore =
          this.targetScoreOptions[this.targetScoreOptionIdx];
        Controller.updateTargetScore(newTargetScore);
        Controller.changePage(new MapSelection(), Constants.Page.MAP_SELECTION);
      }
    }

    // change target score when on 'Play to' and press 'LEFT' or 'RIGHT'
    if (this.selectingIdx === 0) {
      const isPressLeft = this._isPressed('LEFT', keyCode);
      const isPressRight = this._isPressed('RIGHT', keyCode);
      if (isPressLeft) {
        this.targetScoreOptionIdx = this.targetScoreOptionIdx
          ? this.targetScoreOptionIdx - 1
          : this.targetScoreOptions.length - 1;
      }
      if (isPressRight) {
        this.targetScoreOptionIdx =
          (this.targetScoreOptionIdx + 1) % this.targetScoreOptions.length;
      }
    }

    // press 'UP' or 'DOWN' to switch selection
    const isPressUp = this._isPressed('UP', keyCode);
    const isPressLeft = this._isPressed('DOWN', keyCode);
    if (isPressUp || isPressLeft) {
      this.selectingIdx = this.selectingIdx ? 0 : 1;
    }
  }

  _isPressed(control, keyCode) {
    return Settings.players.some(
      ({ controls }) => controls[control].value === keyCode,
    );
  }
}
