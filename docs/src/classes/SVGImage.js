/**
 * Manage customized SVG images in the game
 * Handle SVG loading and attribute modification
 *
 * Usage:
 * 1. Add SVG path and instance in `src/config/resources` file
 * 2. Make sure it preload in `sketch.js`
 * 3. In `draw()`, display the image using `image(Resources.images.xxx.image)`
 * 4. If you want to update the SVG's attributes, call `img.updateAttributes()`.
 * Be careful, it will change this image globally.
 */
class SVGImage extends Img {
  /**
   * @param {string} path - Path to the SVG file
   * @param {Object} [attributes] - SVG attributes to modify
   * @param {number} [attributes.scale] - Scaling factor, ignored if width, height, or viewBox is set
   */
  constructor(path, attributes = {}) {
    super(path);

    this.attributes = attributes;
    this.image = null; // loaded SVG image
    this.width = 0; // image width after scaling
    this.height = 0; // image height after scaling
  }

  /**
   * Update SVG attributes and reload image
   * @param {Object} newAttributes - New attributes to apply
   * @param {number} [newAttributes.scale] - New scaling factor
   */
  updateAttributes(newAttributes) {
    Object.assign(this.attributes, newAttributes);
    this.loadImage();
  }

  /**
   * Load and modify SVG image with attributes
   * @override
   */
  loadImage() {
    fetch(this.path)
      .then((res) => res.text())
      .then((svgText) => {
        // parse SVG text into DOM
        const svgDoc = new DOMParser().parseFromString(
          svgText,
          'image/svg+xml',
        );
        const svgElement = svgDoc.documentElement;
        const originalAttrs = this._parseSVGAttrs(svgText);
        const newAttributes = { ...originalAttrs, ...this.attributes };

        // apply scale if no custom width, height, or viewBox is set
        if (
          this.attributes.scale &&
          !this.attributes?.width &&
          !this.attributes?.height &&
          !this.attributes?.viewBox
        ) {
          const viewBox = originalAttrs.viewBox
            ? originalAttrs.viewBox.split(' ').map(Number)
            : [0, 0, originalAttrs.width, originalAttrs.height];
          const [x, y, w, h] = viewBox;
          newAttributes.width = w * this.attributes.scale;
          newAttributes.height = h * this.attributes.scale;
          newAttributes.viewBox = `${x} ${y} ${w} ${h}`;
        }

        this.width = newAttributes.width;
        this.height = newAttributes.height;

        // update SVG attributes
        Object.entries(newAttributes).forEach(([key, value]) =>
          svgElement.setAttribute(key, value),
        );

        // convert modified SVG to blob and load as image
        const modifiedSvgText = new XMLSerializer().serializeToString(
          svgElement,
        );
        const url = URL.createObjectURL(
          new Blob([modifiedSvgText], { type: 'image/svg+xml' }),
        );

        loadImage(url, (img) => {
          this.image = img;
          URL.revokeObjectURL(url); // clean up blob URL
        });
      });
  }

  /**
   * Parse SVG attributes from text
   * @param {string} svgText - Raw SVG text
   * @returns {Object} Parsed SVG attributes
   */
  _parseSVGAttrs(svgText) {
    const svg = new DOMParser().parseFromString(
      svgText,
      'image/svg+xml',
    ).documentElement;
    return Object.fromEntries(
      [...svg.attributes].map((attr) => [attr.name, attr.value]),
    );
  }
}
