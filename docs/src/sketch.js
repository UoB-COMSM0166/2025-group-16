/**
 * Main entry point for the p5.js sketch.
 *
 * This file initializes the game pages and delegates p5.js lifecycle events
 * to the current page instance.
 *
 * If you need to use a p5.js function that is not handled here,
 * add it both here and to `basePage` to ensure consistency across all pages.
 */

function loadAllImages(nestedImageObj) {
  Object.values(nestedImageObj).forEach((svgImage) => {
    if (svgImage instanceof SVGImage) {
      svgImage.loadImage();
    } else if (typeof svgImage === 'object' && svgImage !== null) {
      loadAllImages(svgImage);
    }
  });
}

/**
 * Called once before all the setups.
 * Load all assets here (images, sounds, etc.)
 */
function preload() {
  loadAllImages(Resources.img);
}

function setup() {
  // TODO: check the way to set size, now use the current screen size to set canvas
  createCanvas(windowWidth, windowHeight);
  Controller.changePage(new Welcome(), Constants.Page.WELCOME);
}

const pageLabel = new Text(); // TODO: remove it
function draw() {
  background(Theme.palette.background);
  pageLabel.draw({
    label: Store.getCurrentPageKey(),
    x: 10,
    y: 15,
    color: Theme.palette.text.primary,
    textSize: Theme.text.fontSize.small,
    textAlign: LEFT,
    textStyle: BOLD,
  });

  Store.getCurrentPage().draw();
}

/**
 * If additional event handlers are needed, add them here and also define them in `BasePage`.
 */
const events = ['mousePressed', 'mouseReleased', 'keyPressed', 'keyReleased'];
events.forEach((eventName) => {
  window[eventName] = function (...args) {
    return Store.getCurrentPage()[eventName](...args);
  };
});
