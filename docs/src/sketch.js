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
  loadAllImages(Resources.images);
  Resources.images.map.MapGame1 = loadImage(Resources.images.map.MapGame1);
}

function setup() {
  createCanvas(800, 600);
  Controller.changePage(new Welcome(), Constants.Page.WELCOME);
}

const pageLabel = new Text(); // TODO: remove it
function draw() {
  background(Theme.palette.lightGrey);

  /*
   * "Upon entering the game, press 'Ready!'
   * to begin Phase Two, at which point MapGame1 will appear as the background."
   */
  if (Store.getCurrentPageKey() === Constants.Page.MAP_GAME_1) {
    if (Resources.images.map.MapGame1) {
      image(Resources.images.map.MapGame1, 0, 0, 800, 600);
    }
  }

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
