class MapIntro6 extends BaseMapIntro {
  constructor() {
    super({
      title: Constants.Map[5].name,
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        const controlText = `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;

        if (idx === 0) {
          return `🪄 Enter the circle, vanish\n  like magic!\n` + controlText;
        }

        return controlText;
      }),
      additionalIntro: '🔮Punch another player🔮',
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame6(),
      gamePageKey: Constants.Page.MAP_GAME_6,
      background: Resources.images.map.game6,
      bgm: Resources.sounds.bgm.playing6,
    });
  }
}
