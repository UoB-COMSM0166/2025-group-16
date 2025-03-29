class MapGame5 extends BaseMapGame {
  constructor() {
    // TODO: change bg & bgm
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 10,
      background: Resources.images.map.game1,
      bgm: Resources.sounds.bgm.playing1,
    });

    this.attackCountdown = 3 * Constants.FramePerSecond;
    // Due the game countdown at the start, daley the attack countdown
    this.startCountdownDelay = 5 * Constants.FramePerSecond;
    this.aa = new Text({
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

  // TODO: add map rules
  draw() {
    super.draw();

    if (this.startCountdownDelay > 0) {
      this.startCountdownDelay--;
      return;
    }

    const secondsLeft = Math.ceil(this.attackCountdown / Constants.FramePerSecond);
    if (secondsLeft <= 3){
      this.aa.label = secondsLeft > 0 ? String(secondsLeft) : '';
      this.aa.draw();
    }

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
      // Reset countdown
      this.attackCountdown = 8 * Constants.FramePerSecond;
    } else {
      this.attackCountdown--;
    }
  }

}
