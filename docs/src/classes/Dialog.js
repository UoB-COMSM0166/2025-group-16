/**
 * Manage the base dialog functionality in the game
 * Provide rendering and interaction for dialog interfaces
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

    this.contentBounds = {
      x: Settings.canvas.width / 2,
      y: Settings.canvas.height / 2 + 35,
      width: 590,
      height: 240,
    }; // dialog content center position

    this.initDialog();
  }

  /** Draw the dialog if open */
  draw() {
    if (this.isOpen) this.drawDialog();
  }

  /** Render the dialog components */
  drawDialog() {
    this._drawBackdrop();
    this._drawDialogBox();
    this.titleText.draw();
    this._drawOptions();
    this._drawOptionArrow();
  }

  /** Draw the dialog backdrop */
  _drawBackdrop() {
    push();
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, 0, width, height);
    pop();
  }

  /** Draw the dialog box image */
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

  /** Initialize dialog components */
  initDialog() {
    this.titleText = new Text({
      label: this.title,
      x: width / 2,
      y: 270,
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

  /** Render dialog options */
  _drawOptions() {
    this.optionObjects.forEach((opt) => opt.draw());
  }

  /** Draw the selection arrow with blinking effect */
  _drawOptionArrow() {
    if (Math.round(frameCount / (0.4 * Constants.FramePerSecond)) % 2) return; // blink every 0.4 seconds

    const currOption = this.optionObjects[this.selectingIdx];
    this.optionArrow.draw({
      x: currOption.x - currOption.textWidth / 2 - 24,
      y: currOption.y,
    });
  }

  /** Open the dialog */
  open() {
    this.selectingIdx = 0;
    this.onOpen?.();
    this.isOpen = true;
  }

  /** Close the dialog */
  close() {
    this.isOpen = false;
    this.onClose?.();
  }

  /** Handle key press events */
  keyPressed() {
    if (!this.isOpen) return;

    if (this.isPressed('HIT', keyCode) || keyCode === 13) {
      // select option with 'HIT' or 'Enter'
      this.onSelect(this.selectingIdx);
    }

    if (this.isPressed('UP', keyCode)) {
      // move selection up
      this.selectingIdx = Math.max(0, this.selectingIdx - 1);
    } else if (this.isPressed('DOWN', keyCode)) {
      // move selection down
      this.selectingIdx = Math.min(
        this.options.length - 1,
        this.selectingIdx + 1,
      );
    }
  }

  /**
   * Check if a control key is pressed
   * @param {string} control - Control name
   * @param {number} keyCode - Key code to check
   * @returns {boolean} True if the control key is pressed
   */
  isPressed(control, keyCode) {
    return Settings.players.some(
      ({ controls }) => controls[control].value === keyCode,
    );
  }

  /**
   * Handle option selection
   * @throws {Error} Must be implemented by subclass
   */
  onSelect() {
    throw new Error('onSelect must be implemented by subclass');
  }
}
