class MapBasicIntro extends BasePage {
  constructor() {
    super();
    this.introText1 = null;
    this.introText2 = null;
    this.introText3 = null;
    this.startButton = null;
  }

  setup() {
    this.introText1 = new Text({
      label: 'Fight!',
      x: width / 2,
      y: (height / 5) * 2,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      textAlign: CENTER,
    });
    this.introText2 = new Text({
      label: 'Player 1: Move with [W A S D], attack with [Q]',
      x: width / 2,
      y: (height / 5) * 2 + 50,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.medium,
      textAlign: CENTER,
    });
    this.introText3 = new Text({
      label: 'Player 2: Move with [↑ ← ↓ →], attack with [/]',
      x: width / 2,
      y: (height / 5) * 2 + 85,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.medium,
      textAlign: CENTER,
    });

    this.startButton = new Button({
      x: width / 2 - 100,
      y: (height / 4) * 3,
      width: 200,
      height: 50,
      label: 'Ready!',
      action: () =>
        Controller.changePage(new MapBasicGame(), Constants.Page.MapBasicGame),
      color: Theme.palette.primary,
      hoverColor: colorHelper.lighter(Theme.palette.primary, 0.5),
    });
  }

  draw() {
    this.introText1?.draw();
    this.introText2?.draw();
    this.introText3?.draw();
    this.startButton?.draw();
  }

  mousePressed() {
    this.startButton?.mousePressed();
  }
}
