/**
 * Represents a button in the game interface.
 */
class Button {
  /**
   * Creates a new Button instance.
   * @param {Object} params - The parameters for the button.
   * @param {number} params.x - The x-coordinate of the button's position.
   * @param {number} params.y - The y-coordinate of the button's position.
   * @param {number} params.width - The width of the button.
   * @param {number} params.height - The height of the button.
   * @param {string} params.label - The text displayed on the button.
   * @param {Function} params.action - The function to be called when the button is pressed.
   * @param {string} params.color - The default color of the button.
   * @param {string} params.hoverColor - The color of the button when hovered over.
   * @param {boolean} [params.disabled] - Optional. If true, the button will be disabled.
   * @param {number} [params.fontSize] - Optional. The font size of the label text.
   */
  constructor({
    x,
    y,
    width,
    height,
    label,
    action,
    color = Theme.palette.primary,
    hoverColor = colorHelper.lighter(Theme.palette.primary, 0.5),
    disabled = false,
    fontSize = Theme.text.fontSize.medium,
  }) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.action = action;
    this.color = color;
    this.hoverColor = hoverColor;
    this.isHovered = false;
    this.disabled = disabled;
    this.fontSize = fontSize;
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

  mousePressed() {
    if (this.isHovered && !this.disabled) {
      this.action();
    }
  }

  setDisabled(disabled) {
    this.disabled = disabled;
  }
}
