/**
 * Base class for all pages in the game.
 *
 * If you need any other functions not listed here,
 * please add them here and then also to `sketch.js`.
 */
class BasePage {
  /**
   * @param {Img} [params.background] - Optional. Image resource.
   * @param {Sound} [params.bgm] - Optional. Sound resource.
   * @param {string} [params.shapeType] - Optional. ShapeType setting for player.
   * @param {boolean} [params.initSound] - Optional. Setting if it's first time loading to the welcome page. Default:false
   */
  constructor(params) {
    this.background = params?.background || null;
    this.bgm = params?.bgm || null;
    this.players = [];
    this.shapeType = params?.shapeType || Constants.EntityType.ROBOT;
    this.speakerOnImg = null;
    this.speakerOffImg = null;
    this.initSound = params?.initSound ?? false;
    this.speakerOn = Store.getSpeakerStatus();
  }

  /**
   * Called once when page is initialized.
   * Setup canvas and initialize page elements here.
   * @see https://p5js.org/reference/p5/setup/
   */
  setup() {
    this.speakerOnImg = {
      ...Resources.images.welcome.speakerOn,
      x: width * 0.05,
      y: height * 0.05,
    };
    this.speakerOffImg = {
      ...Resources.images.welcome.speakerOff,
      x: width * 0.05,
      y: height * 0.05,
    };
  }

  /**
   * Called continuously for rendering.
   * Update and draw page elements here.
   * @see https://p5js.org/reference/p5/draw/
   */
  draw() {
    cursor('auto');
    if (this.background) {
      imageMode(CORNER);
      image(this.background.image, 0, 0, width, height);
    }

    if (
      this.isImagePressed(this.speakerOnImg) ||
      this.isImagePressed(this.speakerOffImg)
    ) {
      cursor('pointer');
    }

    if (!this.speakerOn) {
      this.bgm?.stop();
      imageMode(CENTER);
      image(
        this.speakerOffImg.image,
        this.speakerOffImg.x,
        this.speakerOffImg.y,
        this.speakerOffImg.width,
        this.speakerOffImg.height,
      );
    }
    if (this.speakerOn) {
      this.bgm?.loop();
      imageMode(CENTER);
      image(
        this.speakerOnImg.image,
        this.speakerOnImg.x,
        this.speakerOnImg.y,
        this.speakerOnImg.width,
        this.speakerOnImg.height,
      );
    }
  }

  drawPlayerAvatars(statusTextImage) {
    const numPlayers = Object.keys(Resources.images.playerAvatar.ing).length;
    if (numPlayers === 0) return;

    const spacing = width / (numPlayers + 1);

    for (let i = 0; i < numPlayers; i++) {
      const playerAvatar = Resources.images.playerAvatar.ing[i];
      const avatarSize = playerAvatar.width;
      const xPos = spacing * (i + 1) - avatarSize / 2 - 50;
      const yPos = height - avatarSize + 50;

      if (playerAvatar?.image) {
        imageMode(CENTER);
        image(
          playerAvatar.image,
          xPos,
          yPos,
          playerAvatar.width,
          playerAvatar.height,
        );
      }

      const fightXPos = xPos + avatarSize + 80;
      const fightYPos = yPos + avatarSize / 2 - 70;
      const fightImage = statusTextImage?.[i]
        ? statusTextImage[i]
        : Resources.images.playerlist[i]; // TODO: change to fight image
      if (fightImage?.image) {
        imageMode(CENTER);
        image(
          fightImage.image,
          fightXPos,
          fightYPos,
          fightImage.width,
          fightImage.height,
        );
      }
    }
  }

  // Mouse Events
  /**
   * Called when mouse is pressed.
   * @see https://p5js.org/reference/p5/mousePressed/
   */
  mousePressed() {
    if (!this.speakerOn && this.initSound) {
      userStartAudio();
      this.initSound = false;
      this.speakerOn = true;
    } else if (
      this.isImagePressed(this.speakerOnImg) ||
      this.isImagePressed(this.speakerOffImg)
    ) {
      this.bgm?.toggleSound();
      this.speakerOn = !this.speakerOn;
      Controller.updateSpeakerStatus(this.speakerOn);
    }
  }

  /**
   * Called when mouse is released.
   * @see https://p5js.org/reference/p5/mouseReleased/
   */
  mouseReleased() {}

  // Keyboard Events
  /**
   * Called when a key is pressed.
   * @see https://p5js.org/reference/p5/keyPressed/
   */
  keyPressed() {
    if (!this.speakerOn && this.initSound) {
      userStartAudio();
      this.initSound = false;
      this.speakerOn = true;
    }
  }

  /**
   * Called when a key is released.
   * @see https://p5js.org/reference/p5/keyReleased/
   */
  keyReleased() {}

  /**
   * Called when the page is being removed, should clean up resources here.
   */
  remove() {
    this.bgm?.stop();
  }

  isImagePressed(imageObj) {
    if (!imageObj || !imageObj.width || !imageObj.height) return false;

    return (
      mouseX >= imageObj.x - 20 &&
      mouseX <= imageObj.x + imageObj.width &&
      mouseY >= imageObj.y - 20 &&
      mouseY <= imageObj.y + imageObj.height
    );
  }
}
