/**
 * Toggle button for controlling game audio speaker state
 * Handles visual icon display and audio volume management
 */
class SpeakerIconButton extends IconButton {
  /**
   * @param {Object} params - Configuration parameters for the speaker icon button.
   * @param {number} [params.x=0] - The x-coordinate of the button's center.
   * @param {number} [params.y=0] - The y-coordinate of the button's center.
   * @param {boolean} [params.initSound=false] - Whether this is the first load of the game page, enabling initial audio setup.
   */
  constructor({ x = 0, y = 0, initSound = false }) {
    super({
      x,
      y,
      iconImg: null,
      onClick: () => {
        this._toggleSpeaker();
      },
    });
    this.initSound = initSound;
  }

  /** Initialize button and set initial volume state */
  setup() {
    this._setVolume();
  }

  /**
   * Draw speaker icon based on current state
   * @override
   */
  drawIcon() {
    const isSpeakerOn = Store.getSpeakerStatus();
    this.iconImg =
      Resources.images.common[isSpeakerOn ? 'speakerOn' : 'speakerOff'];
    super.drawIcon();
  }

  /** Handle key press for audio initialization */
  keyPressed() {
    this._tryInitializeAudio();
  }

  /**
   * Handle mouse press for audio initialization or speaker toggle
   * @override
   */
  mousePressed() {
    const isInitializing = this._tryInitializeAudio();
    if (!isInitializing) super.mousePressed();
  }

  /** Initialize game audio system */
  _tryInitializeAudio() {
    const isInitializing = !Store.getSpeakerStatus() && this.initSound;
    if (isInitializing) {
      userStartAudio();
      this.initSound = false;
      this._toggleSpeaker(true);
    }
    return isInitializing;
  }

  /** Toggle speaker state and update volume */
  _toggleSpeaker(isSpeakerOn = !Store.getSpeakerStatus()) {
    Controller.updateSpeakerStatus(isSpeakerOn);
    this._setVolume(isSpeakerOn);
  }

  /** Set audio output volume */
  _setVolume(isSpeakerOn = Store.getSpeakerStatus()) {
    outputVolume(isSpeakerOn ? 1 : 0);
  }
}
