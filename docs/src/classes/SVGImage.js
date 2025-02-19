/**
 * Represents a customized SVG image.
 *
 * Usage:
 * 1. Add SVG path and instance in `src/config/resources` file
 *
 * 2. Make sure it preload in `sketch.js`
 *
 * 3. In `draw()`, display the image using `image(Resources.images.xxx.image)`.
 *
 * 4. If you want to update the SVG's attributes, call `img.updateAttributes()`.
 * Be careful, it will change this image globally.
 */
class SVGImage extends Img {
  /**
   * @param {string} path - The path to the SVG file.
   * @param {Object} [attributes] - Attributes to modify in the SVG.
   * @param {number} [attributes.scale] - Custom scaling factor,
   *                                      will be ignored if width, height, or viewBox are specified.
   */
  constructor(path, attributes = {}) {
    super(path);

    this.attributes = attributes;
    this.image = null;
    this.width = 0;
    this.height = 0;
  }

  /**
   * Updates the attributes of the SVG, including the custom `scale`.
   * @param {Object} newAttributes - New attributes to apply.
   * @param {number} [newAttributes.scale] - New scale to apply.
   */
  updateAttributes(newAttributes) {
    Object.assign(this.attributes, newAttributes);
    this.loadImage();
  }

  /** override */
  loadImage() {
    fetch(this.path)
      .then((res) => res.text())
      .then((svgText) => {
        const svgDoc = new DOMParser().parseFromString(
          svgText,
          'image/svg+xml',
        );
        const svgElement = svgDoc.documentElement;
        const originalAttrs = this._parseSVGAttrs(svgText);
        const newAttributes = { ...originalAttrs, ...this.attributes };

        // Compute viewBox and apply scaling, only apply scale if no custom width, height or viewBox is set
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

        // Update attributes
        Object.entries(newAttributes).forEach(([key, value]) =>
          svgElement.setAttribute(key, value),
        );

        // Convert SVG to a blob and load it
        const modifiedSvgText = new XMLSerializer().serializeToString(
          svgElement,
        );
        const url = URL.createObjectURL(
          new Blob([modifiedSvgText], { type: 'image/svg+xml' }),
        );

        loadImage(url, (img) => {
          this.image = img;
          URL.revokeObjectURL(url);
        });
      });
  }

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
