const Settings = Object.freeze({
  entity: Object.freeze({
    speed: 4,
    frameCtn: 0.4 * Constants.FramePerSecond,
    dyingFrameCtn: 3 * Constants.FramePerSecond,
    duration: Object.freeze({
      [Constants.EntityStatus.HIT]: 500, // 0s ~ 0.1s: prepare, 0.1s~ 0.5s: hit
      [Constants.EntityStatus.COOLDOWN]: 1500, // 0.5s ~ 2s: cooldown
    }),
    scale: Object.freeze({
      [Constants.EntitySize.S]: 1 / 5,
      [Constants.EntitySize.M]: 3 / 5,
      [Constants.EntitySize.L]: 1,
      [Constants.EntitySize.XL]: 2,
    }),
    baseSize: Object.freeze({
      height: 32 * 5,
      width: 28 * 5,
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
        [Constants.Control.LEFT]: { value: 37, name: '←' },
        [Constants.Control.RIGHT]: { value: 39, name: '→' },
        [Constants.Control.UP]: { value: 38, name: '↑' },
        [Constants.Control.DOWN]: { value: 40, name: '↓' },
        [Constants.Control.HIT]: { value: 191, name: '?' },
      }),
    }),
  ],
  canvas: {
    width: 640 * 2,
    height: 360 * 2,
  },
  playerPositions: [
    Object.freeze({
      x: 640 - 300, // (width/2 - 300), but couldn't get canvas.with here (may have better way to do it)
      y: 360,
    }),
    Object.freeze({
      x: 640 + 300, //(width/2 + 300), but couldn't get canvas.with here (may have better way to do it)
      y: 360,
    }),
  ],
});
