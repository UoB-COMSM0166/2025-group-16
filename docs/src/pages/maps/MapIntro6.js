// TODO: Add GameIntro6
class MapIntro6 extends BaseMapIntro {
  constructor() {
    super({
      title: ' ',
      playerControlIntros: ['\n' + '\n'],
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame6(),
      gamePageKey: Constants.Page.MAP_GAME_6,
    });
    this.background = Resources.images.map.game6;
  }
}
