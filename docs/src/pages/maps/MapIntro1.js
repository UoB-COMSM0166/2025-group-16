class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Desert',
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        return `P${idx + 1}: Move with [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}]\nP${idx + 1}: Punch with [${HIT.name}]`;
      }),
      additionalIntro: '🌵Punch another player🌵',
      hasCountdown: true,
      countdownDuration: 4,
      useFrameCountdown: false,
      gamePage: new MapGame1(),
      gamePageKey: Constants.Page.MAP_GAME_1,
      background: Resources.images.map.game1,
    });
  }
}
