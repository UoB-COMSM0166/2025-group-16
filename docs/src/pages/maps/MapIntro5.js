// TODO: Add GameIntro5
class MapIntro5 extends BaseMapIntro {
  constructor() {
    super({
      title: ' ',
      playerControlIntros: ['\n' + '\n'],
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame5(),
      gamePageKey: Constants.Page.MAP_GAME_5,
    });
    this.background = Resources.images.map.game5;
  }
}
