class MapIntro6 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Space',
      // TODO: update description
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        return `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;
      }),
      additionalIntro: '🌵Punch another player🌵',
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame6(),
      gamePageKey: Constants.Page.MAP_GAME_6,
      background: Resources.images.map.game6,
    });
  }
}
