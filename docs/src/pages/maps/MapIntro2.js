class MapIntro2 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Grass',
      // TODO: update description
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        const controlText = `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;

        if (idx === 0) {
          return `🤖 Be careful, the robots are\n  here to fight too!\n` + controlText;
        }

        return controlText;
      }),
      additionalIntro: '🌱Punch another player🌱',
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame2(),
      gamePageKey: Constants.Page.MAP_GAME_2,
      background: Resources.images.map.game2,
    });
  }
}
