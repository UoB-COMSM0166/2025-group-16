/**
 * Represents an audio resource in the game.
 */
class Sound {
  /**
   * Creates a new Sound instance.
   * @param {string} path - The path to the audio file.
   * @param {string[]} [formats=['wav']] - Audio formats to support, e.g. 'mp3', 'wav', 'ogg'
   */
  constructor(path, formats = ['wav']) {
    this.path = path;
    this.sound = null;
    this.formats = formats;
  }

  /**
   * Loads the audio file.
   */
  loadSound() {
    this.sound = loadSound(this.path);
  }
}
