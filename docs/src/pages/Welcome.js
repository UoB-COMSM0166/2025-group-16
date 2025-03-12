class Welcome extends BasePage {
  constructor() {
    super({
      shapeType: Constants.EntityType.PLAYER,
      background: Resources.images.welcome.background,
      bgm: Resources.sounds.bgm.intro,
    });
    // turn on debugMode: not count down 3 sec, show start game button
    this.debugMode = false;
    this.countdown = 3;
    this.isCountingDown = false;
    this.countdownInterval = null;
    this.title = null;
    this.showComeHere = true;
    this.comehere = null;
    this.gameStartArea = null;
    this.startButton = null;
    this.introText = null;
    this.checkiconP1 = null;
    this.checkiconP2 = null;
    this.introBox = { x: 20, y: 350, w: 400, h: 150 };
    this.keyBoardP1 = null;
    this.keyBoardP2 = null;

    this.initTutorialState();
  }

  /** @override */
  setup() {
    super.setup();
    this.title = Resources.images.welcome.title;
    this.comehere = Resources.images.welcome.comehere;
    this.gameStartArea = Resources.images.welcome.gamaStartArea;
    this.gameStartArea.x = width / 2;
    this.gameStartArea.y = height / 2;
    this.checkiconP1 = Resources.images.welcome.checkiconp1;
    this.checkiconP2 = Resources.images.welcome.checkiconp2;
    // init player list status
    this.playerList = new PlayerList({
      label: 'Are you a robot?',
      textSize: Theme.text.fontSize.medium,
      color: Theme.palette.black,
    });

    this.introText = this.createIntroText(this.introBox);
    this.keyBoardP1 = new KeyboardControl({ playerIdx: 0, scale: 3 / 4 });
    this.keyBoardP2 = new KeyboardControl({ playerIdx: 1, scale: 3 / 4 });

    this.startButton = new Button({
      x: width / 2,
      y: (height + this.gameStartArea.height) / 2 + 10,
      width: 300,
      height: 50,
      action: () =>
        Controller.changePage(new MapSelection(), Constants.Page.MAP_SELECTION),
      color: Theme.palette.darkBlue,
      hoverColor: colorHelper.lighter(Theme.palette.darkBlue, 0.5),
      align: [CENTER, TOP],
      textParams: { label: 'Start Game' },
    });

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

    if (this.showTutorialDialog) this.openTutorialDialog();
  }

  /** @override */
  draw() {
    super.draw();

    if (this.title) {
      imageMode(CENTER);
      image(
        this.title.image,
        width / 2,
        height / 2 - 250,
        this.title.width,
        this.title.height,
      );
    }
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

    this.drawComeHere();

    //this.drawIntroStroke(this.introBox);
    //this.introText.p1.draw();
    //this.introText.p2.draw();

    this.keyBoardP1.draw({ x: width / 10, y: height - 80 });
    this.keyBoardP2.draw({ x: (width / 10) * 9, y: height - 80 });

    // draw initialize playerList status
    this.playerList.drawPlayerAvatars();

    // update playerList status
    this.players.forEach((player, idx) => {
      if (this.checkPlayersInStartArea(player)) {
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
          newStatus: 'Are you a robot?',
          textSize: Theme.text.fontSize.medium,
          color: Theme.palette.black,
          isShadow: false,
        });
      }
    });

    if (this.players.every((player) => this.checkPlayersInStartArea(player))) {
      if (this.debugMode) {
        this.startButton?.draw();
      } else {
        this.startCountdown();
      }
    } else {
      this.cancelCountdown();
    }

    this.players.forEach((player) => {
      player.draw();
    });

    this.players.forEach((player, idx) => {
      if (this.checkPlayersInStartArea(player)) {
        const moveDown = 40 * idx;
        this.loadCheckImg(player.color, moveDown);
      }
    });
    this.drawCountdown();

    // draw tutorial dialog
    if (this.showTutorialDialog) this.drawTutorialDialog();
  }

  /** @override */
  keyPressed() {
    super.keyPressed();

    if (this.showTutorialDialog) {
      this.tutorialDialogKeyPressed();
    } else {
      this.players.forEach((player) => {
        player.keyPressed([...this.players], (player) => {
          player.status = Constants.EntityStatus.FAKEDIED;
        });
      });
    }

    // TODO: remove temporary shortcut controls
    if (keyCode === 49) {
      // 1
      Controller.changePage(new MapGame1(), Constants.Page.MAP_GAME_1);
    } else if (keyCode === 50) {
      // 2
      Controller.changePage(new MapGame2(), Constants.Page.MAP_GAME_2);
    } else if (keyCode === 51) {
      // 3
      Controller.changePage(new MapGame3(), Constants.Page.MAP_GAME_3);
    }
  }

  loadCheckImg(color, moveDown = 0) {
    if (color == Theme.palette.player.red) {
      imageMode(CENTER);
      image(
        this.checkiconP1.image,
        width / 2,
        height / 2.5, // upper
        this.checkiconP1.width,
        this.checkiconP1.height,
      );
    } else if (color == Theme.palette.player.blue) {
      imageMode(CENTER);
      image(
        this.checkiconP2.image,
        width / 2,
        height / 2 + moveDown,
        this.checkiconP2.width,
        this.checkiconP2.height,
      );
    }
  }

  checkPlayersInStartArea(player) {
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

  drawIntroStroke(position) {
    push();
    noFill();
    stroke(0);
    strokeWeight(3);
    rect(position.x, position.y, position.w, position.h);
    pop();
  }

  createIntroText(position) {
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

  drawComeHere() {
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

  startCountdown() {
    if (this.isCountingDown) return;
    this.isCountingDown = true;
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 1) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
        Controller.changePage(new MapSelection(), Constants.Page.MAP_SELECTION);
      }
    }, 1000);
  }

  cancelCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
    this.isCountingDown = false;
    this.countdown = 3;
  }

  drawCountdown() {
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

  /* Tutorial Dialog */
  // TODO: add "help" button to open tutorial dialog
  initTutorialState() {
    this.showTutorialDialog =
      localStorage.getItem(Constants.TutorialCompletedKey) !== 'true';
    this.tutorialDialogSelectingIdx = 0;

    this.tutorialDialogTitle = new Text({
      label: 'START TUTORIAL?',
      x: width / 2,
      y: height / 4,
      color: Theme.palette.text.contrastText,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.tutorialDialogOptionYOffset = 36;
    const xOffset = 12;
    this.tutorialDialogOption1 = new Text({
      label: 'YES',
      x: width / 2 - xOffset,
      y: height / 2 - this.tutorialDialogOptionYOffset,
      color: Theme.palette.text.contrastText,
      textSize: Theme.text.fontSize.medium,
      textStyle: BOLD,
      textAlign: [LEFT, CENTER],
      textFont: 'Press Start 2P',
    });
    this.tutorialDialogOption2 = new Text({
      label: 'NO',
      x: width / 2 - xOffset,
      y: height / 2 + this.tutorialDialogOptionYOffset,
      color: Theme.palette.text.contrastText,
      textSize: Theme.text.fontSize.medium,
      textStyle: BOLD,
      textAlign: [LEFT, CENTER],
      textFont: 'Press Start 2P',
    });
    this.tutorialDialogOptionArrow = new Text({
      label: '>',
      x: width / 2 - xOffset * 3,
      color: Theme.palette.yellow,
      textSize: Theme.text.fontSize.medium,
      textStyle: BOLD,
      stroke: Theme.palette.text.contrastText,
      strokeWeight: 4,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  openTutorialDialog() {
    this.players.forEach((player) => {
      player.isPaused = true;
    });
    this.tutorialDialogSelectingIdx = 0;
    this.showTutorialDialog = true;
  }

  closeTutorialDialog() {
    this.players.forEach((player) => {
      player.isPaused = false;
    });
    this.showTutorialDialog = false;
  }

  drawTutorialDialog() {
    push();
    fill(0, 0, 0, 180);
    noStroke();
    rect(0, 0, width, height);
    pop();

    this.tutorialDialogTitle.draw();
    this.tutorialDialogOption1.draw();
    this.tutorialDialogOption2.draw();

    // blink every 0.4 seconds
    if (Math.round(frameCount / (0.4 * Constants.FramePerSecond)) % 2) return;

    this.tutorialDialogOptionArrow.draw({
      y:
        height / 2 +
        this.tutorialDialogOptionYOffset *
          (this.tutorialDialogSelectingIdx ? 1 : -1),
    });
  }

  isPressed(control, keyCode) {
    return Settings.players.some(
      ({ controls }) => controls[control].value === keyCode,
    );
  }

  tutorialDialogKeyPressed() {
    // HIT or Enter to select
    if (this.isPressed('HIT', keyCode) || keyCode === 13) {
      if (this.tutorialDialogSelectingIdx === 0) {
        Controller.changePage(new Tutorial(), Constants.Page.TUTORIAL);
      } else {
        this.closeTutorialDialog();
        localStorage.setItem(Constants.TutorialCompletedKey, 'true');
      }
    }

    if (this.isPressed('UP', keyCode) || this.isPressed('DOWN', keyCode)) {
      this.tutorialDialogSelectingIdx = this.tutorialDialogSelectingIdx ? 0 : 1;
    }
  }
}
