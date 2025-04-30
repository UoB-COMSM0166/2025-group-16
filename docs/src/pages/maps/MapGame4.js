const areaMap4 = {
  x: 0,
  y: 181,
  width: 1280,
  height: 540,
};

class MapGame4 extends BaseMapGame {
  constructor() {
    const entityParams = {
      randomPositionArea: areaMap4,
      randomPositionPadding: 0,
      positionBoundary: areaMap4,
    };

    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 10,
      background: Resources.images.map.game4,
      bgm: Resources.sounds.bgm.playing4,
      robotParams: entityParams,
      playerParams: entityParams,
    });
    this.rectH = height / 4 - 30;
    this.keyX = width - width / 4;
    this.keyY = this.rectH / 4;
    this.lineX = width / 4;

    this.keys = [];
    this.keyLimit = 5;
    this.keyAmount = 0;

    this.dancePeriod = 20;
    this.timeBeforeDanceCountdown = 5 * Constants.FramePerSecond;
    this.danceCountdownTimer = 0;
  }

  draw() {
    super.draw();
    this._drawDanceline();

    if (this.timeBeforeDanceCountdown > 0) {
      this.timeBeforeDanceCountdown -= 1;
      return;
    }

    this._renderDanceKeys();

    if (this.danceCountdownTimer === 0) {
      this._resetTimer();
    }
  }

  _drawDanceline() {
    stroke(Theme.palette.white);
    strokeWeight(3);
    line(this.lineX, 0, this.lineX, this.rectH);
  }

  _renderDanceKeys() {
    if (
      this.danceCountdownTimer <= this.dancePeriod * Constants.FramePerSecond &&
      this.danceCountdownTimer > 0
    ) {
      this._updateKeys();
      this.danceCountdownTimer -= 1;
    }
  }

  _updateKeys() {
    if (
      frameCount % Constants.FramePerSecond === 0 &&
      this.keyAmount < this.keyLimit
    ) {
      const { text, key } = this._generateRandomDirectionKey();
      this.keys.push({
        label: text,
        key: key,
        x: this.keyX,
        y: this.keyY,
      });

      this.keyAmount += 1;
    }

    for (let k of this.keys) {
      // text
      const textFrame = new Text({
        x: k.x,
        y: k.y,
        label: k.label,
        color: Theme.palette.black,
        stroke: 2,
        strokeWeight: 4,
        textSize: Theme.text.fontSize.largeTitle,
      });
      const keyText = new Text({
        x: k.x,
        y: k.y,
        label: k.label,
        color: Theme.palette.white,
        textSize: Theme.text.fontSize.largeTitle,
      });
      textFrame.draw();
      keyText.draw();
      k.x -= 2; // make key move left

      // when KEY arrive line, trigger robots to move
      if (Math.abs(k.x - this.lineX) < 3) {
        this.robots.forEach((robot) => {
          if (robot.status !== Constants.EntityStatus.DIED) {
            if (k.key) {
              robot.controlMove(k.key);
            } else {
              robot.pause();
            }
          }
        });
      }
    }
    // key disappear if over left line
    this.keys = this.keys.filter((k) => k.x > 150);
  }

  _resetTimer() {
    this.danceCountdownTimer = this.dancePeriod * Constants.FramePerSecond;
    this.keyAmount = 0;
    this.keys = this.keys.filter((key) => key.x > -100);
  }

  _generateRandomDirectionKey() {
    // right, left, up, down, stop
    const directionKey = [
      { text: '⬅', key: Constants.EntityMove.LEFT },
      { text: '⮕', key: Constants.EntityMove.RIGHT },
      { text: '⬆', key: Constants.EntityMove.UP },
      { text: '⬇', key: Constants.EntityMove.DOWN },
      { text: '⏸️', key: null },
    ];
    const randomInt = Math.floor(Math.random() * 5);
    return directionKey[randomInt];
  }
}
