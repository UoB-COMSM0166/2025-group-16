// TODO: Add GameIntro2
class MapIntro2 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Find Your Robot!',
      playerControlIntros: [
        '\n' +
          '\n' +
          '1️⃣Find your robot! \n' +
          '2️⃣Hit the other player\n' +
          `3️⃣Hit 💥 USE [${Settings.players[0].controls.HIT.name}] or [${Settings.players[1].controls.HIT.name}] \n`,
      ],
      gamePageKey: Constants.Page.MAP_GAME_2,
      gamePage: new MapGame2(),
    });
  }
}
