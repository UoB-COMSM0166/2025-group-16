/**
 * Represents a generic entity in the game.
 */
class Entity {
  /**
   * Creates a new Entity instance.
   * @param {Object} params - The parameters for the entity.
   * @param {number} params.idx - The idx of the entity in the target type.
   * @param {keyof typeof Constants.EntityType} params.type - The type of the entity.
   * @param {string} [params.color] - Optional. The color of the entity.
   * @param {keyof typeof Constants.EntitySize} [params.size] - Optional. The size of the entity.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   */
  constructor(params) {
    this.idx = params.idx;
    this.type = params.type;
    this.status = Constants.EntityStatus.ALIVE;
    this.color = params?.color || Theme.palette.primary;
    this.size = params?.size || Constants.EntitySize.M;

    this.speed = Settings.entity.speed;

    if (params?.position) {
      this.x = params.position.x;
      this.y = params.position.y;
    } else {
      this.x = Math.random() * (width - (this.getShape()?.width || 0));
      this.y = Math.random() * (height - (this.getShape()?.height || 0));
    }
  }

  /** Draws the entity on the canvas. (To be overridden by subclasses) */
  draw() {
    if (this.status === Constants.EntityStatus.DIED) return;

    const shapeImg = this.getShape().image;
    if (shapeImg) image(shapeImg, this.x, this.y);
  }

  /**
   * Moves the entity.
   * @param {keyof typeof Constants.EntityMove} direction - Move direction, get the direction from `Constants.EntityMove.xxx`.
   */
  move(direction) {
    if (this.status === Constants.EntityStatus.DIED) return;

    switch (direction) {
      case Constants.EntityMove.UP: {
        this.y = Math.max(this.y - this.speed, 0);
        break;
      }
      case Constants.EntityMove.DOWN: {
        this.y = Math.min(this.y + this.speed, height - this.getShape().height);
        break;
      }
      case Constants.EntityMove.LEFT: {
        this.x = Math.max(this.x - this.speed, 0);
        break;
      }
      case Constants.EntityMove.RIGHT: {
        this.x = Math.min(this.x + this.speed, width - this.getShape().width);
        break;
      }
    }
  }

  getShape() {
    return Resources.img.entity[this.size][this.status];
  }
}
