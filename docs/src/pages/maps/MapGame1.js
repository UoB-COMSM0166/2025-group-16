/**
 * Game implementation for Map 1
 * Rule: no special rules
 */
class MapGame1 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 20,
      background: Resources.images.map.game1,
      bgm: Resources.sounds.bgm.playing1,
    });
  }
}
