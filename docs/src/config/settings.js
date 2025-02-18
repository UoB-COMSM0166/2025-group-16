const Settings = Object.freeze({
  entity: Object.freeze({
    speed: 2,
    frameCtn: 25,
    duration: Object.freeze({
      [Constants.EntityStatus.HIT]: 500,
      [Constants.EntityStatus.COOLDOWN]: 1500,
    }),
    scale: Object.freeze({
      [Constants.EntitySize.S]: 1 / 3,
      [Constants.EntitySize.M]: 2 / 3,
      [Constants.EntitySize.L]: 1,
    }),
  }),
  players: [
    Object.freeze({
      controls: Object.freeze({
        [Constants.Control.LEFT]: { value: 65, name: 'A' },
        [Constants.Control.RIGHT]: { value: 68, name: 'D' },
        [Constants.Control.UP]: { value: 87, name: 'W' },
        [Constants.Control.DOWN]: { value: 83, name: 'S' },
        [Constants.Control.HIT]: { value: 81, name: 'Q' },
      }),
    }),
    Object.freeze({
      controls: Object.freeze({
        [Constants.Control.LEFT]: { value: 37, name: 'Left Arrow' },
        [Constants.Control.RIGHT]: { value: 39, name: 'Right Arrow' },
        [Constants.Control.UP]: { value: 38, name: 'Up Arrow' },
        [Constants.Control.DOWN]: { value: 40, name: 'Down Arrow' },
        [Constants.Control.HIT]: { value: 191, name: '/' },
      }),
    }),
  ],
  canvas: {
    width: 640,
    height: 320,
  },
});
