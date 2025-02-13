const Constants = Object.freeze({
  Game: Object.freeze({
    TITLE: 'Unstoppable',
  }),
  Page: Object.freeze({
    WELCOME: 'WELCOME',
    RESULTS: 'RESULTS',
    MAP_GAME_1: 'MAP_GAME_1',
    MAP_INTRO_1: 'MAP_INTRO_1',
  }),
  Control: Object.freeze({
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    UP: 'UP',
    DOWN: 'DOWN',
    HIT: 'HIT',
  }),
  EntityMove: Object.freeze({
    UP: 'UP',
    DOWN: 'DOWN',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
  }),
  RobotMoveOption: Object.freeze({
    UP: 'UP',
    DOWN: 'DOWN',
    RIGHT: 'RIGHT',
    LEFT: 'LEFT',
    STOP: 'STOP',
    UP_LEFT: 'UP_LEFT',
    UP_RIGHT: 'UP_RIGHT',
    DOWN_LEFT: 'DOWN_LEFT',
    DOWN_RIGHT: 'DOWN_RIGHT',
  }),
  EntityType: Object.freeze({
    PLAYER: 'PLAYER',
    ROBOT: 'ROBOT',
  }),
  EntityStatus: Object.freeze({
    ALIVE: 'ALIVE',
    HIT: 'HIT',
    COOLDOWN: 'COOLDOWN',
    DIED: 'DIED',
  }),
  EntitySize: Object.freeze({
    S: 'S',
    M: 'M',
    L: 'L',
  }),
});
