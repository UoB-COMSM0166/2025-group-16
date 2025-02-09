const colorHelper = {
  hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    let bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  },

  rgbToHex(r, g, b) {
    return (
      '#' +
      ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
    );
  },

  adjustColor(hex, factor) {
    let { r, g, b } = this.hexToRgb(hex);
    r = Math.min(255, Math.max(0, Math.round(r * factor)));
    g = Math.min(255, Math.max(0, Math.round(g * factor)));
    b = Math.min(255, Math.max(0, Math.round(b * factor)));
    return this.rgbToHex(r, g, b);
  },

  lighter(hex, percent) {
    return this.adjustColor(hex, 1 + percent);
  },

  darker(hex, percent) {
    return this.adjustColor(hex, 1 - percent);
  },

  alpha(hex, opacity) {
    let { r, g, b } = this.hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, opacity))})`;
  },
};
