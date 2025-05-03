/**
 * Manage a player entity in the game
 * Handle player controls, movement, and interactions
 */
class Player extends Entity {
  /**
   * Creates a new Player instance.
   * @param {Object} params - The parameters for the player.
   * @param {number} params.idx - The index of the player in players.
   * @param {Object} params.controls - The control mappings from `Settings.players[idx].controls`.
   * @param {keyof typeof Constants.EntityType} [params.shapeType] - The shape type of the player, can looks like a robot but is a player actually.
   * @param {typeof Theme.palette.player[keyof typeof Theme.palette.player]} [params.color] - The color of the player.
   * @param {keyof typeof Constants.EntitySize} [params.size] - The size of the player.
   * @param {{ x: number, y: number }} [params.position] - If not provided, will be randomly placed.
   * @param {{ x: number, y: number, width: number, height: number }} [params.positionBoundary] - If provided and no `position`, will be randomly placed within the boundary.
   * @param {{ x: number, y: number, width: number, height: number }} [params.randomPositionArea] - If provided, the entity will be placed within the area.
   * @param {number} [params.randomPositionPadding] - If provided, the entity will be placed within the area with a padding.
   * @param {Function} [params.onHit] - Callback function when player hit.
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

    this.controls = params.controls; // player-specific control mappings
    this.isPaused = params?.isPaused || false; // pause state
    this.originColor = initColor; // original color for reset
    this.onHit = params?.onHit; // hit callback
    this.hasCooldownEffect = false; // cooldown effect flag
  }

  /**
   * Draw player and handle movement
   * @override
   */
  draw() {
    super.draw();

    if (this.status === Constants.EntityStatus.DIED || this.isPaused) return;
    Object.values(Constants.EntityMove).forEach((direction) => {
      const key = this.controls[direction]?.value;
      if (key !== undefined && keyIsDown(key)) super.move(direction);
    });
  }

  /**
   * Handle key press events for player actions
   * @param {Entity[]} entities - List of entities to check for hits
   * @param {Function} onDie - Callback when an entity dies
   */
  keyPressed(entities, onDie) {
    if (this.status === Constants.EntityStatus.DIED) return;
    if (this.isPaused) return;

    // when player press 'hit' while alive (not 'hit' or 'cooldown' status)
    const hitControl = this.controls[Constants.Control.HIT];
    if (
      keyCode === hitControl.value &&
      this.status === Constants.EntityStatus.ALIVE
    ) {
      // trigger hit action
      if (this.onHit) this.onHit();
      this.hit(entities, onDie);
    }
  }

  /**
   * Update player parameters
   * @param {Object} [params] - Parameters to update
   * @param {keyof typeof Constants.EntityType} [params.shapeType] - New shape type
   * @param {typeof Theme.palette.player[keyof typeof Theme.palette.player]} [params.color] - New color
   */
  updateParams(params = {}) {
    if (params?.shapeType) {
      this.shapeType = params.shapeType;
    }
    if (params?.color) {
      this.color = params.color;
    }
  }
}
