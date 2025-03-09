class KeyboardControl extends UIComponent {
  /**
   * @param {Object} params - The parameters for initializing the keyboard control.
   * @param {number} params.playerIdx - The index of the player.
   * @param {number} params.x - The x-coordinate of the control.
   * @param {number} params.y - The y-coordinate of the control.
   * @param {Object} [params.color] - The color state of the controls.
   * @param {String} [params.color.LEFT='default'] - The color of the LEFT control, can be 'default', 'active' & 'inactive'.
   * @param {String} [params.color.RIGHT='default'] - The color of the RIGHT control, can be 'default', 'active' & 'inactive'.
   * @param {String} [params.color.UP='default'] - The color of the UP control, can be 'default', 'active' & 'inactive'.
   * @param {String} [params.color.DOWN='default'] - The color of the DOWN control, can be 'default', 'active' & 'inactive'.
   * @param {String} [params.color.HIT='default'] - The color of the HIT control, can be 'default', 'active' & 'inactive'.
   * @param {number} [params.scale=1] - The scale of the control.
   */
  constructor(params) {
    super({
      x: params.x || 0,
      y: params.y || 0,
    });

    this.playerIdx = params.playerIdx;
    this.color = Object.fromEntries(
      Object.values(Constants.Control).map((control) => [
        control,
        params?.color?.[control] || 'default',
      ]),
    );
    this.scale = params?.scale || 1;

    if (params.scale > 1) {
      console.warn(
        'The scale value should be less than or equal to 1 to avoid distortion.',
      );
    }

    this.sideLength = 72;
    this.gap = 8;
  }

  /** @override */
  draw(params) {
    this.x = params.x || this.x;
    this.y = params.y || this.y;
    this.color = {
      ...this.color,
      ...params.color,
    };

    push();
    imageMode(CENTER);
    this._drawControl(Constants.Control.HIT, 0, 0);
    this._drawControl(Constants.Control.UP, this.sideLength + this.gap, 0);
    this._drawControl(Constants.Control.LEFT, 0, this.sideLength + this.gap);
    this._drawControl(
      Constants.Control.DOWN,
      this.sideLength + this.gap,
      this.sideLength + this.gap,
    );
    this._drawControl(
      Constants.Control.RIGHT,
      (this.sideLength + this.gap) * 2,
      this.sideLength + this.gap,
    );
    pop();
  }

  _drawControl(control, offsetX, offsetY) {
    imageMode(CENTER);
    const colorStatus = this.color[control];
    const resource =
      Resources.images.keyboardControl[this.playerIdx][control][colorStatus];

    image(
      resource.image,
      this.x + offsetX * this.scale - this.sideLength * this.scale,
      this.y + offsetY * this.scale - (this.sideLength * this.scale) / 2,
      this.sideLength * this.scale,
      this.sideLength * this.scale,
    );
  }
}
