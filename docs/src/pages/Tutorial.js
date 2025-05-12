/**
 * Tutorial page for teaching game mechanics
 * Handles mission progression and player guidance
 */
class Tutorial extends BasePage {
  constructor() {
    super({
      shapeType: Constants.EntityType.PLAYER,
      background: Resources.images.welcome.background,
      bgm: Resources.sounds.bgm.intro,
    });

    this._initMissions();
    this._initGameState();
    this._initUI();
    this._initPlayers();
  }

  /** Initialize tutorial missions with objectives and settings */
  _initMissions() {
    this.missions = [
      {
        title: 'Move to Area',
        inactiveControls: [Constants.Control.HIT],
        targetCtn: 4,
        setupPhase: 0,
      },
      {
        title: 'Hit 2 Times',
        inactiveControls: [
          Constants.Control.UP,
          Constants.Control.DOWN,
          Constants.Control.LEFT,
          Constants.Control.RIGHT,
        ],
        targetCtn: 2,
        setupPhase: 0,
      },
      {
        title: 'Hit Robot',
        inactiveControls: [],
        targetCtn: 1,
        setupPhase: 0,
      },
      {
        title: 'Hit Player',
        inactiveControls: [],
        targetCtn: 1,
        setupPhase: 0,
      },
    ];

    this.targetPositions = [
      [
        [100, 514],
        [100, 260],
        [500, 260],
        [500, 514],
      ],
      [
        [774, 514],
        [774, 260],
        [1184, 260],
        [1184, 514],
      ],
    ];
  }

  /** Initialize tutorial game state variables */
  _initGameState() {
    this.robots = [];

    this.currMissionIdx = 0;
    this.playerMissionProgress = [0, 0];
    this.isMissionsFinished = false;

    this.wallHeight = height;
    this.shineFloorSize = { width: 138, height: 130 };
    this.hasAddedMission4Robots = false;
    this.showFinishHintEndTime = null;

    this.missionTitleAni = {
      fontSize: Theme.text.fontSize.title,
      positionY: 0,
      typingIndex: 0,
      typingSpeed: 10,
      lastTypingTime: 0,
    };
  }

