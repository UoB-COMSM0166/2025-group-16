class MapIntro4 extends BaseMapIntro {
  constructor() {
    super({
      title: Constants.Map[3].name,
      playerControlIntros: Settings.players.map(({ controls }, idx) => {
        const { UP, LEFT, DOWN, RIGHT, HIT } = controls;
        const controlText = `P${idx + 1}: Move [${UP.name} ${LEFT.name} ${DOWN.name} ${RIGHT.name}], Punch [${HIT.name}]`;

        if (idx === 0) {
          return (
            `Follow the arrows on the wall\n🔼and move with them!!\n` +
            controlText
          );
        }

        return controlText;
      }),
      additionalIntro: '🌵Punch another player🌵',
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame4(),
      gamePageKey: Constants.Page.MAP_GAME_4,
      background: Resources.images.map.game4,
      bgm: Resources.sounds.bgm.playing4,
    });
  }
}
