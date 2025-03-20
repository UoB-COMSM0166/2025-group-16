class MapIntro3 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Jail',
      // TODO: update description
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        return `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;
      }),
      additionalIntro: '🌵Punch another player🌵',
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame3(),
      gamePageKey: Constants.Page.MAP_GAME_3,
      background: Resources.images.map.game3,
    });
  }
}
