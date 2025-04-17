class MapIntro5 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Gym',
      // TODO: update description
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        const controlText = `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;

        if (idx === 0) {
          return `👊 Punch with the crowd.\n` + controlText;
        }

        return controlText;
      }),
      additionalIntro: '🥊Punch another player🥊',
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame5(),
      gamePageKey: Constants.Page.MAP_GAME_5,
      background: Resources.images.map.game5,
      bgm: Resources.sounds.bgm.playing5,
    });
  }
}
