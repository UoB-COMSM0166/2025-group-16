/**
 * Welcome page for game introduction and player preparation
 * Handles player ready check and game start countdown
 */
class Welcome extends BasePage {
  /**
   * @param {Object} params - Configuration parameters
   * @param {boolean} [params.initSound] - Initial audio setup flag
   */
  constructor(params) {
    super({
      shapeType: Constants.EntityType.PLAYER,
      background: Resources.images.welcome.background,
      bgm: Resources.sounds.bgm.intro,
      initSound: params?.initSound, // init: true, others:false
    });

    // countdown properties
    this.countdown = 3;
    this.isCountingDown = false;
    this.countdownInterval = null;

    // UI elements
    this.title = null;
    this.showComeHere = true;
    this.comehere = null;
    this.gameStartArea = null;
    this.startButton = null;
    this.introText = null;
    this.introBox = { x: 20, y: 350, w: 400, h: 150 };
    this.keyBoardP1 = null;
    this.keyBoardP2 = null;

    // tutorial
    this.tutorialIconButton = new IconButton({
      iconImg: Resources.images.welcome.tutorial,
      onClick: () => {
        this.tutorialDialog.open();
      },
    });
    this.tutorialDialog = new TutorialDialog(this._getDialogParams());

    // target score setting
    this.rulesSettingDialog = new RulesSettingDialog(this._getDialogParams());
  }

  /**
   * Initialize welcome page elements
   * @override
   */
  setup() {
    super.setup();

    // load images
    this.title = Resources.images.welcome.title;
    this.comehere = Resources.images.welcome.comehere;
    this.gameStartArea = Resources.images.welcome.gamaStartArea;
    this.gameStartArea.x = width / 2 - 5;
    this.gameStartArea.y = height / 2 + 20;

    // initialize player list status
    this.playerList = new PlayerList({
      label: 'Ready?',
      textSize: Theme.text.fontSize.medium,
      color: Theme.palette.black,
    });

    // create UI elements
    this.introText = this._createIntroText(this.introBox);
    this.keyBoardP1 = new KeyboardControl({ playerIdx: 0, scale: 3 / 4 });
    this.keyBoardP2 = new KeyboardControl({ playerIdx: 1, scale: 3 / 4 });

    // initialize players
    for (let pIdx = 0; pIdx < Settings.players.length; pIdx++) {
      const createPlayer = {
        ...this.playerParams,
        idx: pIdx,
        controls: Settings.players[pIdx].controls,
        shapeType: this.shapeType,
        size: Constants.EntitySize.M,
        canDie: false,
        position: Settings.playerPositions[pIdx],
      };

      if (this.shapeType == Constants.EntityType.PLAYER) {
        createPlayer.color = Object.values(Theme.palette.player)[pIdx];
      }

      const newPlayer = new Player(createPlayer);
      this.players.push(newPlayer);
    }
  }

  /**
   * Render welcome page
   * @override
   */
  draw() {
    super.draw();

    // draw title
    if (this.title) {
      imageMode(CENTER);
      image(
        this.title.image,
        width / 2,
        height * 0.12,
        this.title.width * 0.9,
        this.title.height * 0.9,
      );
    }

    // draw game start area
    if (this.gameStartArea) {
      imageMode(CENTER);
      image(
        this.gameStartArea.image,
        this.gameStartArea.x,
        this.gameStartArea.y,
        this.gameStartArea.width,
        this.gameStartArea.height,
      );
    }

    this._drawComeHere();
    this.keyBoardP1.draw({ x: width / 10, y: height - 80 });
    this.keyBoardP2.draw({ x: (width / 10) * 9, y: height - 80 });

    // draw initialized playerList status
    this.playerList.draw();

    // update playerList status
    this.players.forEach((player, idx) => {
      // handle countdown logic
      if (this._checkPlayersInStartArea(player)) {
        this.playerList.updateStatus({
          playerIdx: idx,
          newStatus: 'OK',
          textSize: Theme.text.fontSize.large,
          color: Object.values(Theme.palette.player)[idx],
          isShadow: true,
        });
      } else {
        this.playerList.updateStatus({
          playerIdx: idx,
          newStatus: 'Ready?',
          textSize: Theme.text.fontSize.medium,
          color: Theme.palette.black,
          isShadow: false,
        });
      }
    });

    if (this.players.every((player) => this._checkPlayersInStartArea(player))) {
      this._startCountdown();
    } else {
      this._cancelCountdown();
    }

    // draw players and check marks
    this.players.forEach((player) => {
      player.draw();
    });

    this.players.forEach((player, idx) => {
      if (this._checkPlayersInStartArea(player)) {
        const moveDown = 40 * idx;
        this._loadCheckImg(player.color, moveDown);
      }
    });

    // draw tutorial
    this.tutorialIconButton.draw(width * 0.95, height * 0.05);
    this.tutorialDialog.draw();

    // draw countdown and dialogs
    this._drawCountdown();
    this.rulesSettingDialog.draw();
  }

