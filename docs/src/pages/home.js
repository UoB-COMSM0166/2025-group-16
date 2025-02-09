class Home extends BasePage {
  constructor() {
    super();
    this.startButton = null;
  }

  setup() {
    this.startButton = new Button({
      x: width / 2 - 100,
      y: (height / 4) * 3,
      width: 200,
      height: 50,
      label: 'Start Game',
      action: () =>
        Controller.changePage(
          new MapBasicIntro(),
          Constants.Page.MAP_BASIC_INTRO,
        ),
      color: Theme.palette.primary,
      hoverColor: colorHelper.lighter(Theme.palette.primary, 0.5),
    });
  }

  draw() {
    this.startButton?.draw();
  }

  mousePressed() {
    this.startButton?.mousePressed();
  }
}
