class Img {
  /**
   * @param {string} path - The path to the SVG file.
   */
  constructor(path) {
    this.path = path;
    this.image = null;
  }

  loadImage() {
    this.image = loadImage(this.path);
  }
}
