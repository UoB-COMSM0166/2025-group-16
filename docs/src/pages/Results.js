class Results extends BasePage {
  constructor() {
    super();
    this.backButton = null;
  }

  /** @override */
  setup() {
    this.backButton = new Button({
      x: width / 2 - 100,
      y: (height / 4) * 3,
      width: 200,
      height: 50,
      label: 'Back to Home',
      action: () =>
        Controller.changePage(new Welcome(), Constants.Page.WELCOME),
      color: Theme.palette.darkBlue,
      hoverColor: colorHelper.lighter(Theme.palette.darkBlue, 0.5),
    });
  }

  /** @override */
  draw() {
    this.backButton?.draw();
  }

  /** @override */
  mousePressed() {
    this.backButton?.mousePressed();
  }
}
