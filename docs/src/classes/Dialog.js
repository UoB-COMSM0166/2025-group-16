/**
 * Creates an instance of Dialog.
 */
class Dialog {
  /**
   * @param {Object} params - The parameters for the dialog.
   * @param {string} params.title - The title of the dialog.
   * @param {boolean} [params.isOpen=false] - Indicates whether the dialog is open.
   */
  constructor(params) {
    this.title = params.title;
    this.isOpen = params?.isOpen || false;

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
    this.tutorialDialogTitle.draw();
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
    this.tutorialDialogTitle = new Text({
      label: this.title,
      x: width / 2,
      y: 255,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.medium,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}
