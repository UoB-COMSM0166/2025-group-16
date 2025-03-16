/**
 * Base class for all pages in the game.
 *
 * If you need any other functions not listed here,
 * please add them here and then also to `sketch.js`.
 */
class BasePage {
  constructor(params) {
    this.background = params?.background || null;
    this.bgm = params?.bgm || null;
    this.players = [];
    this.shapeType = params?.shapeType || Constants.EntityType.ROBOT;
    this.speakerOn = null;
    this.speakerOff = null;
    this.turnOnSpeaker = params?.turnOnSpeaker ?? true;
    this.initSound = params?.initSound ?? false;
  }

  /**
   * Called once when page is initialized.
   * Setup canvas and initialize page elements here.
   * @see https://p5js.org/reference/p5/setup/
   */
  setup() {
    this.bgm?.loop();
    this.speakerOn = {
      ...Resources.images.welcome.speakerOn,
      x: width * 0.05,
      y: height * 0.05,
    };
    this.speakerOff = {
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
    if (this.background) {
      imageMode(CORNER);
      image(this.background.image, 0, 0, width, height);
    }

    if (!this.turnOnSpeaker) {
      imageMode(CENTER);
      image(
        this.speakerOff.image,
        this.speakerOff.x,
        this.speakerOff.y,
        this.speakerOff.width,
        this.speakerOff.height,
      );
    }
    if (this.turnOnSpeaker) {
      imageMode(CENTER);
      image(
        this.speakerOn.image,
        this.speakerOn.x,
        this.speakerOn.y,
        this.speakerOn.width,
        this.speakerOn.height,
      );
    }
  }

  drawPlayerAvatars(statusTextImage) {
    let numPlayers = Object.keys(Resources.images.playerlist).length;
    if (numPlayers === 0) return;

    let spacing = width / (numPlayers + 1);

    for (let i = 0; i < numPlayers; i++) {
      let playerAvatar = Resources.images.playerlist[i];
      let avatarSize = playerAvatar.width;
      let xPos = spacing * (i + 1) - avatarSize / 2 - 50;
      let yPos = height - avatarSize + 50;

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

      let fightXPos = xPos + avatarSize + 80;
      let fightYPos = yPos + avatarSize / 2 - 70;
      let fightImage = statusTextImage?.[i]
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
    if (!this.turnOnSpeaker && this.initSound) {
      userStartAudio();
      this.initSound = false;
      this.turnOnSpeaker = true;
    }

    if (this.turnOnSpeaker && this.isImagePressed(this.speakerOn)) {
      this.bgm.sound.stop();
      this.turnOnSpeaker = false;
    } else if (!this.turnOnSpeaker && this.isImagePressed(this.speakerOff)) {
      this.bgm.loop();
      this.turnOnSpeaker = true;
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
  keyPressed() {}

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
    return (
      mouseX >= imageObj.x - 20 &&
      mouseX <= imageObj.x + imageObj.width &&
      mouseY >= imageObj.y - 20 &&
      mouseY <= imageObj.y + imageObj.height
    );
  }
}
