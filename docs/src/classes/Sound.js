/**
 * Represents an audio resource in the game.
 */
class Sound {
  /**
   * @param {string} path - The path to the audio file.
   * @param {string[]} [formats=['wav']] - Audio formats to support, e.g. 'mp3', 'wav', 'ogg'
   */
  constructor(path, formats = ['wav']) {
    this.path = path;
    this.sound = null;
    this.formats = formats;
  }

  /** Loads the audio file */
  loadSound() {
    this.sound = loadSound(this.path);
  }

  /** Plays the sound in a loop */
  loop() {
    if (!this.sound || this.sound.isPlaying()) return;
    this.sound.loop();
  }

  /** Stops the sound */
  stop() {
    if (!this.sound || !this.sound.isPlaying()) return;
    this.sound.stop();
  }

  /** Plays the sound once */
  play(isPlayInPureJs = false) {
    if (isPlayInPureJs) {
      if (!Store.getSpeakerStatus()) return;
      this._playInPureJs();
    } else {
      this.sound.play();
    }
  }

  /** Play audio outside of p5.js */
  _playInPureJs() {
    new Audio(this.path).play().catch((error) => {
      console.error('Playback failed:', error);
      throw error;
    });
  }
}
