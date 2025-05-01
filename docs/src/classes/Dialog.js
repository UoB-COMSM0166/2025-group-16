/**
 * Creates an instance of Dialog.
 */
class Dialog {
  /**
   * @param {Object} params - The parameters for the dialog.
   * @param {string} params.title - The title of the dialog.
   * @param {boolean} [params.isOpen=false] - Indicates whether the dialog is open.
   * @param {Function|null} [params.onOpen=null] - Callback function to execute when the dialog is opened.
   * @param {Function|null} [params.onClose=null] - Callback function to execute when the dialog is closed.
   * @param {Text[]} [params.options=[]] - List of options available in the dialog.
   * @param {number} [params.optionGap=48] - The vertical offset between options in the dialog.
   * @param {number} [params.selectingIdx=0] - The index of the currently selected option.
   */
  constructor(params) {
    this.title = params.title;
    this.isOpen = params?.isOpen || false;
    this.onOpen = params?.onOpen || null;
    this.onClose = params?.onClose || null;

    this.options = params?.options || [];
    this.optionGap = params?.optionGap || 48;
    this.selectingIdx = params?.selectingIdx || 0;

    /**
     * - dialog content center position
     * - child component can use this position to center the content
     */
    this.contentBounds = {
      x: Settings.canvas.width / 2,
      y: Settings.canvas.height / 2 + 35,
      width: 590,
      height: 240,
    };

    this.initDialog();
  }

  draw() {
    if (this.isOpen) this.drawDialog();
  }

  drawDialog() {
    this._drawBackdrop();
    this._drawDialogBox();
    this.titleText.draw();
    this._drawOptions();
    this._drawOptionArrow();
  }

  _drawBackdrop() {
    push();
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, 0, width, height);
    pop();
  }

  _drawDialogBox() {
    push();
    const dialogBox = Resources.images.welcome.dialog;
    imageMode(CENTER);
    image(
      dialogBox.image,
      width / 2,
      height / 2,
      dialogBox.width,
      dialogBox.height,
    );
    pop();
  }

  initDialog() {
    this.titleText = new Text({
      label: this.title,
      x: width / 2,
      y: 255,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.medium,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.optionObjects = this.options.map(
      (opt, idx) =>
        new Text({
          label: opt.label,
          x: this.contentBounds.x,
          y:
            this.contentBounds.y +
            (idx - (this.options.length - 1) / 2) * this.optionGap,
          color: Theme.palette.text.primary,
          textSize: Theme.text.fontSize.small,
          textStyle: BOLD,
          textAlign: [CENTER, CENTER],
          textFont: 'Press Start 2P',
        }),
    );

    this.optionArrow = new Text({
      label: '>',
      color: Theme.palette.text.primary,
      stroke: Theme.palette.text.primary,
      strokeWeight: 2,
      textSize: Theme.text.fontSize.small * (2 / 3),
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  _drawOptions() {
    this.optionObjects.forEach((opt) => opt.draw());
  }

  _drawOptionArrow() {
    // option arrow blink every 0.4 seconds
    if (Math.round(frameCount / (0.4 * Constants.FramePerSecond)) % 2) return;

    const currOption = this.optionObjects[this.selectingIdx];
    this.optionArrow.draw({
      x: currOption.x - currOption.textWidth / 2 - 24,
      y: currOption.y,
    });
  }

  open() {
    this.selectingIdx = 0;
    this.onOpen?.();
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.onClose?.();
  }

  keyPressed() {
    if (!this.isOpen) return;

    // use 'HIT' or press 'Enter' to select
    if (this.isPressed('HIT', keyCode) || keyCode === 13) {
      this.onSelect(this.selectingIdx);
    }

    // use 'UP' or 'DOWN' to switch selection
    if (this.isPressed('UP', keyCode)) {
      this.selectingIdx = Math.max(0, this.selectingIdx - 1);
    } else if (this.isPressed('DOWN', keyCode)) {
      this.selectingIdx = Math.min(
        this.options.length - 1,
        this.selectingIdx + 1,
      );
    }
  }

  isPressed(control, keyCode) {
    return Settings.players.some(
      ({ controls }) => controls[control].value === keyCode,
    );
  }

  onSelect() {
    throw new Error('onSelect must be implemented by subclass');
  }
}
