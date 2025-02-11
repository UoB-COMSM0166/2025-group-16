/**
 * Represents a robot in the game.
 */
class Robot extends Entity {
  /**
   * Creates a new Robot instance.
   * @param {Object} params - The parameters for the player.
   * @param {number} params.idx - The index of the robot in robots.
   * @param {string} [params.color] - The color of the player.
   * @param {keyof typeof Constants.EntitySize} [params.size] - The size of the player.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   */
  constructor(params) {
    super({
      idx: params.idx,
      type: Constants.EntityType.ROBOT,
      color: params?.color, // TODO: apply different players' color
      size: params?.size,
      position: params?.position,
    });

    this.action = () => {};
    this.actionEndTime = millis();
  }

  move() {
    if (this.status === Constants.EntityStatus.DIED) return;

    const duration = Math.floor(Math.random() * 5) + 1;
    const type = random(Object.values(Constants.MoveAction));
    this.actionEndTime = millis() + duration * 1000;

    const speed = Settings.entity.speed;
    const canvasWidth = width;
    const canvasHeight = height;
    const shapeSize = this.getShape().getSize();
    const shapeWidth = shapeSize.width;
    const shapeHeight = shapeSize.height;

    const actions = {
      [Constants.MoveAction.UP]: () => {
        if (this.y - speed >= 0) this.y -= speed;
        else this.move();
      },
      [Constants.MoveAction.DOWN]: () => {
        if (this.y + speed + shapeHeight <= canvasHeight) this.y += speed;
        else this.move();
      },
      [Constants.MoveAction.LEFT]: () => {
        if (this.x - speed >= 0) this.x -= speed;
        else this.move();
      },
      [Constants.MoveAction.RIGHT]: () => {
        if (this.x + speed + shapeWidth <= canvasWidth) this.x += speed;
        else this.move();
      },
      [Constants.MoveAction.UP_LEFT]: () => {
        if (this.x - speed >= 0 && this.y - speed >= 0) {
          this.x -= speed;
          this.y -= speed;
        } else this.move();
      },
      [Constants.MoveAction.UP_RIGHT]: () => {
        if (this.x + speed + shapeWidth <= canvasWidth && this.y - speed >= 0) {
          this.x += speed;
          this.y -= speed;
        } else this.move();
      },
      [Constants.MoveAction.DOWN_LEFT]: () => {
        if (
          this.x - speed >= 0 &&
          this.y + speed + shapeHeight <= canvasHeight
        ) {
          this.x -= speed;
          this.y += speed;
        } else this.move();
      },
      [Constants.MoveAction.DOWN_RIGHT]: () => {
        if (
          this.x + speed + shapeWidth <= canvasWidth &&
          this.y + speed + shapeHeight <= canvasHeight
        ) {
          this.x += speed;
          this.y += speed;
        } else this.move();
      },
      [Constants.MoveAction.STOP]: () => {},
    };

    this.action = actions[type] || (() => {});
  }

  update() {
    if (this.status === Constants.EntityStatus.DIED) return;

    if (millis() > this.actionEndTime) {
      this.move();
    }
    this.action();
  }

  draw() {
    if (this.status === Constants.EntityStatus.DIED) return;

    image(this.getShape().getImage(), this.x, this.y);
  }
}
