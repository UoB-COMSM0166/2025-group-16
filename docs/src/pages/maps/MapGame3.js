// boundary configuration for game entities
const area = {
  x: 32,
  y: 30,
  width: 1220,
  height: 640,
};

/**
 * Game implementation for Map 3
 * Rule: entities die if they are out of the area
 */
class MapGame3 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 15,
      background: Resources.images.map.game3,
      bgm: Resources.sounds.bgm.playing3,
      robotParams: {
        positionBoundary: area,
        randomPositionPadding: 0,
      },
      playerParams: {
        randomPositionArea: area,
        randomPositionPadding: 0,
      },
    });
  }

  /**
   * Render game with boundary check
   * @override
   */
  draw() {
    super.draw();

    if (this.alivePlayerCtn <= 1) return;

    // check if player is out of area, if so, die
    this.players.forEach((player) => {
      const shape = player.getShape();
      const isOutOfArea = checkOutOfBoundary(
        {
          x: player.x,
          y: player.y,
          width: shape?.scaledWidth || 0,
          height: shape?.scaledHeight || 0,
        },
        area,
      );
      if (isOutOfArea) {
        player.die();
        this.alivePlayerCtn--;
      }
    });
  }
}
