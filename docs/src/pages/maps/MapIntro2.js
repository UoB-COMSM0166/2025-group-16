// TODO: Add GameIntro2
class MapIntro2 extends BaseMapIntro {
  constructor() {
    super({
      title: ' ',
      playerControlIntros: ['\n' + '\n'],
      hasCountdown: true,
      countdownDuration: 4,
      gamePage: new MapGame2(),
      gamePageKey: Constants.Page.MAP_GAME_2,
    });
    this.background = Resources.images.map.game2;
  }
}
