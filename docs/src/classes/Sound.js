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
    const speakerOn = Store.getSpeakerStatus();
    if (!this.sound || speakerOn || this.sound.isPlaying()) return;

    this.sound.loop();
    Controller.updateSpeakerStatus(true);
  }

  /** Stops the sound */
  stop() {
    const speakerOn = Store.getSpeakerStatus();
    if (!this.sound || !this.sound.isPlaying() || !speakerOn) return;

    this.sound.stop();
    Controller.updateSpeakerStatus(false);
  }

  toggleSound() {
    const speakerOn = Store.getSpeakerStatus();
    if (speakerOn) {
      this.stop();
    } else {
      this.loop();
    }
  }
}
