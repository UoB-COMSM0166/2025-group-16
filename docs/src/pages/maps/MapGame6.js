const areaMap6 = {
  x: 121,
  y: 21,
  width: 1024,
  height: 700,
};

class MapGame6 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 10,
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

    this.zoneSize = 100;
    const margin = 50;
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
    this.zoneRotations = this.swapZones.map(() => ({
      angle: 0,
      speed: 0,
      isSpinning: false,
      stopAt: null,
    }));

    this.swapPlayer = null;
    this.swapTargets = [];
    this.enteredAt = null;
    this.swapFlashStart = null;
    this.isPreSwapping = false;
    this.isSwapping = false;
    this.isPostFlashing = false;
    this.postFlashStart = null;
  }

  /** Support custom flashing control */
  drawEntity(entity) {
    if (entity._isFlashing && !entity._shouldDraw) return;
    entity.draw?.();
  }

  /** Main game draw logic */
  draw() {
    super.draw();
    this._handleSwapLogic();
  }

  _inSwapZone(player) {
    return this.swapZones.some(
      (zone) =>
        player.x >= zone.x &&
        player.x <= zone.x + this.zoneSize &&
        player.y >= zone.y &&
        player.y <= zone.y + this.zoneSize,
    );
  }

  /** Start flashing phase before swap */
  _startFlashing() {
    const aliveRobots = this.robots.filter(
      (r) => r.status !== Constants.EntityStatus.DIED,
    );
    if (aliveRobots.length < 3) {
      this._cancelSwap();
      return;
    }

    const selected = [];
    while (selected.length < 3) {
      const r = aliveRobots[Math.floor(Math.random() * aliveRobots.length)];
      if (!selected.includes(r)) selected.push(r);
    }

    this.swapTargets = [this.swapPlayer, ...selected];
    this.swapFlashStart = millis();
    this.isSwapping = true;
    this.isPreSwapping = false;

    this.swapTargets.forEach((e) => {
      e._isFlashing = true;
      e._shouldDraw = true;
      e.isPaused = true;
    });
  }

  /** After flashing phase, perform identity swap */
  _endFlashingAndSwap() {
    this.swapTargets.forEach((e) => {
      delete e._isFlashing;
      delete e._shouldDraw;
    });

    const identities = this.swapTargets.map((e) => ({
      shapeType: e.shapeType,
      color: e.color,
      controls: e instanceof Player ? e.controls : null,
      isPlayer: e instanceof Player,
    }));

    const positions = this.swapTargets.map((e) => ({
      x: e.x,
      y: e.y,
      idx: e.idx,
    }));

    let shuffled;
    do {
      shuffled = identities.slice().sort(() => Math.random() - 0.5);
    } while (shuffled[0].isPlayer);

    this.swapTargets.forEach((e) => {
      if (e instanceof Player) {
        this.players = this.players.filter((p) => p !== e);
      } else {
        this.robots = this.robots.filter((r) => r !== e);
      }
    });

    for (let i = 0; i < shuffled.length; i++) {
      const identity = shuffled[i];
      const pos = positions[i];

      const commonParams = {
        x: pos.x,
        y: pos.y,
        idx: pos.idx,
        shapeType: identity.shapeType,
        color: identity.color,
        size: Constants.EntitySize.M,
        isPaused: false,
      };

      if (identity.isPlayer) {
        const newPlayer = new Player({
          ...commonParams,
          controls: identity.controls,
          canDie: true,
        });
        this.players.push(newPlayer);
        this.swapTargets[i] = newPlayer;
      } else {
        const newRobot = new Robot({ ...commonParams });
        this.robots.push(newRobot);
        this.swapTargets[i] = newRobot;
      }

      //Stop the spinning effect of the magic circle
      this.zoneRotations.forEach((z) => {
        if (z.isSpinning) {
          z.stopAt = millis();
        }
      });
    }

    // Post-flash effect after new entities are created (1 blink)
    this.swapTargets.forEach((e) => {
      e._isFlashing = true;
      e._shouldDraw = true;
    });
    this.postFlashStart = millis();
    this.isSwapping = false;
    this.isPostFlashing = true;
  }

  /** Cancel swap or flashing at any point */
  _cancelSwap() {
    this.swapTargets.forEach((e) => {
      delete e._isFlashing;
      delete e._shouldDraw;
    });

    this.swapZones.forEach((zone, i) => {
      const inZone =
        this.swapPlayer &&
        this.swapPlayer.x >= zone.x &&
        this.swapPlayer.x <= zone.x + this.zoneSize &&
        this.swapPlayer.y >= zone.y &&
        this.swapPlayer.y <= zone.y + this.zoneSize;

      this.zoneRotations.forEach((z) => {
        if (z.isSpinning && z.stopAt === null) {
          z.stopAt = millis();
        }
      });
    });

    this.swapPlayer = null;
    this.swapTargets = [];
    this.enteredAt = null;
    this.swapFlashStart = null;
    this.isPreSwapping = false;
    this.isSwapping = false;
    this.isPostFlashing = false;
    this.postFlashStart = null;
  }

  _drawSwapZones() {
    const magicCircle = Resources.images.mapElements.magicCircle;
    imageMode(CENTER);

    this.swapZones.forEach((zone, index) => {
      const z = this.zoneRotations[index];

      if (z.isSpinning) {
        if (z.stopAt && millis() > z.stopAt) {
          const elapsed = millis() - z.stopAt;
          const decelDuration = 3000; // Deceleration duration
          const t = constrain(elapsed / decelDuration, 0, 1);
          z.speed = lerp(z.speed, 0, t);
          if (t >= 1 || z.speed < 0.001) {
            z.speed = 0;
            z.isSpinning = false;
          }
        }
        z.angle += z.speed;
      }

      push();
      translate(zone.x + this.zoneSize / 2, zone.y + this.zoneSize / 2);
      rotate(z.angle);
      image(magicCircle.image, 0, 0, this.zoneSize, this.zoneSize);
      pop();
    });

    imageMode(CORNER);
  }

  _handleSwapLogic() {
    if (this.isSwapping || this.isPostFlashing) {
      const shouldShow = Math.floor(millis() / 200) % 2 === 0;
      this.swapTargets.forEach((e) => {
        e._shouldDraw = shouldShow;
      });
    }

    if (this.isSwapping) {
      if (!this._inSwapZone(this.swapPlayer)) {
        this._cancelSwap();
        return;
      }

      if (millis() - this.swapFlashStart > 2000) {
        this._endFlashingAndSwap();
      }
      return;
    }

    if (this.isPostFlashing) {
      if (millis() - this.postFlashStart > 200) {
        this.swapTargets.forEach((e) => {
          delete e._isFlashing;
          delete e._shouldDraw;
        });
        this.isPostFlashing = false;
        this.swapTargets = [];
      }
      return;
    }

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
      }
    });
  }

  _preDrawEntities() {
    this._drawSwapZones();
  }
}
