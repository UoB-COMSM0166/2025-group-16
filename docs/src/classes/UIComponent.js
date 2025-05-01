/**
 * Base component for UI elements
 * Provides common positioning and drawing interface
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
   * Draw UI component
   * @throws {Error} Must be implemented by subclass
   */
  draw() {
    throw new Error('draw() must be implemented in subclasses');
  }
}
