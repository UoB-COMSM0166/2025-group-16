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
    this.playerAvatars = [];
    this.statusTextImages = [];
    this.shapeType = params?.shapeType || Constants.EntityType.ROBOT;
  }

  initBgm() {
    this.bgm?.loop();
  }

  /**
   * Called once when page is initialized.
   * Setup canvas and initialize page elements here.
   * @see https://p5js.org/reference/p5/setup/
   */
  setup() {
    if (Store.getIsAllowSound()) this.initBgm();

    for (let pIdx = 0; pIdx < Settings.players.length; pIdx++) {
      const createPlayer = {
        ...this.playerParams,
        idx: pIdx,
        controls: Settings.players[pIdx].controls,
        shapeType: this.shapeType,
        size: Constants.EntitySize.M,
      };

      if (this.shapeType == Constants.EntityType.PLAYER) {
        createPlayer.color = Object.values(Theme.palette.player)[pIdx];
      }

      const newPlayer = new Player(createPlayer);
      this.players.push(newPlayer);

      this.playerAvatars.push(Resources.images.playerlist[pIdx]);
      this.statusTextImages.push(Resources.images.playerlist[pIdx]);
    }
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
    if (!Store.getIsAllowSound()) {
      Controller.changeIsAllowSound(true);
      this.initBgm();
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
    if (!Store.getIsAllowSound()) {
      Controller.changeIsAllowSound(true);
      this.initBgm();
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
}
