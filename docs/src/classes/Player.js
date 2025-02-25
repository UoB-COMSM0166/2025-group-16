/**
 * Represents a player in the game.
 */
class Player extends Entity {
  /**
   * Creates a new Player instance.
   * @param {Object} params - The parameters for the player.
   * @param {number} params.idx - The index of the player in players.
   * @param {Object} params.controls - The control mappings from `Settings.players[idx].controls`.
   * @param {keyof typeof Constants.EntityType} [params.shapeType] - The shape type of the player, can looks like a robot but is a player actually.
   * @param {typeof Theme.palette.player[keyof typeof Theme.palette.player]} [params.color] - Optional. The color of the player.
   * @param {keyof typeof Constants.EntitySize} [params.size] - Optional. The size of the player.
   * @param {{ x: number, y: number }} [params.position] - Optional. If not provided, will be randomly placed.
   */
  constructor(params) {
    super({
      idx: params.idx,
      type: Constants.EntityType.PLAYER,
      shapeType: params?.shapeType || Constants.EntityType.PLAYER,
      color: params?.color,
      size: params?.size,
      position: params?.position,
      canDie: params?.canDie,
    });

    this.controls = params.controls;
    this.isPaused = false;
  }

  /** @override */
  draw() {
    if (this.status === Constants.EntityStatus.DIED) return;

    super.draw();
    if (!this.isPaused) {
      Object.values(Constants.EntityMove).forEach((direction) => {
        const key = this.controls[direction]?.value;
        if (key !== undefined && keyIsDown(key)) super.move(direction);
      });
    }
  }

  setPauseState(pauseState) {
    this.isPaused = pauseState;
  }

  keyPressed(event, entities, onDie) {
    if (this.status === Constants.EntityStatus.DIED) return;

    const hitControl = this.controls[Constants.Control.HIT];
    // when player press 'hit' while alive (not 'hit' or 'cooldown' status)
    if (
      keyCode === hitControl.value &&
      (hitControl.side === undefined || hitControl.side === event.location) &&
      this.status === Constants.EntityStatus.ALIVE
    ) {
      this.hit(entities, onDie);
    }
  }

  updateParams(params = {}) {
    if (params?.shapeType) {
      this.shapeType = params.shapeType;
    }
    if (params?.color) {
      this.color = params.color;
    }
  }
}
