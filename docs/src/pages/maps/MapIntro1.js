class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: Constants.Map[0].name,
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        return `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;
      }),
      additionalIntro: '🌵Punch another player🌵',
      hasCountdown: true,
      countdownDuration: 4,
      useFrameCountdown: false,
      gamePage: new MapGame1(),
      gamePageKey: Constants.Page.MAP_GAME_1,
      background: Resources.images.map.game1,
      bgm: Resources.sounds.bgm.playing1,
    });
  }
}
