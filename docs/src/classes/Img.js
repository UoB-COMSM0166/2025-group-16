/**
 * Manage image loading in the game
 * Handle image file loading and storage
 */
class Img {
  /**
   * @param {string} path - Path to the image file
   */
  constructor(path) {
    this.path = path;
    this.image = null; // loaded image object
  }

  /** Load the image */
  loadImage() {
    this.image = loadImage(this.path);
  }
}
