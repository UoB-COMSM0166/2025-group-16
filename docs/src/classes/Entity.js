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
   * @param {{ x: number, y: number, width: number, height: number }} [params.positionBoundary] - Optional. If provided and no `position`, will be randomly placed within the boundary.
   * @param {{ x: number, y: number, width: number, height: number }} [params.randomPositionArea] - Optional. If provided, the entity will be placed within the area.
   * @param {number} [params.randomPositionPadding] - Optional. If provided, the entity will be placed within the area with a padding.
   * @param {boolean} [params.canDie] - Optional. Setting if the entity would die after hitting. default is true
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

    this.dyingFrameCtn = 0;
    this.positionBoundary = params?.positionBoundary || {
      x: 0,
      y: 0,
      width: Settings.canvas.width,
      height: Settings.canvas.height,
    };

    // sets the initial position
    if (params?.position) {
      this.x = params.position.x;
      this.y = params.position.y;
    } else {
      const initArea = params?.randomPositionArea || this.positionBoundary;
      const initPadding =
        Settings.entity.baseSize.height * Settings.entity.scale[this.size] +
        (params?.randomPositionPadding || 0);
      this.x =
        Math.random() * (initArea.width - initPadding) +
        initArea.x +
        initPadding / 2;
      this.y =
        Math.random() * (initArea.height - initPadding) +
        initArea.y +
        initPadding / 2;
    }
  }

  /**
   * Draws the entity on the canvas
   */
  draw() {
    const { dyingStatus, alpha } = this._checkDyingStatus();
    if (dyingStatus === 'died') return;

    const currShape = this.getShape();
    if (currShape) {
      const { image: img, scaledWidth, scaledHeight } = currShape;
      if (img) {
        push();
        imageMode(CENTER);
        if (dyingStatus === 'dying') tint(255, alpha);
        image(img, this.x, this.y, scaledWidth, scaledHeight);
        pop();
      }
    }
    this.isWalking = false;
  }

  /**
   * Handles the dying animation effect
   * @returns {Object} Animation parameters for the dying effect
   */
  _checkDyingStatus() {
    if (
      this.status !== Constants.EntityStatus.DIED &&
      this.status !== Constants.EntityStatus.FAKEDIED
    )
      return { dyingStatus: 'alive' };

    if (
      this.dyingFrameCtn > Settings.entity.dyingFrameCtn &&
      this.status !== Constants.EntityStatus.FAKEDIED
    )
      return { dyingStatus: 'died' };

    if (
      this.dyingFrameCtn > Settings.entity.dyingFrameCtn &&
      this.status == Constants.EntityStatus.FAKEDIED
    ) {
      this.dyingFrameCtn = 0;
      this.status = Constants.EntityStatus.ALIVE;
      return { dyingStatus: 'alive' };
    }
    this.dyingFrameCtn++;
    return {
      dyingStatus: 'dying',
      alpha: (this.dyingFrameCtn / 10) % 2 ? 150 : 255,
    };
  }

  /**
   * Updates entity position based on movement direction while respecting boundaries
   * @param {keyof typeof Constants.EntityMove} direction - Target movement direction
   * @returns {boolean} True if entity reached a boundary after movement
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
    const { scaledWidth: entityWidth, scaledHeight: entityHeight } = shape;

    const moveActions = {
      [Constants.EntityMove.UP]: () => {
        this.y = Math.max(
          this.y - this.speed,
          this.positionBoundary.y + entityHeight / 2,
        );
      },
      [Constants.EntityMove.DOWN]: () => {
        this.y = Math.min(
          this.y + this.speed,
          this.positionBoundary.y +
            this.positionBoundary.height -
            entityHeight / 2,
        );
      },
      [Constants.EntityMove.LEFT]: () => {
        this.x = Math.max(
          this.x - this.speed,
          this.positionBoundary.x + entityWidth / 2,
        );
      },
      [Constants.EntityMove.RIGHT]: () => {
        this.x = Math.min(
          this.x + this.speed,
          this.positionBoundary.x +
            this.positionBoundary.width -
            entityWidth / 2,
        );
      },
    };

    moveActions[direction]();

    const isAtBoundary = checkOutOfBoundary(
      { x: this.x, y: this.y, width: entityWidth, height: entityHeight },
      this.positionBoundary,
    );
    return isAtBoundary;
  }

  /**
   * Processes collision detection and handles hit effects
   * @param {Entity[]} entities - List of potential collision entities
   * @param {(hitEntity: Entity) => void} onHitEntity - Callback for hit entity processing
   */
  hit(entities, onHitEntity) {
    const hitEntities = this._checkCollisions(entities);
    this._playHitSound(hitEntities, 100); // play sound to sync with hit animation (fist out on 0.1s)
    this._updateHitStatus();
    this._handleHitEntities(hitEntities, onHitEntity);
  }

  _checkCollisions(entities) {
    const hitEntities = {
      [Constants.EntityType.PLAYER]: [],
      [Constants.EntityType.ROBOT]: [],
    };

    entities.forEach((entity) => {
      const isMe = entity.type === this.type && entity.idx === this.idx;
      if (!isMe && entity.status !== Constants.EntityStatus.DIED) {
        if (checkKnockedDown(this, entity)) {
          hitEntities[entity.type].push(entity);
        }
      }
    });

    return hitEntities;
  }

  _playHitSound(hitEntities, delay = 0) {
    setTimeout(() => {
      if (hitEntities[Constants.EntityType.PLAYER].length) {
        Resources.sounds.entity.punch.sound?.play();
      } else if (hitEntities[Constants.EntityType.ROBOT].length) {
        Resources.sounds.entity.dong.sound?.play();
      } else {
        Resources.sounds.entity.whoosh.sound?.play();
      }
    }, delay);
  }

  _updateHitStatus() {
    this.status = Constants.EntityStatus.HIT;
    this.frameCtn = 0; // reset frame count
    setTimeout(() => {
      this.status = Constants.EntityStatus.COOLDOWN;

      setTimeout(() => {
        if (this.status !== Constants.EntityStatus.DIED) {
          this.status = Constants.EntityStatus.ALIVE;
        }
      }, Settings.entity.duration[Constants.EntityStatus.HIT]);
    }, Settings.entity.duration[Constants.EntityStatus.COOLDOWN]);
  }

  _handleHitEntities(hitEntities, onHitEntity) {
    for (const entity of [
      ...hitEntities[Constants.EntityType.PLAYER],
      ...hitEntities[Constants.EntityType.ROBOT],
    ]) {
      entity.die();
      if (onHitEntity) onHitEntity(entity);
    }
  }

  /**
   * Handles death state of the entity.
   * If entity is a player, restores original appearance
   */
  die() {
    if (!this.canDie) return;

    this.status = Constants.EntityStatus.DIED;
    // if entity is player, reset shape and color to showup as player
    if (this.type === Constants.EntityType.PLAYER) {
      this.shapeType = Constants.EntityType.PLAYER;
      this.color = this?.originColor || this.color;
    }
  }

  /*** getShape ***/
  getShape() {
    const aniStatus = this._getAnimationStatus();

    // only allow the attack animation to play once, then keep the last frame
    if (aniStatus === Constants.EntityAnimationStatus.ATTACK) {
      // 0s ~ 0.1s: prepare, 0.1s ~ 0.5s: hit
      this.frameIdx =
        this.frameCtn < (Settings.entity.frameCtn * 1) / 4 ? 0 : 1;
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

  _getAnimationStatus() {
    if (this.status === Constants.EntityStatus.DIED) {
      return Constants.EntityAnimationStatus.IDLE;
    }
    if (this.status === Constants.EntityStatus.HIT) {
      return Constants.EntityAnimationStatus.ATTACK;
    }
    return this.isWalking
      ? Constants.EntityAnimationStatus.WALK
      : Constants.EntityAnimationStatus.IDLE;
  }
}
