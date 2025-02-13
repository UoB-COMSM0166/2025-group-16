/**
 * Represents a robot in the game.
 */
class Robot extends Entity {
  /**
   * Creates a new Robot instance.
   * @param {Object} params - The parameters for the player.
   * @param {number} params.idx - The index of the robot in robots.
   * @param {typeof Theme.palette.entity[keyof typeof Theme.palette.entity]} [params.color] - The color of the player.
   * @param {keyof typeof Constants.EntitySize} [params.size] - The size of the player.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   */
  constructor(params) {
    super({
      idx: params.idx,
      type: Constants.EntityType.ROBOT,
      color: params?.color,
      size: params?.size,
      position: params?.position,
    });

    this.action = () => {};
    this.actionEndTime = millis();
  }

  /** @override */
  draw() {
    super.draw();
  }

  /** @override */
  move() {
    if (this.status === Constants.EntityStatus.DIED) return;

    const duration = Math.floor(Math.random() * 5) + 1;
    const type = random(Object.values(Constants.RobotMoveOption));
    this.actionEndTime = millis() + duration * 1000;

    this.action = () => {
      moveDirections[type]?.forEach((dir) => super.move(dir));
    };
  }

  update() {
    if (this.status === Constants.EntityStatus.DIED) return;

    if (millis() > this.actionEndTime) this.move();
    this.action();
  }
}

// map RobotMoveOptions to EntityMove
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
