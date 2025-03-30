class TutorialDialog extends Dialog {
  constructor() {
    super({
      title: 'START TUTORIAL?',
      isOpen: localStorage.getItem(Constants.TutorialCompletedKey) !== 'true',
    });

    this.selectingIdx = 0;
  }

  /** @override */
  drawDialog() {
    super.drawDialog();

    this.option1.draw();
    this.option2.draw();
    this._drawOptionArrow();
  }

  /** @override */
  initDialog() {
    super.initDialog();

    this.optionYOffset = 24;

    this.option1 = new Text({
      label: 'Yes',
      x: this.contentBounds.x,
      y: this.contentBounds.y - this.optionYOffset,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.small,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
    this.option2 = new Text({
      label: 'No',
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
      x: this.contentBounds.x - 12,
      color: Theme.palette.text.primary,
      stroke: Theme.palette.text.primary,
      strokeWeight: 2,
      textSize: Theme.text.fontSize.small * (2 / 3),
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  _drawOptionArrow() {
    // option arrow blink every 0.4 seconds
    if (Math.round(frameCount / (0.4 * Constants.FramePerSecond)) % 2) return;

    const currentOption = this.selectingIdx ? this.option2 : this.option1;
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

  /* @override */
  close() {
    super.close();

    localStorage.setItem(Constants.TutorialCompletedKey, 'true');
  }

  keyPressed() {
    if (!this.isOpen) return;

    // use 'HIT' or press 'Enter' to select
    if (this._isPressed('HIT', keyCode) || keyCode === 13) {
      if (this.selectingIdx === 0) {
        Controller.changePage(new Tutorial(), Constants.Page.TUTORIAL);
      } else {
        this.close();
      }
    }

    // use 'UP' or 'DOWN' to switch selection
    if (this._isPressed('UP', keyCode) || this._isPressed('DOWN', keyCode)) {
      this.selectingIdx = this.selectingIdx ? 0 : 1;
    }
  }

  _isPressed(control, keyCode) {
    return Settings.players.some(
      ({ controls }) => controls[control].value === keyCode,
    );
  }
}
