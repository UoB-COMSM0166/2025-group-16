/**
 * Generic button with an icon, supporting hover and click interactions
 */
class IconButton {
  /**
   * @param {Object} params - Configuration parameters for the icon button
   * @param {number} [params.x=0] - The x-coordinate of the button's center
   * @param {number} [params.y=0] - The y-coordinate of the button's center
   * @param {Object} [params.iconImg=null] - The icon image to display
   * @param {Function} [params.onClick] - Callback for click events
   */
  constructor(params) {
    this.x = params?.x || 0;
    this.y = params?.y || 0;
    this.iconImg = params?.iconImg || null;
    this.onClick = params?.onClick || null;
    this.wasHovering = false;
  }

  /**
   * Draws the button at the current or specified position
   * @param {number} [x] - New x position.
   * @param {number} [y] - New y position.
   */
  draw(x, y) {
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;

    push();
    this.drawIcon();
    this._handleCursor();
    pop();
  }

  /** Handles mouse press to trigger the onClick callback if hovered */
  mousePressed() {
    if (this._isHovered()) this.onClick();
  }

  /** Draws the icon at the button's position */
  drawIcon() {
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

  /**
   * Checks if the mouse is hovering over the button
   * @returns {boolean} True if the mouse is over the button
   */
  _isHovered() {
    if (!this.iconImg || !this.iconImg.width || !this.iconImg.height) {
      return false;
    }

    const padding = 8;
    return (
      mouseX >= this.x - this.iconImg.width / 2 - padding &&
      mouseX <= this.x + this.iconImg.width / 2 + padding &&
      mouseY >= this.y - this.iconImg.height / 2 - padding &&
      mouseY <= this.y + this.iconImg.height / 2 + padding
    );
  }

  /** Handles cursor changes based on hover state transitions */
  _handleCursor() {
    const isHovering = this._isHovered();
    const isMouseEntering = !this.wasHovering && isHovering;
    const isMouseLeaving = this.wasHovering && !isHovering;
    if (isMouseEntering) {
      cursor('pointer');
    } else if (isMouseLeaving) {
      cursor('default');
    }
    this.wasHovering = isHovering;
  }
}
