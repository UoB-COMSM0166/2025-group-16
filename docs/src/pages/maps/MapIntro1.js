// TODO: check other maps' design to restructure MapIntro1 and BaseMapIntro
class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Fight!',
      playerControlIntros: [
        'Player 1: Move with [W A S D], attack with [Q]',
        'Player 2: Move with [↑ ← ↓ →], attack with [/]',
      ],
    });
  }
}
