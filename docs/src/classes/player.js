/**
 * Represents a player in the game.
 */
class Player extends Entity {
  /**
   * Creates a new Player instance.
   * @param {Object} params - The parameters for the player.
   * @param {number} params.idx - The index of the player in players.
   * @param {Object} params.controls - The control mappings from `Settings.players[idx].controls`.
   * @param {string} [params.color] - Optional. The color of the player.
   * @param {string} [params.size] - Optional. The size of the player.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   */
  constructor(params) {
    super({
      idx: params.idx,
      type: Constants.EntityType.PLAYER,
      color: params?.color,
      size: params?.size,
      position: params?.position,
    });

    this.originColor = this.color;
    this.originSize = this.size;
    this.controls = params.controls;
  }

  move() {
    if (this.status === Constants.EntityStatus.DIED) return;

    if (keyIsDown(this.controls[Constants.Control.LEFT].value)) {
      this.x = Math.max(this.x - Settings.entity.speed, 0);
    }
    if (keyIsDown(this.controls[Constants.Control.RIGHT].value)) {
      this.x = Math.min(this.x + Settings.entity.speed, width);
    }
    if (keyIsDown(this.controls[Constants.Control.UP].value)) {
      this.y = Math.max(this.y - Settings.entity.speed, 0);
    }
    if (keyIsDown(this.controls[Constants.Control.DOWN].value)) {
      this.y = Math.min(this.y + Settings.entity.speed, height);
    }
  }

  draw() {
    if (this.status === Constants.EntityStatus.DIED) return;

    fill(this.color);
    ellipse(this.x, this.y, this.size, this.size);
  }

  keyPressed(entities, onDie) {
    if (this.status === Constants.EntityStatus.DIED) return;

    if (
      keyCode === this.controls[Constants.Control.HIT].value &&
      this.status !== Constants.EntityStatus.HIT &&
      this.status !== Constants.EntityStatus.COOLDOWN
    ) {
      this.color = Theme.palette.error;
      this.size = Settings.entity.size.hit;
      this.status = Constants.EntityStatus.HIT;

      setTimeout(() => {
        this.color = Theme.palette.warning;
        this.size = this.originSize;
        this.status = Constants.EntityStatus.COOLDOWN;

        setTimeout(() => {
          this.color = this.originColor;
          this.status = Constants.EntityStatus.ALIVE;
        }, Settings.entity.duration[Constants.EntityStatus.HIT]);
      }, Settings.entity.duration[Constants.EntityStatus.COOLDOWN]);

      for (const entity of entities) {
        const isMe = entity.type === this.type && entity.idx === this.idx;
        if (!isMe) {
          const hasCollision = checkCollision(
            this.x,
            this.y,
            Settings.entity.size.hit,
            entity.x,
            entity.y,
            Settings.entity.size.default,
          );
          if (hasCollision) {
            entity.status = Constants.EntityStatus.DIED;
            onDie(entity);
          }
        }
      }
    }
  }
}
