/**
 * Toggle button for controlling game audio speaker state
 * Handles visual icon display and audio volume management
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

  /** Initialize button and set initial volume state */
  setup() {
    this._setVolume();
  }

  /**
   * Draw button at current or specified position
   * @param {number} [x] - New x position
   * @param {number} [y] - New y position
   */
  draw(x, y) {
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;

    push();
    this._drawIcon();
    cursor(this._isHovered() ? 'pointer' : 'auto');
    pop();
  }

  /** Handle mouse press for audio initialization or speaker toggle */
  mousePressed() {
    const isSpeakerOn = Store.getSpeakerStatus();
    if (!isSpeakerOn && this.initSound) {
      this._initializeAudio();
    } else if (this._isHovered()) {
      this._toggleSpeaker(!isSpeakerOn);
    }
  }

  /** Handle key press for audio initialization */
  keyPressed() {
    const isSpeakerOn = Store.getSpeakerStatus();
    if (!isSpeakerOn && this.initSound) {
      this._initializeAudio();
    }
  }

  /** Draw speaker icon based on current state */
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

  /** Initialize game audio system */
  _initializeAudio() {
    userStartAudio();
    this.initSound = false;
    this._toggleSpeaker(true);
  }

  /** Toggle speaker state and update volume */
  _toggleSpeaker(isSpeakerOn) {
    Controller.updateSpeakerStatus(isSpeakerOn);
    this._setVolume(isSpeakerOn);
  }

  /** Set audio output volume */
  _setVolume(isSpeakerOn = Store.getSpeakerStatus()) {
    outputVolume(isSpeakerOn ? 1 : 0);
  }

  /** Check if mouse is hovering over button */
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
