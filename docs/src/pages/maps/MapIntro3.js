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
            `🤖 Robots fight back!\n⚡ The fence will fry you!\n` + controlText
          );
        }

        return controlText;
      }),
      additionalIntro: '🚨Punch another player🚨',
      gamePage: new MapGame3(),
      gamePageKey: Constants.Page.MAP_GAME_3,
      background: Resources.images.map.game3,
      bgm: Resources.sounds.bgm.playing3,
    });
  }
}
