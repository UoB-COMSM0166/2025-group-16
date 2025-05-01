// boundary configuration for game entities
const positionBoundary = {
  x: 70,
  y: 92,
  width: 1140,
  height: 470,
};

/**
 * Game implementation for Map 2
 * Rule: robot attacks randomly
 */
class MapGame2 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 10,
      background: Resources.images.map.game2,
      bgm: Resources.sounds.bgm.playing2,
      playerParams: {
        positionBoundary,
      },
      robotParams: {
        positionBoundary,
      },
    });
  }

  /**
   * Render game with random robot attack behavior
   * @override
   */
  draw() {
    super.draw();
    this._handleRobotAttacks();
  }

  /** Handle random robot attack timing */
  _handleRobotAttacks() {
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

/**
 * Calculate random interval for robot attacks
 * @returns {number} Frame count until next attack (5-15 seconds)
 */
const getNextHitFrameCtn = () =>
  (Math.floor(Math.random() * 10) + 5) * Constants.FramePerSecond;
