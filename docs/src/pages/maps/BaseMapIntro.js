class BaseMapIntro extends BasePage {
  /**
   * Creates a new MapGame page instance.
   * @param {Object} params - The parameters for the map page.
   * @param {string} params.title - The number of robots.
   * @param {string[]} params.playerControlIntros - The number of robots.
   * @param {string} [params.additionalIntro] - The number of robots.
   */
  constructor(params) {
    super();
    this.title = params.title;
    this.playerControlIntros = params.playerControlIntros;
    this.additionalIntro = params?.additionalIntro;

    this.titleText = null;
    this.playerControlIntroTexts = null;
    this.additionalIntroText = null;
    this.startButton = null;
  }

  /** @override */
  setup() {
    this.titleText = new Text({
      label: this.title,
      x: width / 2,
      y: (height / 6) * 2,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
    });

    this.playerControlIntroTexts = this.playerControlIntros.map(
      (intro, idx) =>
        new Text({
          label: intro,
          x: width / 2,
          y: (height / 6) * 2 + 80 + 55 * idx,
          color: Theme.palette.text.primary,
          textSize: Theme.text.fontSize.medium,
          textAlign: [CENTER, CENTER],
        }),
    );

    if (this.additionalIntroText) {
      this.additionalIntroText = new Text({
        label: this.additionalIntroText,
        x: width / 2,
        y: (height / 4) * 3 - 80,
        color: Theme.palette.text.primary,
        textSize: Theme.text.fontSize.large,
        textStyle: BOLD,
        textAlign: [CENTER, CENTER],
      });
    }

    this.startButton = new Button({
      x: width / 2,
      y: (height / 4) * 3,
      width: 400,
      height: 80,
      action: () =>
        Controller.changePage(new MapGame1(), Constants.Page.MAP_GAME_1),
      color: Theme.palette.darkBlue,
      hoverColor: colorHelper.lighter(Theme.palette.darkBlue, 0.5),
      align: [CENTER, TOP],
      textParams: {
        label: 'Ready!',
      },
    });
  }

  /** @override */
  draw() {
    this.titleText?.draw();
    this.additionalIntroText?.draw();
    this.playerControlIntroTexts.map((text) => text?.draw());
    this.startButton?.draw();
  }

  /** @override */
  mousePressed() {
    this.startButton?.mousePressed();
  }
}
