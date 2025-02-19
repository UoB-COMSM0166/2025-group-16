class Results extends BasePage {
  constructor() {
    super();
    this.backButton = null;
  }

  /** @override */
  setup() {
    this.backButton = new Button({
      x: width / 2,
      y: (height / 4) * 3,
      width: 400,
      height: 100,
      action: () =>
        Controller.changePage(new Welcome(), Constants.Page.WELCOME),
      color: Theme.palette.darkBlue,
      hoverColor: colorHelper.lighter(Theme.palette.darkBlue, 0.5),
      align: [CENTER, TOP],
      textParams: {
        label: 'Back to Home',
        textSize: Theme.text.fontSize.medium,
      },
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
