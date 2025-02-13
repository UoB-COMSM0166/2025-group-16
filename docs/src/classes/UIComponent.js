/**
 * Base class for UI components in the game.
 */
class UIComponent {
  /**
   * @param {Object} params - Common parameters for UI components.
   * @param {number} params.x - The x-coordinate of the component.
   * @param {number} params.y - The y-coordinate of the component.
   */
  constructor(params) {
    this.x = params?.x || 0;
    this.y = params?.y || 0;
  }

  /**
   * Draws the component (to be implemented by subclasses).
   */
  draw() {
    throw new Error('draw() must be implemented in subclasses');
  }
}
