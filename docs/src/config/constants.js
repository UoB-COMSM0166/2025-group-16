const Constants = Object.freeze({
  Game: Object.freeze({
    TITLE: 'Unspottable',
  }),
  Page: Object.freeze({
    WELCOME: 'WELCOME',
    RESULTS: 'RESULTS',
    MAP_BASIC_INTRO: 'MAP_BASIC_INTRO',
    MAP_BASIC_GAME: 'MAP_BASIC_GAME',
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
