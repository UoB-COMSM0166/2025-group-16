class MapIntro5 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Gym',
      // TODO: update description
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        return `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;
      }),
      additionalIntro: '🌵Punch another player🌵',
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame5(),
      gamePageKey: Constants.Page.MAP_GAME_5,
      background: Resources.images.map.game5,
    });
  }
}
