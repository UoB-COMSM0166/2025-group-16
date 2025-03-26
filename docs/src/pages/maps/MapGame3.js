const area = {
  x: 64,
  y: 120,
  width: 1144,
  height: 479,
};

class MapGame3 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 15,
      background: Resources.images.map.game3,
      // TODO: change bgn
      bgm: Resources.sounds.bgm.playing1,
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
