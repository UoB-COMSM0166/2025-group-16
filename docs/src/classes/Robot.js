/**
 * Manage a robot entity in the game
 * Handle autonomous movement and pause functionality
 */
class Robot extends Entity {
  /**
   * @param {Object} params - The parameters for the player.
   * @param {number} params.idx - The index of the robot in robots.
   * @param {keyof typeof Constants.EntitySize} [params.size] - Optional. The size of the player.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   * @param {{ x: number, y: number, width: number, height: number }} [params.positionBoundary] - Optional. If provided and no `position`, will be randomly placed within the boundary.
   * @param {{ x: number, y: number, width: number, height: number }} [params.randomPositionArea] - Optional. If provided, the entity will be placed within the area.
   * @param {number} [params.randomPositionPadding] - Optional. If provided, the entity will be placed within the positionBoundary with a padding.
   * @param {boolean} [params.isPaused] - Optional. If true, the Robot will stay on the current position.
   */
  constructor(params) {
    super({
      idx: params.idx,
      type: Constants.EntityType.ROBOT,
      shapeType: Constants.EntityType.ROBOT,
      size: params?.size,
      position: params?.position,
      positionBoundary: params?.positionBoundary,
      randomPositionPadding: params?.randomPositionPadding,
      randomPositionArea: params?.randomPositionArea,
    });

    this.isPaused = params?.isPaused ?? false;
    this.action = () => {};
    this.actionEndTime = millis();
  }

  /**
   * Draw robot and handle autonomous movement
   * @override
   */
  draw() {
    super.draw();

    if (this.status === Constants.EntityStatus.DIED) return;
    if (!this.isPaused) {
      if (millis() > this.actionEndTime) this.move();
      this.action();
    }
  }

  /** Pause robot movement */
  pause() {
    this.action = () => {}; // clear current action
    this.actionEndTime = millis() + 1000; // stop immediately
  }

  /**
   * Control robot movement in specific direction
   * @param {Constants.EntityMove} direction - Movement direction to control
   */
  controlMove(direction) {
    this.action = () => {
      super.move(direction);
    };
    this.actionEndTime = millis() + 1000; // custom action duration
  }

  /**
   * Perform autonomous movement with random direction and duration
   * @override
   */
  move() {
    if (this.status === Constants.EntityStatus.DIED) return;

    const duration = Math.floor(Math.random() * 5) + 1;
    const type = random(Object.values(Constants.RobotMoveOption));
    this.actionEndTime = millis() + duration * 1000;

    this.action = () => {
      moveDirections[type]?.forEach((dir) => {
        const isAtBoundary = super.move(dir);
        if (isAtBoundary) {
          this.actionEndTime = 0;
        }
      });
    };
  }
}

// map robot movement options to entity movement directions
const moveDirections = {
  [Constants.RobotMoveOption.UP]: [Constants.EntityMove.UP],
  [Constants.RobotMoveOption.DOWN]: [Constants.EntityMove.DOWN],
  [Constants.RobotMoveOption.LEFT]: [Constants.EntityMove.LEFT],
  [Constants.RobotMoveOption.RIGHT]: [Constants.EntityMove.RIGHT],
  [Constants.RobotMoveOption.UP_LEFT]: [
    Constants.EntityMove.UP,
    Constants.EntityMove.LEFT,
  ],
  [Constants.RobotMoveOption.UP_RIGHT]: [
    Constants.EntityMove.UP,
    Constants.EntityMove.RIGHT,
  ],
  [Constants.RobotMoveOption.DOWN_LEFT]: [
    Constants.EntityMove.DOWN,
    Constants.EntityMove.LEFT,
  ],
  [Constants.RobotMoveOption.DOWN_RIGHT]: [
    Constants.EntityMove.DOWN,
    Constants.EntityMove.RIGHT,
  ],
  [Constants.RobotMoveOption.STOP]: [],
};
