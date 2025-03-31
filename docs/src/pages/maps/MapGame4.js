const areaMap4 = {
  x: 0,
  y: 181,
  width: 1280,
  height: 540,
};

class MapGame4 extends BaseMapGame {
  constructor() {
    // TODO: change bg & bgm
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 10,
      // background: Resources.images.map.game1,
      // bgm: Resources.sounds.bgm.playing1,
      robotParams: {
        randomPositionArea: areaMap4,
        randomPositionPadding: 0,
        positionBoundary: areaMap4,
      },
      playerParams: {
        randomPositionArea: areaMap4,
        randomPositionPadding: 0,
        positionBoundary: areaMap4,
      },
    });
    this.rectH = height / 4;
    this.keyX = width;
    this.keyY = this.rectH / 4;
    this.lineX = width / 4;

    this.keys = [];
    this.keylimit = 5;
    this.keyAmount = 0;

    this.dancePeriod = 20;
    this.timeBeforeDanceCountdown = 5 * Constants.FramePerSecond;
    this.danceCountdownTimer = 0;
  }

  draw() {
    this._drawDanceBar();
    super.draw();

    if (this.timeBeforeDanceCountdown > 0) {
      this.timeBeforeDanceCountdown -= 1;
      return;
    }

    this._displayPreDanceCountdown();
    this._renderDanceKeys();

    if (this.danceCountdownTimer === 0) {
      this._resetTimer();
    }
  }

  _drawDanceBar() {
    push();
    fill(Theme.palette.darkBlue);
    noStroke();
    rect(0, 0, width, this.rectH);
    pop();

    stroke(Theme.palette.white);
    strokeWeight(2);
    line(this.lineX, 0, this.lineX, this.rectH);
  }

  _displayPreDanceCountdown() {
    const timeLeft = Math.ceil(
      this.danceCountdownTimer / Constants.FramePerSecond,
    );

    if (timeLeft <= 3) {
      const countdownText = new Text({
        x: width / 2,
        y: height / 4,
        label: timeLeft.toString(),
        textSize: Theme.text.fontSize.large,
        color: Theme.palette.black,
        textAlign: [CENTER, CENTER],
      });
      countdownText.draw();
    }
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
      this.keyAmount < this.keylimit
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
      const keyText = new Text({
        x: k.x,
        y: k.y,
        label: k.label,
        color: Theme.palette.white,
        textSize: Theme.text.fontSize.largeTitle,
      });
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
  }

  _resetTimer() {
    this.danceCountdownTimer = this.dancePeriod * Constants.FramePerSecond;
    this.keyAmount = 0;
    this.keys = this.keys.filter((key) => key.x > -100);
  }

  _generateRandomDirectionKey() {
    //right,left,up,down,stop, punch(?)
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
