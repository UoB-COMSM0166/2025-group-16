/**
 * A icon button that toggles speaker audio.
 */
class SpeakerIconButton {
  /**
   * @param {Object} params - Configuration parameters for the speaker icon button.
   * @param {number} [params.x=0] - The x-coordinate of the button's center.
   * @param {number} [params.y=0] - The y-coordinate of the button's center.
   * @param {boolean} [params.initSound=false] - Optional. Whether this is the first load of the game page, enabling initial audio setup.
   */
  constructor({ x = 0, y = 0, initSound = false }) {
    this.x = x;
    this.y = y;
    this.initSound = initSound;
    this.iconImg = null; // current speaker icon (on/off)
  }

  // init by setting the initial volume based on speaker status
  setup() {
    this._setVolume();
  }

  draw(x, y) {
    // update position if provided
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;

    push();
    this._drawIcon();
    cursor(this._isHovered() ? 'pointer' : 'auto');
    pop();
  }

  // handles mouse press to toggle speaker or init audio on first load
  mousePressed() {
    const isSpeakerOn = Store.getSpeakerStatus();
    if (!isSpeakerOn && this.initSound) {
      this._initializeAudio();
    } else if (this._isHovered()) {
      this._toggleSpeaker(!isSpeakerOn);
    }
  }

  // handles key press to init audio on first load
  keyPressed() {
    const isSpeakerOn = Store.getSpeakerStatus();
    if (!isSpeakerOn && this.initSound) {
      this._initializeAudio();
    }
  }

  /**
   * Renders the speaker icon based on current speaker status.
   */
  _drawIcon() {
    const isSpeakerOn = Store.getSpeakerStatus();
    this.iconImg =
      Resources.images.welcome[isSpeakerOn ? 'speakerOn' : 'speakerOff'];
    if (!this.iconImg) return;

    imageMode(CENTER);
    image(
      this.iconImg.image,
      this.x,
      this.y,
      this.iconImg.width,
      this.iconImg.height,
    );
  }

  // init game audio, enables sound, and marks initial load as complete
  _initializeAudio() {
    userStartAudio();
    this.initSound = false;
    this._toggleSpeaker(true);
  }

  // updates speaker status and volume
  _toggleSpeaker(isSpeakerOn) {
    Controller.updateSpeakerStatus(isSpeakerOn);
    this._setVolume(isSpeakerOn);
  }

  // sets the p5.js output volume based on speaker status
  _setVolume(isSpeakerOn = Store.getSpeakerStatus()) {
    outputVolume(isSpeakerOn ? 1 : 0);
  }

  _isHovered() {
    if (!this.iconImg || !this.iconImg.width || !this.iconImg.height) {
      return false;
    }

    const { width, height } = this.iconImg;
    const padding = 20;
    return (
      mouseX >= this.x - padding &&
      mouseX <= this.x + width &&
      mouseY >= this.y - padding &&
      mouseY <= this.y + height
    );
  }
}
