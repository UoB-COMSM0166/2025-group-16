/**
 * Base class for all pages in the game.
 *
 * If you need any other functions not listed here,
 * please add them here and then also to `sketch.js`.
 */
class BasePage {
  /**
   * Called once when page is initialized.
   * Setup canvas and initialize page elements here.
   * @see https://p5js.org/reference/p5/setup/
   */
  setup() {}

  /**
   * Called continuously for rendering.
   * Update and draw page elements here.
   * @see https://p5js.org/reference/p5/draw/
   */
  draw() {}

  // Mouse Events
  /**
   * Called when mouse is pressed.
   * @see https://p5js.org/reference/p5/mousePressed/
   */
  mousePressed() {}

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
}
