const Constants = Object.freeze({
  Page: Object.freeze({
    HOME: 'HOME',
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
  MoveAction: Object.freeze({
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
});