  /** Initialize tutorial UI elements */
  _initUI() {
    this.missionTitle = new Text({
      label: '',
      x: width / 2,
      y: height / 8,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      stroke: Theme.palette.mint,
      strokeWeight: 8,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.progressText = new Text({
      label: '',
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.small,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.finishText = new Text({
      label: 'Finish!',
      x: width / 2,
      y: height / 2,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.title,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.continueHint = new Text({
      label: 'Press Any Key to Continue',
      x: width / 2,
      y: (height / 4) * 3,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.small,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  /** Initialize tutorial players and controls */
  _initPlayers() {
    const playerCtn = Settings.players.length;
    this.playerBoundaries = this._createPlayerBoundaries(playerCtn);
    this.keyboards = this._createKeyboardControls(playerCtn);
  }

  /**
   * Create player boundaries based on player count
   * @param {number} playerCtn - Number of players
   * @returns {Array} Array of boundary objects
   */
  _createPlayerBoundaries(playerCtn) {
    return Array.from({ length: playerCtn }, (_, idx) => ({
      x: (Settings.canvas.width / playerCtn) * idx,
      y: 0,
      width: Settings.canvas.width / playerCtn,
      height: Settings.canvas.height,
    }));
  }

  /**
   * Create keyboard controls for players
   * @param {number} playerCtn - Number of players
   * @returns {Array} Array of KeyboardControl instances
   */
  _createKeyboardControls(playerCtn) {
    return Array.from(
      { length: playerCtn },
      (_, idx) => new KeyboardControl({ playerIdx: idx, scale: 3 / 4 }),
    );
  }

  /**
   * Setup tutorial page
   * @override
   */
  setup() {
    super.setup();
    this.wallHeight = height;
    this._setupPlayers();
    this._resetMissionTitle();
  }

  /** Setup tutorial players */
  _setupPlayers() {
    for (let idx = 0; idx < Settings.players.length; idx++) {
      const player = this._createPlayer(idx);
      this.players.push(player);
    }
  }

  /**
   * Create player instance
   * @param {number} playerIndex - Player index
   * @returns {Player} New player instance
   */
  _createPlayer(playerIndex) {
    const color = this._getPlayerColor(playerIndex);
    const boundary = this.playerBoundaries[playerIndex];

    return new Player({
      idx: playerIndex,
      controls: Settings.players[playerIndex].controls,
      shapeType: this.shapeType,
      size: Constants.EntitySize.M,
      color,
      positionBoundary: boundary,
      position: this._calculatePlayerStartPosition(boundary),
      onHit: () => this._handlePlayerHit(playerIndex),
    });
  }

  /**
   * Get player color based on shape type
   * @param {number} playerIndex - Player index
   * @returns {string} Player color
   */
  _getPlayerColor(playerIndex) {
    return this.shapeType === Constants.EntityType.PLAYER
      ? Object.values(Theme.palette.player)[playerIndex]
      : undefined;
  }

  /**
   * Calculate player start position
   * @param {Object} boundary - Player boundary
   * @returns {Object} Start position coordinates
   */
  _calculatePlayerStartPosition(boundary) {
    return {
      x: boundary.x + boundary.width / 2,
      y: boundary.y + boundary.height / 2,
    };
  }

  /**
   * Handle player hit event
   * @param {number} pIdx - Player index
   */
  _handlePlayerHit(pIdx) {
    if (this.currMissionIdx === 1) {
      this._updateMissionStatus(pIdx, this.playerMissionProgress[pIdx] + 1);
    }
  }

  /**
   * Draw tutorial page
   * @override
   */
  draw() {
    super.draw();
    this._drawGameElements();
    this._checkMissionCompletion();
    this._drawUI();
  }

  /** Draw game elements for current mission */
  _drawGameElements() {
    if (this.wallHeight) this._drawWall(width / 2);
    this._drawCurrMission();
    this._drawRobots();
    this._drawPlayers();
  }

  /** Draw current mission content */
  _drawCurrMission() {
    switch (this.currMissionIdx) {
      case 0:
        this._drawMission1();
        break;
      case 1:
        this._drawMission2();
        break;
      case 2:
        this._drawMission3();
        break;
      case 3:
        this._drawMission4();
        break;
    }
  }

  /** Draw all robots */
  _drawRobots() {
    this.robots.forEach((robot) => {
      robot.draw();
    });
  }

  /** Draw all players with status */
  _drawPlayers() {
    const sortedPlayers = [...this.players];
    sortedPlayers.sort(
      (a, b) =>
        (b.status === Constants.EntityStatus.DIED) -
        (a.status === Constants.EntityStatus.DIED),
    );
    sortedPlayers.forEach((player, idx) => {
      player.draw();
      this._drawStatus(player, idx);
    });
  }

  /** Draw tutorial UI elements */
  _drawUI() {
    if (this.isMissionsFinished) {
      this._drawFinish();
    } else {
      this._drawKeyboards();
      this._updateMissionTitle();
      this.missionTitle.draw();
    }
  }

  /** Draw keyboard controls for players */
  _drawKeyboards() {
    this.players.forEach((_, idx) => {
      const keyboard = this.keyboards[idx];
      const boundary = this.playerBoundaries[idx];
      const position = this._calculateKeyboardPosition(idx, boundary);

      keyboard.draw({
        ...position,
        color: this._getKeyboardControlColors(),
      });
    });
  }

  /**
   * Calculate keyboard position
   * @param {number} playerIndex - Player index
   * @param {Object} boundary - Player boundary
   * @returns {Object} Keyboard position
   */
  _calculateKeyboardPosition(playerIndex, boundary) {
    const isFirstPlayer = playerIndex === 0;
    const x = isFirstPlayer
      ? boundary.x + 111
      : boundary.x + boundary.width - 111;

    return {
      x,
      y: boundary.y + boundary.height - 81,
    };
  }

  /**
   * Get keyboard control colors based on current mission
   * @returns {Object} Control color mapping
   */
  _getKeyboardControlColors() {
    return Object.fromEntries(
      Object.values(Constants.Control).map((control) => {
        let color = 'default';
        const inactiveControls =
          this.missions[this.currMissionIdx].inactiveControls;

        const hasInactiveControls = !!inactiveControls.length;
        if (hasInactiveControls) {
          if (inactiveControls.includes(control)) {
            color = 'inactive';
          } else {
            // blink every 0.5 seconds
            color =
              Math.round(frameCount / (0.5 * Constants.FramePerSecond)) % 2
                ? 'default'
                : 'active';
          }
        }

        return [control, color];
      }),
    );
  }

  /** Check if current mission is completed */
  _checkMissionCompletion() {
    const isCurrentMissionComplete = this.playerMissionProgress.every(
      (progress) => progress >= this.missions[this.currMissionIdx].targetCtn,
    );

    if (isCurrentMissionComplete) this._nextMission();
  }

  /** Update mission title animation */
  _updateMissionTitle() {
    this._updateTypingAni();
    this._updateTitleAni();
    this._updateTextDisplay();
  }

  /** Update typing animation */
  _updateTypingAni() {
    const { message, typingSpeed, lastTypingTime, typingIndex } =
      this.missionTitleAni;

    const shouldUpdateTyping =
      millis() - lastTypingTime > typingSpeed && typingIndex < message.length;

    if (shouldUpdateTyping) {
      this.missionTitleAni.typingIndex++;
      this.missionTitleAni.lastTypingTime = millis();
    }
  }

  /** Update title animation */
  _updateTitleAni() {
    const { message, typingIndex, fontSize, positionY } = this.missionTitleAni;
    const isTypingComplete = typingIndex >= message.length;
    const isAnimating =
      fontSize > Theme.text.fontSize.large || positionY > height / 8;

    if (isTypingComplete && isAnimating) {
      this.missionTitleAni.fontSize = max(
        this.missionTitleAni.fontSize * 0.99,
        Theme.text.fontSize.large,
      );
      this.missionTitleAni.positionY = max(
        this.missionTitleAni.positionY - 10,
        height / 8,
      );
    }
  }

  /** Update text display based on animation state */
  _updateTextDisplay() {
    const { message, typingIndex, fontSize, positionY } = this.missionTitleAni;
    const displayText = message.substring(0, typingIndex);

    this.missionTitle.label = displayText;
    this.missionTitle.x = width / 2;
    this.missionTitle.y = positionY;
    this.missionTitle.textSize = fontSize;
  }

  /** Reset mission title animation */
  _resetMissionTitle() {
    this.missionTitleAni = {
      positionY: height / 2,
      fontSize: Theme.text.fontSize.title,
      typingIndex: 0,
      typingSpeed: 100,
      lastTypingTime: 0,
      message: this.missions[this.currMissionIdx].title,
    };
  }

  /* Mission Methods */

  /** Draw mission 1 (move to area) */
  _drawMission1() {
    this.players.forEach((player, idx) => {
      if (this._isPlayerCompletedCurrMission(idx)) return;

      const targetPosition = this._getTargetPosition(idx);
      this._drawShineFloor(...targetPosition);

      if (this._checkPlayerReachedTarget(player, targetPosition)) {
        this._updateMissionStatus(idx, this.playerMissionProgress[idx] + 1);
      }
    });
  }

  /** Draw mission 2 (hit count) */
  _drawMission2() {
    // hit counting handled by handlePlayerHit
  }

  /** Draw mission 3 (hit robot) */
  _drawMission3() {
    if (this._isInitialSetup(2)) {
      this._addRobotsForMission3();
    } else {
      this._checkRobotDefeats();
    }
  }

  /** Draw mission 4 (hit player) */
  _drawMission4() {
    const currPhase = this.missions[3].setupPhase;
    switch (currPhase) {
      case 0: {
        this.setAllEntitiesPaused(Constants.EntityType.PLAYER, true);
        this.missions[3].setupPhase = 1;
        break;
      }
      case 1:
        this._startWallRemovalAni();
        break;
      case 2:
        this._addRobotsForMission4();
        break;
      case 3:
        this._turnPlayersToRobots();
        break;
      case 4: {
        this.setAllEntitiesPaused(Constants.EntityType.PLAYER, false);
        this.missions[3].setupPhase = 5;
        break;
      }
      case 5:
        this._checkPlayerDefeat();
        break;
    }
  }

  /* Mission Helper Methods */

  /**
   * Check if player completed current mission
   * @param {number} playerIndex - Player index
   * @returns {boolean} True if completed
   */
  _isPlayerCompletedCurrMission(playerIndex) {
    return (
      this.playerMissionProgress[playerIndex] >=
      this.missions[this.currMissionIdx].targetCtn
    );
  }

  /**
   * Get target position for player
   * @param {number} playerIndex - Player index
   * @returns {Array} Target position coordinates
   */
  _getTargetPosition(playerIndex) {
    return this.targetPositions[playerIndex][
      this.playerMissionProgress[playerIndex]
    ];
  }

  /**
   * Check if mission is in initial setup phase
   * @param {number} missionIndex - Mission index
   * @returns {boolean} True if in setup phase
   */
  _isInitialSetup(missionIndex) {
    return this.missions[missionIndex].setupPhase === 0;
  }

  /** Add robots for mission 3 */
  _addRobotsForMission3() {
    this.playerBoundaries.forEach((boundary) => {
      this._addRobot(
        boundary.x + boundary.width / 4,
        boundary.height / 2,
        boundary,
      );
    });
    this.missions[2].setupPhase = 1;
  }

  /** Check robot defeats for mission 3 */
  _checkRobotDefeats() {
    this.players.forEach((_, idx) => {
      if (this.playerMissionProgress[idx] !== 0) return;
      if (this.robots[idx].status === Constants.EntityStatus.DIED) {
        this._updateMissionStatus(idx, this.playerMissionProgress[idx] + 1);
      }
    });
  }

  /** Start wall removal animation */
  _startWallRemovalAni() {
    const aniInterval = 50;
    const intervalId = window.setInterval(() => {
      this.wallHeight--;
      if (this.wallHeight <= 0) {
        this.wallHeight = 0;
        this.missions[3].setupPhase = 2;
        window.clearInterval(intervalId);
      }
    }, aniInterval);
  }

  /** Add robots for mission 4 */
  _addRobotsForMission4() {
    if (this.hasAddedMission4Robots) return;

    this.hasAddedMission4Robots = true;
    this.playerBoundaries.forEach((boundary) => {
      this._addRobotFormation(boundary);
    });

    window.setTimeout(() => {
      this.missions[3].setupPhase = 3;
    }, 300);
  }

  /**
   * Add robot formation in boundary
   * @param {Object} boundary - Boundary area
   */
  _addRobotFormation(boundary) {
    const positions = [
      [1 / 4, 1 / 4],
      [3 / 4, 1 / 4],
      [1 / 4, 3 / 4],
      [3 / 4, 3 / 4],
    ];
    positions.forEach(([xRatio, yRatio]) => {
      this._addRobot(
        boundary.x + boundary.width * xRatio,
        boundary.height * yRatio,
        { x: 0, y: 0, width, height },
      );
    });
  }

  /** Turn players to robots for mission 4 */
  _turnPlayersToRobots() {
    this.players.forEach((player) => {
      player.positionBoundary = { x: 0, y: 0, width, height };
      player.shapeType = Constants.EntityType.ROBOT;
      player.color = Theme.palette.robot.grey;
    });
    this.missions[3].setupPhase = 4;
  }

  /** Check player defeat for mission 4 */
  _checkPlayerDefeat() {
    const isSomeoneHit = this.players.some(
      (player) => player.status === Constants.EntityStatus.DIED,
    );
    if (isSomeoneHit) {
      this.isMissionsFinished = true;
      this.players.forEach((player, idx) => {
        player.shapeType = Constants.EntityType.PLAYER;
        player.color = this._getPlayerColor(idx);
      });
      localStorage.setItem(Constants.TutorialCompletedKey, 'true');
    }
  }

  /** Draw finish screen */
  _drawFinish() {
    this.finishText.draw();
    if (!this.showFinishHintEndTime) {
      this.showFinishHintEndTime = millis() + 1500;
    } else {
      // check is after showFinishHintEndTime and make it flicker
      const timeSinceHint = millis() - this.showFinishHintEndTime;
      if (timeSinceHint > 0 && Math.floor(timeSinceHint / 1000) % 2) {
        this.continueHint?.draw();
      }
    }
  }

  /**
   * Draw player status
   * @param {Player} player - Player instance
   * @param {number} pIdx - Player index
   */
  _drawStatus(player, pIdx) {
    if (this.currMissionIdx !== 3)
      this.progressText.draw({
        label: `${this.playerMissionProgress[pIdx]}/${this.missions[this.currMissionIdx].targetCtn}`,
        x: player.x,
        y: player.y - player.getShape().scaledHeight / 2 - 20,
      });
  }

  /**
   * Update mission status
   * @param {number} playerIdx - Player index
   * @param {number} newCtn - New progress count
   */
  _updateMissionStatus(playerIdx, newCtn) {
    this.playerMissionProgress[playerIdx] = newCtn;
  }

  /** Advance to next mission */
  _nextMission() {
    this.currMissionIdx++;
    this.missionTargetCtn = this.missions[this.currMissionIdx].targetCtn;
    this.playerMissionProgress = this.playerMissionProgress.map(() => 0);
    this._resetMissionTitle();
  }

  /**
   * Draw dividing wall
   * @param {number} x - Wall x position
   */
  _drawWall(x) {
    push();
    const strokeSettings = [
      {
        color: Theme.palette.mint,
        weight: 24,
      },
      {
        color: Theme.palette.darkGrey,
        weight: 12,
      },
    ];
    strokeSettings.forEach(({ color, weight }) => {
      stroke(color);
      strokeWeight(weight);
      line(x, 0, x, this.wallHeight);
    });
    pop();
  }

  /**
   * Draw shine floor indicator
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  _drawShineFloor(x, y) {
    push();
    const singleBlurWidth = 10;
    const blurLayer = 10;
    const blurWidth = singleBlurWidth * blurLayer;
    noStroke();
    fill(colorHelper.alpha(Theme.palette.yellow, 0.2));
    rectMode(CENTER);

    // blink every 0.4 seconds
    if (Math.round(frameCount / (0.4 * Constants.FramePerSecond)) % 2) {
      for (let i = 0; i < blurLayer; i++) {
        rect(
          x,
          y,
          this.shineFloorSize.width - blurWidth + i * singleBlurWidth,
          this.shineFloorSize.height - blurWidth + i * singleBlurWidth,
        );
      }
    }
    rect(x, y, this.shineFloorSize.width, this.shineFloorSize.height);
    pop();
  }

  /**
   * Check if player reached target area
   * @param {Player} player - Player instance
   * @param {Array} area - Target area coordinates
   * @returns {boolean} True if reached
   */
  _checkPlayerReachedTarget(player, area) {
    const playerWidth = player.getShape().scaledWidth;
    const playerHeight = player.getShape().scaledHeight;
    return (
      player.x + playerWidth / 2 > area[0] - this.shineFloorSize.width / 2 &&
      player.y + playerHeight / 2 > area[1] - this.shineFloorSize.height / 2 &&
      player.x - playerWidth / 2 < area[0] + this.shineFloorSize.width / 2 &&
      player.y - playerHeight / 2 < area[1] + this.shineFloorSize.height / 2
    );
  }

  /**
   * Add robot with drop animation
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {Object} positionBoundary - Movement boundary
   */
  _addRobot(x, y, positionBoundary) {
    const aniCtn = 20;
    const aniInterval = 10;
    const dropSpeed = 2;
    const alphaIncrement = 10;

    const newIdx = this.robots.length;
    this.robots.push(
      new Robot({
        ...this.robotParams,
        idx: newIdx,
        size: Constants.EntitySize.M,
        position: { x, y: y - dropSpeed * aniCtn },
        isPaused: true,
        positionBoundary,
      }),
    );
    this.robots[newIdx].alpha = 255 - aniCtn * alphaIncrement;

    const intervalId = window.setInterval(() => {
      this.robots[newIdx].y += dropSpeed;
      this.robots[newIdx].alpha += alphaIncrement;
    }, aniInterval);

    window.setTimeout(() => {
      window.clearInterval(intervalId);
      window.setTimeout(() => {
        this.robots[newIdx].isPaused = false;
      }, 1000);
    }, aniCtn * aniInterval);
  }

  /**
   * Handle key press events
   * @override
   */
  keyPressed() {
    super.keyPressed();

    if (this.isMissionsFinished) {
      if (this.showFinishHintEndTime && millis() > this.showFinishHintEndTime) {
        Controller.changePage(new Welcome(), Constants.Page.WELCOME);
      }
    } else {
      this.players.forEach((player) => {
        player.keyPressed([...this.players, ...this.robots], () => {});
      });
    }
  }
}
