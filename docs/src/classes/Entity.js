/**
 * Represents a generic entity in the game.
 */
class Entity {
  /**
   * Creates a new Entity instance.
   * @param {Object} params - The parameters for the entity.
   * @param {number} params.idx - The idx of the entity in the target type.
   * @param {keyof typeof Constants.EntityType} params.type - The type of the entity.
   * @param {keyof typeof Constants.EntityType} params.shapeType - The shape type of the entity, can looks like a robot but is a player actually.
   * @param {keyof typeof Constants.EntityMove} [params.direction] - Optional. The current move direction of the entity.
   * @param {typeof Theme.palette.player[keyof typeof Theme.palette.player]} [params.color] - Optional. Only applicable for players.
   * @param {keyof typeof Constants.EntitySize} [params.size] - Optional. The size of the entity.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   * @param {boolean} params.canDie - Setting if the entity would die after hitting. default is true
   */
  constructor(params) {
    this.idx = params.idx;
    this.type = params.type;
    this.shapeType = params?.shapeType || params.type;
    this.direction = params?.direction || Constants.EntityMove.DOWN;
    this.color =
      params.shapeType === Constants.EntityType.ROBOT
        ? Theme.palette.robot.grey
        : params?.color || Theme.palette.player.red;
    this.size = params?.size || Constants.EntitySize.L;

    this.status = Constants.EntityStatus.ALIVE;
    this.speed = Settings.entity.speed;
    this.isWalking = false;
    this.canDie = params?.canDie ?? true; // default player will die after hitting

    this.frameIdx = 0;
    this.frameCtn = 0;

    if (params?.position) {
      this.x = params.position.x;
      this.y = params.position.y;
    } else {
      this.x = Math.random() * (width - initPadding);
      this.y = Math.random() * (height - initPadding);
    }
  }

  /** Draws the entity on the canvas. (To be overridden by subclasses) */
  draw() {
    if (this.status === Constants.EntityStatus.DIED) return;

    const currShape = this.getShape();
    if (currShape) {
      const { image: img, scaledWidth, scaledHeight } = currShape;
      if (img) image(img, this.x, this.y, scaledWidth, scaledHeight);
    }
    this.isWalking = false;
  }

  /**
   * Moves the entity.
   * @param {keyof typeof Constants.EntityMove} direction - Move direction, get the direction from `Constants.EntityMove.xxx`.
   */
  move(direction) {
    if (
      this.status === Constants.EntityStatus.HIT ||
      this.status === Constants.EntityStatus.DIED
    ) {
      return;
    }

    this.isWalking = true;
    this.direction = direction;
    const shape = this.getShape();
    const shapeWidth = shape.scaledWidth;
    const shapeHeight = shape.scaledHeight;
    switch (direction) {
      case Constants.EntityMove.UP: {
        this.y = Math.max(this.y - this.speed, 0);
        break;
      }
      case Constants.EntityMove.DOWN: {
        this.y = Math.min(this.y + this.speed, height - shapeHeight);
        break;
      }
      case Constants.EntityMove.LEFT: {
        this.x = Math.max(this.x - this.speed, 0);
        break;
      }
      case Constants.EntityMove.RIGHT: {
        this.x = Math.min(this.x + this.speed, width - shapeWidth);
        break;
      }
    }

    const isAtEdge = // TODO: haven't resolve
      this.x <= 0 ||
      this.x + shapeWidth >= width ||
      this.y <= 0 ||
      this.y + shapeHeight >= height;
    return isAtEdge;
  }

  hit(entities, onHitEntity) {
    // check if hit any of entities
    const hitEntities = {
      [Constants.EntityType.PLAYER]: [],
      [Constants.EntityType.ROBOT]: [],
    };
    for (const entity of entities) {
      const isMe = entity.type === this.type && entity.idx === this.idx;
      if (!isMe && entity.status !== Constants.EntityStatus.DIED) {
        const isKnockedDown = checkKnockedDown(this, entity);
        if (isKnockedDown) hitEntities[entity.type].push(entity);
      }
    }

    // play sound based on hit entities and play before animation to avoid delay
    if (hitEntities[Constants.EntityType.PLAYER].length) {
      Resources.sounds.entity.punch.sound?.play();
    } else if (hitEntities[Constants.EntityType.ROBOT].length) {
      Resources.sounds.entity.dong.sound?.play();
    } else {
      Resources.sounds.entity.whoosh.sound?.play();
    }

    // status change when hit: alive -> hit -> cooldown -> alive
    this.status = Constants.EntityStatus.HIT;
    setTimeout(() => {
      this.status = Constants.EntityStatus.COOLDOWN;

      setTimeout(() => {
        if (this.status !== Constants.EntityStatus.DIED) {
          this.status = Constants.EntityStatus.ALIVE;
        }
      }, Settings.entity.duration[Constants.EntityStatus.HIT]);
    }, Settings.entity.duration[Constants.EntityStatus.COOLDOWN]);

    // change status of hit entities
    for (const entity of [
      ...hitEntities[Constants.EntityType.PLAYER],
      ...hitEntities[Constants.EntityType.ROBOT],
    ]) {
      if (this.canDie) {
        entity.status = Constants.EntityStatus.DIED;
      }
      onHitEntity(entity);
    }
  }

  _getAnimationStatus() {
    if (this.status === Constants.EntityStatus.HIT)
      return Constants.EntityAnimationStatus.ATTACK;
    return this.isWalking
      ? Constants.EntityAnimationStatus.WALK
      : Constants.EntityAnimationStatus.IDLE;
  }

  getShape() {
    const aniStatus = this._getAnimationStatus();
    if (aniStatus === Constants.EntityAnimationStatus.ATTACK) {
      // only allow the attack animation to play for two frames, then keep the last frame
      if (this.frameIdx === 0 && this.frameCtn > Settings.entity.frameCtn) {
        this.frameIdx = 1;
        this.frameCtn = 0;
      }
    } else if (this.isWalking && this.frameCtn > Settings.entity.frameCtn) {
      // walking animation switches back and forth
      this.frameIdx = this.frameIdx ? 0 : 1;
      this.frameCtn = 0;
    }
    this.frameCtn++;

    const targetShape =
      Resources.images.entity[this.shapeType]?.[this.color]?.[aniStatus]?.[
        this.direction
      ]?.[
        aniStatus === Constants.EntityAnimationStatus.IDLE ? 0 : this.frameIdx
      ];

    const scale = Settings.entity.scale[this.size];
    targetShape.scaledWidth = targetShape.width * scale;
    targetShape.scaledHeight = targetShape.height * scale;

    if (targetShape) return targetShape;
  }
}

// TODO: change to better way
const initPadding = 100;
