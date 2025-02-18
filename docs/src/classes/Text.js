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
  }

  draw(params) {
    const config = {
      ...this,
      ...params,
    };

    if (config.color !== undefined) fill(config.color);
    if (config.textAlign !== undefined) {
      textAlign(config.textAlign[0], config.textAlign[1]);
    }
    if (config.textLeading !== undefined) textLeading(config.textLeading);
    if (config.textSize !== undefined) textSize(config.textSize);
    if (config.textStyle !== undefined) textStyle(config.textStyle);
    if (config.stroke !== undefined) stroke(config.stroke);
    if (config.strokeWeight !== undefined) strokeWeight(config.strokeWeight);
    text(config.label, config.x, config.y);
  }
}
