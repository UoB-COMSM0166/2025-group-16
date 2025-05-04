/**
 * Game Introduction implementation for Map 3
 */
class MapIntro3 extends BaseMapIntro {
  constructor() {
    super({
      title: Constants.Map[2].name,
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        const controlText = `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;

        if (idx === 0) {
          return (
            `` + controlText
          );
        }

        return controlText;
      }),
      additionalIntro: '🚨Fence fries you🚨',
      gamePage: new MapGame3(),
      gamePageKey: Constants.Page.MAP_GAME_3,
      background: Resources.images.map.game3,
      bgm: Resources.sounds.bgm.playing3,
    });
  }
}
