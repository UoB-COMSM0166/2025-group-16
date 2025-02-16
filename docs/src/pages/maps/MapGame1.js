// TODO: check other maps' design to restructure MapGame1 and BaseMapGame
class MapGame1 extends BaseMapGame {
  constructor() {
    super({ robotNumber: 30 });
  }
  //Add MapGame1 to this game.
  draw() {
    if (this.background) {
      image(this.background, 0, 0, width, height);
    }
    super.draw();
  }
}
