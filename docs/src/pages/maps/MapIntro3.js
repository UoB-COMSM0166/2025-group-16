// TODO: Add GameIntro3
class MapIntro3 extends BaseMapIntro {
  constructor() {
    super({
      title: ' ',
      playerControlIntros: ['\n' + '\n'],
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame3(),
      gamePageKey: Constants.Page.MAP_GAME_3,
    });
    this.background = Resources.images.map.game3;
  }
}
