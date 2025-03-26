class MapGame6 extends BaseMapGame {
  constructor() {
    super({
      shapeType: Constants.EntityType.ROBOT,
      robotNumber: 10,
      background: Resources.images.map.game1,
      bgm: Resources.sounds.bgm.playing1,
    });

    const zoneSize = 100;
    const margin = 50;
    this.swapZones = [
      { x: margin, y: margin },
      { x: width - zoneSize - margin, y: margin },
      { x: margin, y: height - zoneSize - margin },
      { x: width - zoneSize - margin, y: height - zoneSize - margin },
    ];

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

    // Draw yellow swap zones
    this.swapZones.forEach((zone) => {
      push();
      noFill();
      stroke(255, 255, 0);
      strokeWeight(3);
      rect(zone.x, zone.y, 100, 100);
      pop();
    });

    // Handle flashing toggle logic
    if (this.isSwapping || this.isPostFlashing) {
      const shouldShow = Math.floor(millis() / 200) % 2 === 0;
      this.swapTargets.forEach((e) => {
        e._shouldDraw = shouldShow;
      });
    }

    // Swap process: in flashing phase
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

    // Post-swap: single flash for effect
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

    // Pre-swap wait logic
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

    // Player enters swap zone detection
    this.players.forEach((player) => {
      if (this._inSwapZone(player)) {
        if (!this.swapPlayer || this.swapPlayer.idx !== player.idx) {
          this.swapPlayer = player;
          this.enteredAt = millis();
          this.isPreSwapping = true;
        }
      } else {
        if (this.swapPlayer && this.swapPlayer.idx === player.idx) {
          this._cancelSwap();
        }
      }
    });
  }

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

    this.swapPlayer = null;
    this.swapTargets = [];
    this.enteredAt = null;
    this.swapFlashStart = null;
    this.isPreSwapping = false;
    this.isSwapping = false;
    this.isPostFlashing = false;
    this.postFlashStart = null;
  }
}
