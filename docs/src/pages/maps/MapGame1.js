// TODO: check other maps' design to restructure MapGame1 and BaseMapGame
class MapGame1 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 20,
      background: Resources.images.map.game1,
    });
  }

  // Add MapGame1 to this game.
  draw() {
    super.draw();
  }
}
