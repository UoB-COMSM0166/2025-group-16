class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Find Your Robot!',
      playerControlIntros: [
        '\n' +
          '\n' +
          '1️⃣Find your robot! \n' +
          '2️⃣Hit the other player\n' +
          '3️⃣Hit 💥 USE [Q] or [?] \n',
      ],
      hasCountdown: true,
      countdownDuration: 8,
      useFrameCountdown: false,
      gamePage: new MapGame1(),
      gamePageKey: Constants.Page.MAP_GAME_1,
    });

    this.state = {
      gifState: {
        overlayOpacity: 0,
        frameOpacity: 0,
        gifOpacity: 0,
        stage: 'init', 
        startTime: 0,
        delay: 2000,
        transitionDuration: 500, // Smooth transition time
      },
    };

    this.background = Resources.images.map.game1;
    this.playerRobot = null;
    this.demoGif = null;
  }

  /** @override */
  setup() {
    super.setup();

    this.demoGif = loadImage(Resources.images.mapintro1page.demo2.path);

    this.playerRobot = new Player({
      idx: 0,
      controls: {}, // prevent movement
      shapeType: Constants.EntityType.PLAYER,
      size: Constants.EntitySize.XL,
      color: Theme.palette.player.blue,
      position: {
        x: 240,
        y: height - 240,
      },
    });

    this.initializeGifTransition();
  }

  initializeGifTransition() {
    const { gifState } = this.state;

    // Start the transition sequence
    setTimeout(() => {
      this.transitionGifStage('overlay');

      setTimeout(() => {
        this.transitionGifStage('gif');
        this.startCountdown();
      }, gifState.transitionDuration + 500); 
    }, gifState.delay);
  }

  transitionGifStage(stage) {
    const { gifState } = this.state;

    switch (stage) {
      case 'overlay':
        // Simultaneously fade in overlay and frame
        gifState.stage = 'overlay';
        gifState.overlayOpacity = 100;
        gifState.frameOpacity = 245;
        break;

      case 'gif':
        gifState.stage = 'gif';
        gifState.gifOpacity = 255;
        break;
    }
  }

  /** @override */
  draw() {
    
    super.draw();

    this.drawBackground();
    this.playerRobot.draw();
    this.drawInteractionBox();
    this.drawGifPresentation();
  }

  drawBackground() {
    if (this.background?.image) {
      imageMode(CORNER);
      image(this.background.image, 0, 0, width, height);
    } else {
      background(Theme.palette.lightGrey);
    }
  }

  drawInteractionBox() {
    const boxHeight = 150;
    const boxWidth = width - 4;
    const boxX = 2;
    const boxY = height - boxHeight - 3;

    push();
    fill(255, 250, 240);
    stroke(0);
    strokeWeight(2);
    rect(boxX, boxY, boxWidth, boxHeight);

    // Instruction text
    fill(0);
    noStroke();
    textSize(33);
    textAlign(LEFT, CENTER);
    textLeading(38);
    text(this.playerControlIntros[0], boxX + 20, boxY + boxHeight / 2 - 10);

    this.drawProgressBar();

    pop();
  }

  drawGifPresentation() {
    const { gifState } = this.state;

    if (gifState.overlayOpacity === 0) return;

    const gifBoxWidth = 600;
    const gifBoxHeight = 400;
    const rightOffset = 100;
    const gifboxX = width / 2 - gifBoxWidth / 2 + rightOffset;
    const gifBoxY = (height - gifBoxHeight) / 2 - 70;

    push();
    fill(0, 0, 0, gifState.overlayOpacity);
    noStroke();
    rect(0, 0, width, height);
    pop();

    // GIF frame with title
    push();
    fill(255, 255, 255, gifState.frameOpacity);
    stroke(0);
    strokeWeight(3);
    rect(gifboxX, gifBoxY, gifBoxWidth, gifBoxHeight, 15);

    // Title
    fill(0);
    textSize(35);
    textAlign(CENTER, TOP);
    text('DEMO', gifboxX + gifBoxWidth / 2, gifBoxY + 20);

    // Separator line
    stroke(0);
    strokeWeight(2);
    line(gifboxX + 40, gifBoxY + 55, gifboxX + gifBoxWidth - 40, gifBoxY + 55);
    pop();

    if (gifState.stage === 'gif' && this.demoGif) {
      imageMode(CORNER);
      tint(255, gifState.gifOpacity);
      image(
        this.demoGif,
        gifboxX + 25,
        gifBoxY + 65,
        gifBoxWidth - 50,
        gifBoxHeight - 100,
      );
      noTint();
    }
  }
}
