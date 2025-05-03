/**
 * Base class for all pages in the game.
 *
 * If you need any other functions not listed here,
 * please add them here and then also to `sketch.js`.
 */
class BasePage {
  /**
   * @param {Img} [params.background] - Image resource.
   * @param {Sound} [params.bgm] - Sound resource.
   * @param {string} [params.shapeType] - ShapeType setting for player.
   * @param {boolean} [params.initSound] - Setting if it's first time loading to the welcome page. Default:false
   */
  constructor(params) {
    this.background = params?.background || null;
    this.bgm = params?.bgm || null;
    this.shapeType = params?.shapeType || Constants.EntityType.ROBOT;

    this.players = [];
    this.speakerIconButton = new SpeakerIconButton({
      initSound: params?.initSound,
    });
  }

  /**
   * Called once when page is initialized.
   * Setup canvas and initialize page elements here.
   * @see https://p5js.org/reference/p5/setup/
   */
  setup() {
    this.speakerIconButton.setup();
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

    this.speakerIconButton.draw(width * 0.05, height * 0.05);
    this.bgm?.loop();
  }

  /**
   * Pause/unpause all entities of specified type
   * @param {Constants.EntityType} type - Entity type to affect
   * @param {boolean} isPaused - Pause state
   */
  setAllEntitiesPaused(type, isPaused) {
    if (type === Constants.EntityType.PLAYER) {
      this.players.forEach((player) => {
        player.isPaused = isPaused;
      });
    }
    if (type === Constants.EntityType.ROBOT) {
      this.robots.forEach((robot) => {
        robot.isPaused = isPaused;
      });
    }
  }

  // Mouse Events
  /**
   * Called when mouse is pressed.
   * @see https://p5js.org/reference/p5/mousePressed/
   */
  mousePressed() {
    this.speakerIconButton.mousePressed();
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
    this.speakerIconButton.keyPressed();
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
