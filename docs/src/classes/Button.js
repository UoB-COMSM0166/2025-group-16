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
   * @param {Function} params.action - The function to be called when the button is pressed.
   * @param {string} [params.color] - The default color of the button.
   * @param {string} [params.hoverColor] - The color of the button when hovered over.
   * @param {boolean} [params.disabled] - Optional. If true, the button will be disabled.
   * @param {[LEFT|CENTER|RIGHT, TOP|CENTER|BOTTOM]} [params.align] - Optional. The alignment of the button. e.g. [LEFT, TOP]
   * @param {TextProps} [params.textParams] - Optional. The constructor params of Text class.
   */
  constructor(params) {
    super({ x: params.x, y: params.y });

    this.width = params?.width || 32;
    this.height = params?.height || 32;
    this.action = params?.action;
    this.color = params?.color || Theme.palette.darkBlue;
    this.hoverColor =
      params?.hoverColor || colorHelper.lighter(this.color, 0.5);
    this.disabled = params?.disabled || false;
    this.isHovered = false;
    this.align = params?.align;

    this.text = new Text({
      color: Theme.palette.text.contrastText,
      ...params.textParams,
    });
  }

  draw() {
    if (this.disabled) {
      fill(Theme.palette.text.disabled);
    } else {
      this.isHovered = this.isMouseOver();
      fill(this.isHovered ? this.hoverColor : this.color);
    }

    const position = { x: this.x, y: this.y };

    if (this.align?.[0] === CENTER) {
      position.x = this.x - this.width / 2;
    } else if (this.align?.[0] === RIGHT) {
      position.x = this.x - this.height;
    }

    if (this.align?.[1] === CENTER) {
      position.y = this.y - this.height / 2;
    } else if (this.align?.[1] === BOTTOM) {
      position.y = this.y - this.height;
    }

    rect(position.x, position.y, this.width, this.height, 10);
    this.text.draw({
      textAlign: [CENTER, CENTER],
      x: position.x + this.width / 2,
      y: position.y + this.height / 2,
    });
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
