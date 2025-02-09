class Results extends BasePage {
  constructor() {
    super();
    this.backButton = null;
  }

  setup() {
    this.backButton = new Button({
      x: width / 2 - 100,
      y: (height / 4) * 3,
      width: 200,
      height: 50,
      label: 'Back to Home',
      action: () => Controller.changePage(new Home(), Constants.Page.HOME),
      color: Theme.palette.primary,
      hoverColor: colorHelper.lighter(Theme.palette.primary, 0.5),
    });
  }

  draw() {
    this.backButton?.draw();
  }

  mousePressed() {
    this.backButton?.mousePressed();
  }
}
