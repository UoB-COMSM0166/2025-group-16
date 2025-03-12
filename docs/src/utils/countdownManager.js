/**
 * CountdownManager
 * Manage the countdown function in the game
 * Provide two countdown methods: frame-based countdown and time-based countdown
 */

/**  Create a countdown manager
 * @param {Object} options - Configuration options
 * @param {number} options.duration - Countdown duration (seconds)
 * @param {function} options.onComplete - callback function when countdown is completed
 * @param {function} options.onTick - Callback function for each countdown update
 * @param {boolean} options.useFrameCount - Whether to use frame count for countdown, otherwise use setInterval
 */
class CountdownManager {
  /**
   * Creates a new CountdownManager
   * @param {Object} options - Configuration options
   * @param {number} options.duration - Countdown duration in seconds
   * @param {function} options.onComplete - Callback function when countdown completes
   * @param {function} options.onTick - Callback function for each tick (receives seconds remaining)
   * @param {boolean} options.useFrameCount - If true, uses frame counting instead of setInterval
   */
  constructor(options = {}) {
    this.duration = options.duration || 10; // Default 10 seconds
    this.onComplete = options.onComplete || (() => {});
    this.onTick = options.onTick || (() => {});
    this.useFrameCount = options.useFrameCount || false;

    this.isRunning = false;
    this.secondsRemaining = this.duration;
    this.intervalId = null;
    this.lastFrameCount = 0;
    this.frameInterval = 60; // Assuming 60fps
  }

  /**
   * Start the countdown
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.secondsRemaining = this.duration;

    if (this.useFrameCount) {
      this.lastFrameCount = frameCount;
    } else {
      this.intervalId = setInterval(() => {
        this.tick();
      }, 1000);
    }

    // Initial tick
    this.onTick(this.secondsRemaining);
  }

  /**
   * Stop the countdown
   */
  stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Reset the countdown
   */
  reset() {
    this.stop();
    this.secondsRemaining = this.duration;
    this.onTick(this.secondsRemaining);
  }

  /**
   * Process a single countdown tick
   */
  tick() {
    if (!this.isRunning) return;

    if (this.secondsRemaining > 0) {
      this.secondsRemaining--;
      this.onTick(this.secondsRemaining);
    }

    if (this.secondsRemaining <= 0) {
      this.stop();
      this.onComplete();
    }
  }

  /**
   * Update method to be called in draw() loop when using frame-based countdown
   */
  update() {
    if (!this.isRunning || !this.useFrameCount) return;

    // Check if a second has passed (approx 60 frames at 60fps)
    if (frameCount - this.lastFrameCount >= this.frameInterval) {
      this.lastFrameCount = frameCount;
      this.tick();
    }
  }

  /**
   * Get current countdown progress (0.0 to 1.0)
   * @returns {number} Progress value from 0.0 (complete) to 1.0 (just started)
   */
  getProgress() {
    return this.secondsRemaining / this.duration;
  }

  /**
   * Get seconds remaining
   * @returns {number} Seconds remaining in countdown
   */
  getSecondsRemaining() {
    return this.secondsRemaining;
  }
}
