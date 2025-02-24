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

  /** Plays the sound in a loop */
  loop() {
    if (this.sound && !this.sound.isLooping()) {
      this.sound.setLoop(true);
      this.sound.play();
    }
  }

  /** Stops the sound */
  stop() {
    if (this.sound?.isPlaying()) {
      this.sound.stop();
    }
  }
}