  /**
   * Handle key press events
   * @override
   */
  keyPressed() {
    super.keyPressed();
    this.tutorialDialog.keyPressed();
    this.rulesSettingDialog.keyPressed();
  }

  /**
   * Handle mouse press events
   * @override
   */
  mousePressed() {
    super.mousePressed();
    this.tutorialIconButton.mousePressed();
  }

  /**
   * Load and display check mark image
   * @param {string} color - Player color for check mark
   * @param {number} [moveDown=0] - Vertical offset
   */
  _loadCheckImg(color, moveDown = 0) {
    const resource = Resources.images.welcome.check[color];
    imageMode(CENTER);
    image(
      resource.image,
      width / 2,
      color == Theme.palette.player.red ? height / 2.5 : height / 2 + moveDown,
      resource.width,
      resource.height,
    );
  }

  /**
   * Check if player is in start area
   * @param {Player} player - Player instance
   * @returns {boolean} True if player is in start area
   */
  _checkPlayersInStartArea(player) {
    const areaX = this.gameStartArea.x;
    const areaY = this.gameStartArea.y;
    const areaWidth = this.gameStartArea.width;
    const areaHeight = this.gameStartArea.height;

    const playerWidth = player.width || 28;
    const playerHeight = player.height || 32;

    return (
      player.x > areaX - areaWidth / 2 - playerWidth / 2 &&
      player.x < areaX + areaWidth / 2 + playerWidth / 2 &&
      player.y > areaY - areaHeight / 2 - playerHeight / 2 &&
      player.y < areaY + areaHeight / 2 + playerHeight / 2
    );
  }

  /**
   * Create introduction text elements
   * @param {Object} position - Text box position and size
   * @returns {Object} Text objects for player instructions
   */
  _createIntroText(position) {
    const p1 = new Text({
      x: position.x + 10,
      y: position.y + 30,
      label: 'Player 1: [W A S D] Attack: [Q]',
      textAlign: [LEFT, CENTER],
      textSize: Theme.text.fontSize.small,
      color: Theme.palette.black,
    });
    const p2 = new Text({
      x: position.x + 10,
      y: position.y + 80,
      label: 'Player 2: [↑ ← ↓ →] Attack: [?]',
      textAlign: [LEFT, CENTER],
      textSize: Theme.text.fontSize.small,
      color: Theme.palette.black,
    });

    return { p1, p2 };
  }

  /** Draw animated "come here" indicator */
  _drawComeHere() {
    if (!this.comehere || !this.comehere.image) {
      console.warn('comehere image not loaded!');
      return;
    }

    if (frameCount % 30 == 0) {
      this.showComeHere = !this.showComeHere;
    }

    if (this.showComeHere) {
      imageMode(CENTER);
      image(
        this.comehere.image,
        this.gameStartArea.x,
        this.gameStartArea.y,
        this.comehere.width,
        this.comehere.height,
      );
    }
  }

  /** Start game start countdown */
  _startCountdown() {
    if (this.isCountingDown) return;
    this.isCountingDown = true;
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 1) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
        // when game is going to start, open rules setting dialog
        this.rulesSettingDialog.open();
      }
    }, 1000);
  }

  /** Cancel current countdown */
  _cancelCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.isCountingDown = false;
    this.countdown = 3;
  }

  /** Draw countdown timer */
  _drawCountdown() {
    if (this.isCountingDown && this.countdown > 0) {
      const timerText = new Text({
        label: this.countdown.toString(),
        textSize: Theme.text.fontSize.title,
        textAlign: [CENTER, CENTER],
        color: Theme.palette.text.contrastText,
        stroke: Theme.palette.text.contrastText,
        strokeWeight: 3,
        x: width / 2,
        y: height / 2,
      });

      timerText.draw();
    }
  }

  /**
   * Get common dialog parameters
   * @returns {Object} Dialog configuration
   */
  _getDialogParams() {
    return {
      onOpen: () => {
        this.setAllEntitiesPaused(Constants.EntityType.PLAYER, true);
      },
      onClose: () => {
        this.setAllEntitiesPaused(Constants.EntityType.PLAYER, false);
      },
    };
  }
}
