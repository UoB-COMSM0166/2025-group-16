// TODO: Add GameIntro4
class MapIntro4 extends BaseMapIntro {
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
      gamePageKey: Constants.Page.MAP_GAME_4,
      gamePage: new MapGame4(),
    });
  }
}
