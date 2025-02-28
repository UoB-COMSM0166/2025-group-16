//NOTE: no fight control
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
    this.title = null;
    this.showComeHere = true;
    this.comehere = null;
    this.gameStartArea = null;
    this.startButton = null;
    this.introText = null;
    this.checkiconP1 = null;
    this.checkiconP2 = null;
    this.introBox = { x: 20, y: 350, w: 400, h: 150 };
    this.keyBoard_p1 = null;
    this.keyBoard_p2 = null;
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
    this.areYouARobot = Resources.images.welcome.areYouARobot;
    this.textOkP1 = Resources.images.welcome.textOkP1;
    this.textOkP2 = Resources.images.welcome.textOkP2;
    this.introText = this.createIntroText(this.introBox);
    this.keyBoard_p1 = Resources.images.welcome.keyboardP1;
    this.keyBoard_p2 = Resources.images.welcome.keyboardP2;

    this.startButton = new Button({
      x: width / 2,
      y: (height + this.gameStartArea.height) / 2 + 10,
      width: 300,
      height: 50,
      action: () =>
        Controller.changePage(new MapIntro1(), Constants.Page.MAP_INTRO_1),
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

    // default text status
    let statusImage = new Array(this.players.length).fill(this.areYouARobot);

    if (this.keyBoard_p1) {
      imageMode(CENTER);
      image(
        this.keyBoard_p1.image,
        width / 10,
        height - 80,
        this.keyBoard_p1.width * 1.5,
        this.keyBoard_p1.height * 1.5,
      );
    }

    if (this.keyBoard_p2) {
      imageMode(CENTER);
      image(
        this.keyBoard_p2.image,
        (width / 10) * 9,
        height - 80,
        this.keyBoard_p2.width * 1.5,
        this.keyBoard_p2.height * 1.5,
      );
    }

    this.players.forEach((player, idx) => {
      if (this.checkPlayersInStartArea(player)) {
        statusImage[idx] = idx === 0 ? this.textOkP1 : this.textOkP2;
      }
    });

    if (this.players.every((player) => this.checkPlayersInStartArea(player))) {
      if (this.debugMode) {
        this.startButton?.draw();
      } else {
        this.startCountdown();
      }
    }

    this.drawPlayerAvatars(statusImage);

    this.players.forEach((player) => {
      player.draw();
    });

    this.players.forEach((player, idx) => {
      if (this.checkPlayersInStartArea(player)) {
        const moveDown = 40 * idx;
        this.loadCheckImg(player.color, moveDown);
      }
    });

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

  /** @override */
  keyPressed() {
    super.keyPressed();
    this.players.forEach((player) => {
      player.keyPressed(event, [...this.players]);
    });

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
    let interval = setInterval(() => {
      if (this.countdown > 1) {
        this.countdown--;
      } else {
        clearInterval(interval);
        Controller.changePage(new MapIntro1(), Constants.Page.MAP_INTRO_1);
      }
    }, 1000);
  }
}
