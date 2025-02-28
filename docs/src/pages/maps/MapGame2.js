const positionBoundary = {
  x: 64,
  y: 90,
  width: 1152,
  height: 468,
};

class MapGame2 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 10,
      background: Resources.images.map.game2,
      // TODO: change bgm
      bgm: Resources.sounds.bgm.playing1,
      playerParams: {
        positionBoundary,
      },
      robotParams: {
        positionBoundary,
      },
    });
  }

  draw() {
    super.draw();

    // robots hit randomly when there are more than 1 player alive
    if (this.alivePlayerCtn <= 1) return;
    this.robots.forEach((robot) => {
      if (robot.status === Constants.EntityStatus.DIED) return;

      if (robot?.nextHitFrameCtn === undefined) {
        // initialize
        robot.nextHitFrameCtn = getNextHitFrameCtn();
      } else if (robot.nextHitFrameCtn === 0) {
        // if count down to 0, hit
        robot.hit([...this.robots, ...this.players], (diedEntity) => {
          if (diedEntity.type === Constants.EntityType.PLAYER) {
            this.alivePlayerCtn--;
          }
        });
        robot.nextHitFrameCtn = getNextHitFrameCtn();
      } else {
        // count down
        robot.nextHitFrameCtn--;
      }
    });
  }
}

// robot hit next time after 5-15 seconds
const getNextHitFrameCtn = () =>
  (Math.floor(Math.random() * 10) + 5) * Constants.FramePerSecond;
