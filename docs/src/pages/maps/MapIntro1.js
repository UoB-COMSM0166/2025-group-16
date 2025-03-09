class MapIntro1 extends BaseMapIntro {
  constructor() {
    super({
      title: 'Find Your Robot!',
      playerControlIntros: [
        '\n' +
          '\n' +
          '1️⃣Find your robot! \n' +
          '2️⃣Hit the other player\n' +
          `3️⃣Hit 💥 USE [${Settings.players[0].controls.HIT.name}] or [${Settings.players[1].controls.HIT.name}] \n`,
      ],
      gamePageKey: Constants.Page.MAP_GAME_1,
      gamePage: new MapGame1(),
    });

    // Refined state management for GIF and countdown
    this.state = {
      countdown: 8,
      gifState: {
        overlayOpacity: 0,
        frameOpacity: 0,
        gifOpacity: 0,
        stage: 'init', // Stages: 'init' -> 'overlay' -> 'frame' -> 'gif'
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

    // Create a static player robot
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

    // Smooth GIF and countdown initialization
    this.initializeGifTransition();
  }

  initializeGifTransition() {
    const { gifState } = this.state;

    // Start the transition sequence
    setTimeout(() => {
      // First, fade in overlay and frame simultaneously
      this.transitionGifStage('overlay');

      // Prepare for GIF appearance
      setTimeout(() => {
        this.transitionGifStage('gif');
        this.startCountdown();
      }, gifState.transitionDuration + 500); // Slight delay after overlay/frame
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
        // Fade in the GIF
        gifState.stage = 'gif';
        gifState.gifOpacity = 255;
        break;
    }
  }

  /** @override */
  draw() {
    // Draw background
    this.drawBackground();

    // Draw player robot
    this.playerRobot.draw();

    // Draw interaction elements
    this.drawInteractionBox();

    // Draw GIF presentation
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

    // Progress bar
    this.drawProgressBar();

    pop();
  }

  drawProgressBar() {
    const { countdown } = this.state;
    if (countdown > 0) {
      let progress = (8 - countdown) / 8;
      let barWidth = 300;
      let barHeight = 30;
      let x = width - barWidth - 20;
      let y = 20;

      // Progress background
      push();
      stroke(255);
      strokeWeight(4);
      noFill();
      rect(x, y, barWidth, barHeight);

      // Progress fill
      noStroke();
      fill(50, 50, 50);
      rect(x, y, barWidth * progress, barHeight);
      pop();
    }
  }

  drawGifPresentation() {
    const { gifState } = this.state;

    // Check if GIF frame should be displayed
    if (gifState.overlayOpacity === 0) return;

    // Overlay and GIF frame parameters
    const gifBoxWidth = 600;
    const gifBoxHeight = 400;
    const rightOffset = 100;
    const gifboxX = width / 2 - gifBoxWidth / 2 + rightOffset;
    const gifBoxY = (height - gifBoxHeight) / 2 - 70;

    // Semi-transparent screen overlay
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

    // Draw GIF if visible
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

  startCountdown() {
    // const { gifState } = this.state;

    // Prevent multiple countdown initializations
    if (this.isCountingDown) return;
    this.isCountingDown = true;

    let interval = setInterval(() => {
      if (this.state.countdown > 1) {
        this.state.countdown--;
      } else {
        clearInterval(interval);
        Controller.changePage(new MapGame1(), Constants.Page.MAP_GAME_1);
      }
    }, 1000);
  }
}
