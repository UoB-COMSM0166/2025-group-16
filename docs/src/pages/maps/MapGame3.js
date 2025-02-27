const area = {
  x: Settings.canvas.width / 5 / 2,
  y: Settings.canvas.height / 5 / 2,
  width: (Settings.canvas.width / 5) * 4,
  height: (Settings.canvas.height / 5) * 4,
};

class MapGame3 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 15,
      // TODO: change background & bgn
      background: Resources.images.map.game1,
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

    push();
    noFill();
    rect(area.x, area.y, area.width, area.height); // TODO: check area
    pop();

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
