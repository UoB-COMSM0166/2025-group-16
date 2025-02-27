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
   * @param {{ x: number, y: number, width: number, height: number }} [params.positionBoundary] - Optional. If provided and no `position`, will be randomly placed within the boundary.
   * @param {{ x: number, y: number, width: number, height: number }} [params.randomPositionArea] - Optional. If provided, the entity will be placed within the area.
   * @param {number} [params.randomPositionPadding] - Optional. If provided, the entity will be placed within the area with a padding.
   */
  constructor(params) {
    const initColor =
      params?.color || Object.values(Theme.palette.player)[params.idx];
    super({
      idx: params.idx,
      type: Constants.EntityType.PLAYER,
      shapeType: params?.shapeType || Constants.EntityType.PLAYER,
      color: initColor,
      size: params?.size,
      position: params?.position,
      canDie: params?.canDie,
      positionBoundary: params?.positionBoundary,
      randomPositionPadding: params?.randomPositionPadding,
      randomPositionArea: params?.randomPositionArea,
    });

    this.controls = params.controls;
    this.isPaused = false;
    this.originColor = initColor;
  }

  /** @override */
  draw() {
    super.draw();

    if (this.status === Constants.EntityStatus.DIED || this.isPaused) return;
    Object.values(Constants.EntityMove).forEach((direction) => {
      const key = this.controls[direction]?.value;
      if (key !== undefined && keyIsDown(key)) super.move(direction);
    });
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
