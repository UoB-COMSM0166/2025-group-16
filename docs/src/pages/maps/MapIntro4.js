// TODO: Add GameIntro4
class MapIntro4 extends BaseMapIntro {
  constructor() {
    super({
      title: ' ',
      playerControlIntros: ['\n' + '\n'],
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame4(),
      gamePageKey: Constants.Page.MAP_GAME_4,
    });
    this.background = Resources.images.map.game4;
  }
}
