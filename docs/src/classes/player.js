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
   * @param {keyof typeof Constants.EntitySize} [params.size] - Optional. The size of the player.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   */
  constructor(params) {
    super({
      idx: params.idx,
      type: Constants.EntityType.PLAYER,
      color: params?.color, // TODO: apply different players' color
      size: params?.size,
      position: params?.position,
    });

    this.controls = params.controls;
  }

  /** @override */
  draw() {
    if (this.status === Constants.EntityStatus.DIED) return;

    super.draw();
    Object.values(Constants.EntityMove).forEach((direction) => {
      const key = this.controls[direction]?.value;
      if (keyIsDown(key)) {
        super.move(direction);
      }
    });
  }

  keyPressed(entities, onDie) {
    if (this.status === Constants.EntityStatus.DIED) return;

    // when player press 'hit' while alive (not 'hit' or 'cooldown' status)
    if (
      keyCode === this.controls[Constants.Control.HIT].value &&
      this.status === Constants.EntityStatus.ALIVE
    ) {
      this.status = Constants.EntityStatus.HIT;

      // status change when hit: alive -> hit -> cooldown -> alive
      setTimeout(() => {
        this.status = Constants.EntityStatus.COOLDOWN;

        setTimeout(() => {
          this.status = Constants.EntityStatus.ALIVE;
        }, Settings.entity.duration[Constants.EntityStatus.HIT]);
      }, Settings.entity.duration[Constants.EntityStatus.COOLDOWN]);

      // check if hit any of entities
      for (const entity of entities) {
        const isMe = entity.type === this.type && entity.idx === this.idx;
        if (!isMe) {
          // TODO: check collision more strictly
          const hasCollision = checkCollision(
            this.x,
            this.y,
            this.getShape().width,
            entity.x,
            entity.y,
            entity.getShape().width,
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
