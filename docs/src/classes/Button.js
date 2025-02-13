/**
 * Represents a button in the game interface.
 */
class Button extends UIComponent {
  /**
   * Creates a new Button instance.
   * @param {Object} params - The parameters for the button.
   * @param {number} params.x - The x-coordinate of the button's position.
   * @param {number} params.y - The y-coordinate of the button's position.
   * @param {number} params.width - The width of the button.
   * @param {number} params.height - The height of the button.
   * @param {string} params.label - The text displayed on the button.
   * @param {Function} params.action - The function to be called when the button is pressed.
   * @param {string} [params.color] - The default color of the button.
   * @param {string} [params.hoverColor] - The color of the button when hovered over.
   * @param {boolean} [params.disabled] - Optional. If true, the button will be disabled.
   * @param {number} [params.fontSize] - Optional. The font size of the label text.
   */
  constructor(params) {
    super({ x: params.x, y: params.y });

    this.width = params?.width || 32;
    this.height = params?.height || 32;
    this.label = params?.label || '';
    this.action = params?.action;
    this.color = params?.color || Theme.palette.darkBlue;
    this.hoverColor =
      params?.hoverColor || colorHelper.lighter(this.color, 0.5);
    this.disabled = params?.disabled || false;
    this.fontSize = params?.fontSize || Theme.text.fontSize.medium;
    this.isHovered = false;
  }

  draw() {
    if (this.disabled) {
      fill(Theme.palette.text.disabled);
    } else {
      this.isHovered = this.isMouseOver();
      fill(this.isHovered ? this.hoverColor : this.color);
    }
    rect(this.x, this.y, this.width, this.height, 10);

    fill(Theme.palette.text.contrastText);
    textSize(this.fontSize);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.width / 2, this.y + this.height / 2);
  }

  isMouseOver() {
    return (
      !this.disabled &&
      mouseX > this.x &&
      mouseX < this.x + this.width &&
      mouseY > this.y &&
      mouseY < this.y + this.height
    );
  }

  mousePressed() {
    if (this.isHovered && !this.disabled) {
      this.action();
    }
  }

  setDisabled(disabled) {
    this.disabled = disabled;
  }
}
