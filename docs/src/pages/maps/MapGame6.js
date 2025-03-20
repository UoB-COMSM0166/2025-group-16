class MapGame6 extends BaseMapGame {
  constructor() {
    // TODO: change bg & bgm
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 20,
      background: Resources.images.map.game1,
      bgm: Resources.sounds.bgm.playing1,
    });
  }

  // TODO: add map rules
}
