/**
 * Represents a generic entity in the game.
 */
class Entity {
  /**
   * Creates a new Entity instance.
   * @param {Object} params - The parameters for the entity.
   * @param {number} params.idx - The idx of the entity in the target type.
   * @param {string} params.type - The type of the entity.
   * @param {string} [params.color] - Optional. The color of the entity.
   * @param {string} [params.size] - Optional. The size of the entity.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   */
  constructor(params) {
    if (params?.position) {
      this.x = params.position.x;
      this.y = params.position.y;
    } else {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    this.idx = params.idx;
    this.type = params.type;
    this.status = Constants.EntityStatus.ALIVE;
    this.color = params?.color || Theme.palette.primary;
    this.size = params?.size || Settings.entity.size.default;
  }

  /** Moves the entity. (To be overridden by subclasses) */
  move() {
    // To be implemented by subclass
  }

  /** Draws the entity on the canvas. (To be overridden by subclasses) */
  draw() {
    if (this.status === Constants.EntityStatus.DIED) return;
    // To be implemented by subclass
  }

  /** Handles key pressed events. (To be overridden by subclasses) */
  keyPressed() {
    // To be implemented by subclass
  }

  /** Updates the entity's state. */
  update() {
    if (this.status === Constants.EntityStatus.DIED) return;
    this.move();
  }
}
