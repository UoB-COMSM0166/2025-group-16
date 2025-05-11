// boundary configuration for game entities
const areaMap6 = {
  x: 121,
  y: 21,
  width: 1024,
  height: 700,
};

/**
 * Generate random position within specified area
 * @param {Object} area - Boundary area {x, y, width, height}
 * @param {number} [padding=0] - Inner padding from boundaries
 * @returns {Object} Random position {x, y}
 */
function getRandomPositionIn(area, padding = 0) {
  return {
    x:
      Math.floor(Math.random() * (area.width - 2 * padding)) + area.x + padding,
    y:
      Math.floor(Math.random() * (area.height - 2 * padding)) +
      area.y +
      padding,
  };
}

/**
 * Game implementation for Map 6
 * Rule: player can swap with robots within magical swap zones
 */
class MapGame6 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 25,
      background: Resources.images.map.game6,
      bgm: Resources.sounds.bgm.playing6,
      robotParams: {
        randomPositionArea: areaMap6,
        randomPositionPadding: 0,
        positionBoundary: areaMap6,
      },
      playerParams: {
        randomPositionArea: areaMap6,
        randomPositionPadding: 0,
        positionBoundary: areaMap6,
      },
    });

    // swap zone configuration
    this.zoneSize = 100;
    this.swapZones = [
      {
        x: 150,
        y: height / 2 - this.zoneSize / 2,
      },
      {
        x: width - 150 - this.zoneSize,
        y: height / 2 - this.zoneSize / 2,
      },
    ];

    // zone animation states
    this.zoneRotations = this.swapZones.map(() => ({
      angle: 0,
      speed: 0,
      isSpinning: false,
      stopAt: null,
    }));

    // swap state management
    this.swapPlayer = null;
    this.swapTargets = [];
    this.enteredAt = null;
    this.swapFlashStart = null;
    this.isPreSwapping = false;
    this.isSwapping = false;
    this.isPostFlashing = false;
    this.postFlashStart = null;

    this.isSoundPlaying = false;
  }

  /**
   * Custom entity drawing with flash effect support
   * @override
   */
  drawEntity(entity) {
    if (entity._isFlashing && !entity._shouldDraw) return;
    entity.draw?.();
  }

  /**
   * Main game loop with swap zone logic
   * @override
   */
  draw() {
    super.draw();

    // handle flashing toggle logic
    if (this.isSwapping || this.isPostFlashing) {
      const shouldShow = Math.floor(millis() / 200) % 2 === 0;
      this.swapTargets.forEach((e) => {
        e._shouldDraw = shouldShow;
      });
    }

    // swap process: in flashing phase
    if (this.isSwapping) {
      if (!this._inSwapZone(this.swapPlayer)) {
        this._cancelSwap();
        return;
      }

      const elapsed = millis() - this.swapFlashStart;
      if (elapsed > 2000) {
        this._endFlashingAndSwap();
      }
      return;
    }

    // post-swap: single flash for effect
    if (this.isPostFlashing) {
      const elapsed = millis() - this.postFlashStart;
      if (elapsed > 200) {
        this.swapTargets.forEach((e) => {
          delete e._isFlashing;
          delete e._shouldDraw;
        });
        this.isPostFlashing = false;
        this.swapTargets = [];
      }
      return;
    }

    // pre-swap wait logic
    if (this.isPreSwapping) {
      if (!this._inSwapZone(this.swapPlayer)) {
        this._cancelSwap();
        return;
      }

      if (millis() - this.enteredAt >= 1000) {
        this._startFlashing();
      }
      return;
    }

    // player enters swap zone detection
    this.players.forEach((player) => {
      if (this._inSwapZone(player)) {
        if (!this.swapPlayer || this.swapPlayer.idx !== player.idx) {
          this.swapPlayer = player;
          this.enteredAt = millis();
          this.isPreSwapping = true;
          this._startSwapZoneSpin();
        }
      } else {
        if (this.swapPlayer && this.swapPlayer.idx === player.idx) {
          this._cancelSwap();
        }
      }
    });
  }

  /**
   * Check if entity is within any swap zone
   * @param {Entity} entity - Entity to check
   * @returns {boolean} True if in swap zone
   */
  _inSwapZone(player) {
    return this.swapZones.some(
      (zone) =>
        player.x >= zone.x &&
        player.x <= zone.x + 100 &&
        player.y >= zone.y &&
        player.y <= zone.y + 100,
    );
  }

  /** Start flashing phase before swap */
  _endFlashingAndSwap() {
    this.swapTargets.forEach((e) => {
      delete e._isFlashing;
      delete e._shouldDraw;
    });

    const positions = this.swapTargets.map(() => getRandomPositionIn(areaMap6));

    for (let i = 0; i < this.swapTargets.length; i++) {
      const entity = this.swapTargets[i];
      const newPos = positions[i];
      entity.x = newPos.x;
      entity.y = newPos.y;
      entity.isPaused = false;
    }

    this.swapTargets.forEach((e) => {
      e._isFlashing = true;
      e._shouldDraw = true;
    });

    this.postFlashStart = millis();
    this.isSwapping = false;
    this.isPostFlashing = true;

    this.zoneRotations.forEach((z) => {
      if (z.isSpinning) {
        z.stopAt = millis();
      }
    });

    this.isSoundPlaying = false;
  }

  /** Cancel swap or flashing at any point */
  _cancelSwap() {
    this.swapTargets.forEach((e) => {
      delete e._isFlashing;
      delete e._shouldDraw;
    });
    // if canceling swap, reset the spinning state
    this.zoneRotations.forEach((z) => {
      if (z.isSpinning && z.stopAt === null) {
        z.stopAt = millis();
      }
    });

    if (this.isSoundPlaying) {
      if (this.isSoundPlaying) {
        Resources.sounds.soundEffect.swap.stop();
        this.isSoundPlaying = false;
      }
    }

    this.swapPlayer = null;
    this.swapTargets = [];
    this.enteredAt = null;
    this.swapFlashStart = null;
    this.isPreSwapping = false;
    this.isSwapping = false;
    this.isPostFlashing = false;
    this.postFlashStart = null;
  }

  /**
   * Draw swap zones with rotation effects
   * @override
   */
  preDrawEntities() {
    this._drawSwapZones();
  }

  /** Render animated swap zones */
  _drawSwapZones() {
    // get the magic circle image
    const magicCircle = Resources.images.mapElements.magicCircle;
    imageMode(CENTER);

    // draw each swap zone
    this.swapZones.forEach((zone, index) => {
      const z = this.zoneRotations[index];

      // handle spinning animation
      if (z.isSpinning) {
        // apply slow-down effect if stopping
        if (z.stopAt !== null) {
          const elapsed = millis() - z.stopAt;
          const decelDuration = 3000; // 3 second slowdown
          const t = constrain(elapsed / decelDuration, 0, 1);
          z.speed = lerp(z.speed, 0, t); // gradually reduce speed

          // stop completely when slowed enough
          if (t >= 1 || z.speed < 0.001) {
            z.speed = 0;
            z.isSpinning = false;
            z.stopAt = null;
          }
        }
        z.angle += z.speed; // update rotation
      }

      // draw the spinning zone
      push();
      translate(zone.x + this.zoneSize / 2, zone.y + this.zoneSize / 2);
      rotate(z.angle);
      image(magicCircle.image, 0, 0, this.zoneSize, this.zoneSize);
      pop();
    });

    imageMode(CORNER); // reset drawing mode
  }

  /** Start spinning animation for active swap zone */
  _startSwapZoneSpin() {
    this.swapZones.forEach((zone, i) => {
      const inZone =
        this.swapPlayer.x >= zone.x &&
        this.swapPlayer.x <= zone.x + this.zoneSize &&
        this.swapPlayer.y >= zone.y &&
        this.swapPlayer.y <= zone.y + this.zoneSize;

      if (inZone) {
        const totalDuration = 3200;
        const spinRounds = 0.8;
        const totalAngle = spinRounds * TWO_PI;
        const spinSpeed = totalAngle * (3000 / totalDuration);

        this.zoneRotations[i] = {
          angle: 0,
          speed: spinSpeed / 60,
          isSpinning: true,
          stopAt: null,
        };

        // check is it playing?
        if (!this.isSoundPlaying) {
          Resources.sounds.soundEffect.swap.loop = true;
          Resources.sounds.soundEffect.swap.play();
          this.isSoundPlaying = true;
        }
      }
    });
  }

  /** Starts the flash effect before swapping positions */
  _startFlashing() {
    // get living robots
    const aliveRobots = this.robots.filter(
      (r) => r.status !== Constants.EntityStatus.DIED,
    );

    // need at least 3 robots to swap
    if (aliveRobots.length < 3) {
      this._cancelSwap();
      return;
    }

    // pick 3 random robots
    const selected = [];
    while (selected.length < 3) {
      const r = aliveRobots[Math.floor(Math.random() * aliveRobots.length)];
      if (!selected.includes(r)) selected.push(r);
    }

    // start flash effect
    this.swapTargets = [this.swapPlayer, ...selected];
    this.swapFlashStart = millis();
    this.isSwapping = true;
    this.isPreSwapping = false;

    // make targets flash and freeze
    this.swapTargets.forEach((e) => {
      e._isFlashing = true;
      e._shouldDraw = true;
      e.isPaused = true;
    });
  }
}
