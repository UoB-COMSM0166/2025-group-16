// boundary configuration for game entities
const areaMap5 = {
  x: 121,
  y: 21,
  width: 980,
  height: 610,
};

/**
 * Game implementation for Map 5
 * Rule: robots hit in certain intervals
 */
class MapGame5 extends BaseMapGame {
  constructor() {
    const entityParams = {
      randomPositionArea: areaMap5,
      randomPositionPadding: 0,
      positionBoundary: areaMap5,
    };

    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 10,
      background: Resources.images.map.game5,
      bgm: Resources.sounds.bgm.playing5,
      robotParams: entityParams,
      playerParams: entityParams,
    });

    this.attackCountdown = 3 * Constants.FramePerSecond;
    // due the game countdown at the start, daley the attack countdown
    this.startCountdownDelay = 5 * Constants.FramePerSecond;
    this.hitCountDownText = new Text({
      label: '',
      x: width / 2,
      y: height * 0.2,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.medium,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 1,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  /**
   * Render game with synchronized attack countdown
   * @override
   */
  draw() {
    super.draw();

    if (this.startCountdownDelay > 0) {
      this.startCountdownDelay--;
      return;
    }

    // display countdown when <= 3 seconds
    const secondsLeft = Math.ceil(
      this.attackCountdown / Constants.FramePerSecond,
    );
    if (secondsLeft <= 3) {
      this.hitCountDownText.label = secondsLeft > 0 ? String(secondsLeft) : '';
      this.hitCountDownText.draw();
    }

    // trigger attacks when countdown reaches 0
    if (this.attackCountdown === 0) {
      this.robots.forEach((robot) => {
        if (robot.status !== Constants.EntityStatus.DIED) {
          robot.hit([...this.robots, ...this.players], (diedEntity) => {
            if (diedEntity.type === Constants.EntityType.PLAYER) {
              this.alivePlayerCtn--;
            }
          });
        }
      });

      // reset countdown
      this.attackCountdown = 8 * Constants.FramePerSecond;
    } else {
      this.attackCountdown--;
    }
  }
}
