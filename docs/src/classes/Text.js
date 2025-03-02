/**
 * Represents a text in the game interface.
 */
class Text extends UIComponent {
  /**
   * @param {Object} params - The parameters for the text, see https://p5js.org/reference/ for more details.
   * @param {number} [params.x] - The x-coordinate of the text's position.
   * @param {number} [params.y] - The y-coordinate of the text's position.
   * @param {string} [params.label] - The text content to display.
   * @param {string} [params.color] - The fill color of the text.
   * @param {string} [params.textAlign] - The alignment of the text, e.g. [CENTER, TOP]
   * @param {number} [params.textLeading] - The spacing between lines of text.
   * @param {number | string} [params.textSize] - The font size to set for the text.
   * @param {string} [params.textStyle] - The style for the text.
   * @param {string} [params.textWrap] - The wrapping style of the text.
   * @param {string} [params.stroke] - The outline color of the text.
   * @param {number} [params.strokeWeight] - The weight of the text's outline (stroke thickness).
   * @param {number} [params.maxWidth] - The maximum width of the text box.
   * @param {string} [params.textFont] - The font of text.
   * @param {boolean} [params.isShadow] - The text shadow.
   * @param {string} [params.shadowColor] - The shadow color.
   * @param {number} [params.shadowOffsetX] - The shadow offset x.
   * @param {number} [params.shadowOffsetY] - The shadow offset y.
   */
  constructor(params) {
    super({ x: params?.x, y: params?.y });

    this.label = params?.label || '';
    this.color = params?.color;
    this.textAlign = params?.textAlign;
    this.textLeading = params?.textLeading;
    this.textSize = params?.textSize;
    this.textStyle = params?.textStyle;
    this.stroke = params?.stroke;
    this.strokeWeight = params?.strokeWeight;
    this.maxWidth = params?.maxWidth;
    this.textFont = params?.textFont;
    this.isShadow = params?.isShadow || false;
    this.shadowColor = params?.shadowColor || Theme.palette.black;
    this.shadowOffsetX = params?.shadowOffsetX || 5;
    this.shadowOffsetY = params?.shadowOffsetY || 5;
  }

  draw(params) {
    push();
    const config = { ...this, ...params };

    textSize(config.textSize);
    textAlign(config.textAlign?.[0] || LEFT, config.textAlign?.[1] || TOP);
    if (config.textFont) textFont(config.textFont);
    if (config.textStyle) textStyle(config.textStyle);
    if (config.textLeading) textLeading(config.textLeading);
    if (config.stroke && config.strokeWeight) {
      stroke(config.stroke);
      strokeWeight(config.strokeWeight);
    } else {
      noStroke();
    }

    // shadow
    if (config.isShadow) {
      fill(config.shadowColor);
      if (config.maxWidth) {
        text(
          config.label,
          config.x + config.shadowOffsetX,
          config.y + config.shadowOffsetY,
          config.maxWidth,
        );
      } else {
        text(
          config.label,
          config.x + config.shadowOffsetX,
          config.y + config.shadowOffsetY,
        );
      }
    }

    // main text
    fill(config.color);
    if (config.maxWidth) {
      text(config.label, config.x, config.y, config.maxWidth);
    } else {
      text(config.label, config.x, config.y);
    }

    pop();
  }
}
