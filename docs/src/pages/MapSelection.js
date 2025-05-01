/**
 * Map selection page with scrollable options
 * Handles map preview display and selection logic
 */
class MapSelection extends BasePage {
  constructor() {
    super({
      bgm: Resources.sounds.bgm.intro,
      background: Resources.images.welcome.background,
    });

    this.selectingIdx = 0;
    this.aniProgress = 0; // scroll animation progress (0-1)
    this.aniDirection = 0; // -1 to left, 1 to right, 0 no ani

    this.pointerSetting = {
      side: 30,
      height: (Math.sqrt(3) * 30) / 2,
      gap: 16,
    };
  }

  /**
   * Initialize page elements
   * @override
   */
  setup() {
    super.setup();

    this.title = new Text({
      label: 'SELECT MAP',
      x: width / 2,
      y: height / 4 - 28,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.large,
      textStyle: BOLD,
      stroke: Theme.palette.text.primary,
      strokeWeight: 1,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.mapName = new Text({
      label: '',
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.medium,
      textStyle: BOLD,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });

    this.backHint = new Text({
      label: `Press ${Settings.players
        .map(({ controls }) => `[${controls.HIT.name}]`)
        .join('/')}/[Enter] to Select`,
      x: width / 2,
      y: height / 2 + 265,
      color: Theme.palette.text.primary,
      textSize: Theme.text.fontSize.small,
      textAlign: [CENTER, CENTER],
      textFont: 'Press Start 2P',
    });
  }

  /**
   * Render page content with scroll animation
   * @override
   */
  draw() {
    super.draw();

    push();
    // crop options area
    clip(() => {
      rectMode(CENTER);
      rect(width / 2, height / 2, width * (8 / 9), height);
    });

    // display 5 options at a time
    for (let i = -2; i <= 2; i++) {
      const idx =
        (this.selectingIdx + i + Constants.Map.length) % Constants.Map.length;
      this._drawMapOption(idx, i);
    }

    // update scroll animation progress
    const isAnimating = this.aniDirection != 0;
    if (isAnimating) {
      this.aniProgress += 0.1;
      if (this.aniProgress >= 1) {
        // reset animation when finish
        this.aniProgress = 0;
        this.aniDirection = 0;
      }
    }
    pop();

    // draw title and back hint
    this.title?.draw();
    this.backHint?.draw();
  }

  /**
   * Draw individual map option
   * @param {number} idx - Map index
   * @param {number} position - Display position (-2 to 2)
   */
  _drawMapOption(idx, position) {
    // settings
    const gap = 290;
    const baseScale = 0.6;
    const selectedScale = 1;
    const y = height / 2 + 24;

    // states
    const isSelected = position === 0;
    const isAnimating = this.aniDirection != 0;
    const img = Resources.images.mapSelection[idx];

    // get animated states
    const targetX = width / 2 + position * gap;
    const x = this._getAnimatedX(targetX, gap);
    const scale = this._getAnimatedScale(position, baseScale, selectedScale);

    const imgWidth = img.image.width * scale;
    const imgHeight = img.image.height * scale;

    push();
    imageMode(CENTER);
    image(img?.image, x, y, imgWidth, imgHeight);

    // draw map name
    this.mapName.draw({
      label: Constants.Map[idx].name,
      x,
      y: y + imgHeight / 2 + 32,
    });

    // show pointer at the top of the selected map
    if (isSelected) this._drawSelectingPointer(x, y, imgHeight);
    pop();
  }

  /**
   * Calculate animated x position during scroll
   * @param {number} targetX - Target x position
   * @param {number} gap - Spacing between options
   * @returns {number} Animated x position
   */
  _getAnimatedX(targetX, gap) {
    if (this.aniDirection == 0) return targetX;
    return targetX - (1 - this.aniProgress) * gap * this.aniDirection;
  }

  /**
   * Calculate scale during scroll animation
   * @param {number} position - Option position (-2 to 2)
   * @param {number} baseScale - Default scale
   * @param {number} selectedScale - Selected option scale
   * @returns {number} Current scale
   */
  _getAnimatedScale(position, baseScale, selectedScale) {
    // no animation: return selectedScale for position 0, otherwise baseScale
    if (this.aniDirection === 0) {
      return position === 0 ? selectedScale : baseScale;
    }

    // animation: check if position is the target for scaling
    const isTarget = position === this.aniDirection;
    const isCenter = position === 0;
    const scaleRange = selectedScale - baseScale;

    if (isTarget) {
      return selectedScale - scaleRange * this.aniProgress;
    } else if (isCenter) {
      return baseScale + scaleRange * this.aniProgress;
    }

    return baseScale;
  }

  /**
   * Draw selection pointer above current option
   * @param {number} x - Center x position
   * @param {number} y - Center y position
   * @param {number} imgHeight - Image height for positioning
   */
  _drawSelectingPointer(x, y, imgHeight) {
    if (Math.round(frameCount / (0.5 * Constants.FramePerSecond)) % 2) return;

    const pointerY = y - this.pointerSetting.height;
    const offsetY = imgHeight / 2 + this.pointerSetting.gap;

    fill(Theme.palette.text.primary);
    triangle(
      x - this.pointerSetting.side / 2,
      pointerY - offsetY,
      x + this.pointerSetting.side / 2,
      pointerY - offsetY,
      x,
      y - offsetY,
    );
  }

  /**
   * Check if control key is pressed
   * @param {string} control - Control type (LEFT/RIGHT/HIT)
   * @param {number} keyCode - Pressed key code
   * @returns {boolean} True if matched
   */
  _isPressed(control, keyCode) {
    return Settings.players.some(
      ({ controls }) => controls[control].value === keyCode,
    );
  }

  /**
   * Handle key press for navigation and selection
   * @override
   */
  keyPressed() {
    super.keyPressed();

    if (this._isPressed('LEFT', keyCode)) this._scrollOption(-1);

    if (this._isPressed('RIGHT', keyCode)) this._scrollOption(1);

    // HIT or Enter to select
    if (this._isPressed('HIT', keyCode) || keyCode === 13) {
      switch (this.selectingIdx) {
        case 0:
          Controller.changePage(new MapIntro1(), Constants.Page.MAP_INTRO_1);
          break;
        case 1:
          Controller.changePage(new MapIntro2(), Constants.Page.MAP_INTRO_2);
          break;
        case 2:
          Controller.changePage(new MapIntro3(), Constants.Page.MAP_INTRO_3);
          break;
        case 3:
          Controller.changePage(new MapIntro4(), Constants.Page.MAP_INTRO_4);
          break;
        case 4:
          Controller.changePage(new MapIntro5(), Constants.Page.MAP_INTRO_5);
          break;
        case 5:
          Controller.changePage(new MapIntro6(), Constants.Page.MAP_INTRO_6);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Scroll to adjacent option
   * @param {number} direction - Scroll direction (-1: left, 1: right)
   */
  _scrollOption(direction) {
    this.selectingIdx =
      (this.selectingIdx - direction + Constants.Map.length) %
      Constants.Map.length;
    this.aniDirection = direction;
    this.aniProgress = 0;
  }
}
