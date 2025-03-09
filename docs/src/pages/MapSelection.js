class MapSelection extends BasePage {
  constructor() {
    super({
      bgm: Resources.sounds.bgm.intro, // TODO: check bgm
      background: Resources.images.welcome.background,
    });

    this.selectingIdx = 0;

    this.pointerSetting = {
      side: 30,
      height: (Math.sqrt(3) * 30) / 2,
      gap: 16,
    };
  }

  /** @override */
  setup() {
    super.setup();

    this.title = new Text({
      label: 'SELECT MAP',
      x: width / 2,
      y: height / 4 - 28,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 1,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.mapName = new Text({
      label: '',
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.medium,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.backHint = new Text({
      label: `Press ${Settings.players
        .map(({ controls }) => `[${controls.HIT.name}]`)
        .join('/')}/[Enter] to Select`,
      x: width / 2,
      y: height / 2 + 265,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.small,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  /** @override */
  draw() {
    super.draw();

    this.title?.draw();
    for (let i = 0; i < Constants.Map.length; i++) {
      this._drawMapOption(i);
    }
    this.backHint?.draw();
  }

  _drawMapOption(idx) {
    const scale = idx === this.selectingIdx ? 1 : 0.7;
    const img = Resources.images.mapSelection[idx];
    const imgWidth = img.image.width * scale;
    const imgHeight = img.image.height * scale;

    push();
    const gap = 340;
    const x = width / 2 + (idx - (Constants.Map.length - 1) / 2) * gap;
    const y = height / 2 + 24;

    imageMode(CENTER);
    image(img?.image, x, y, imgWidth, imgHeight);
    this.mapName.draw({
      label: Constants.Map[idx].name,
      x,
      y: y + imgHeight / 2 + 32,
    });

    if (idx === this.selectingIdx) {
      this._drawSelectingPointer(x, y, imgHeight);
    }
    pop();
  }

  _drawSelectingPointer(x, y, imgHeight) {
    // blink every 0.5 seconds
    if (Math.round(frameCount / (0.5 * Constants.FramePerSecond)) % 2) return;

    const pointerY = y - this.pointerSetting.height;
    const offsetY = imgHeight / 2 + this.pointerSetting.gap;

    fill(Theme.palette.text.primary);
    triangle(
      x - this.pointerSetting.side / 2,
      pointerY - offsetY,
      x + this.pointerSetting.side / 2,
      pointerY - offsetY,
      x,
      y - offsetY,
    );
  }

  _isPressed(control, keyCode) {
    return Settings.players.some(
      ({ controls }) => controls[control].value === keyCode,
    );
  }

  /** @override */
  keyPressed() {
    super.keyPressed();

    if (this._isPressed('LEFT', keyCode)) {
      this.selectingIdx =
        this.selectingIdx === 0
          ? Constants.Map.length - 1
          : this.selectingIdx - 1;
    }

    if (this._isPressed('RIGHT', keyCode)) {
      this.selectingIdx =
        this.selectingIdx === Constants.Map.length - 1
          ? 0
          : this.selectingIdx + 1;
    }

    // HIT or Enter to select
    if (this._isPressed('HIT', keyCode) || keyCode === 13) {
      switch (this.selectingIdx) {
        case 0:
          Controller.changePage(new MapIntro1(), Constants.Page.MAP_INTRO_1);
          break;
        case 1:
          Controller.changePage(new MapIntro2(), Constants.Page.MAP_INTRO_2);
          break;
        case 2:
          Controller.changePage(new MapIntro3(), Constants.Page.MAP_INTRO_3);
          break;
        default:
          break;
      }
    }
  }
}
