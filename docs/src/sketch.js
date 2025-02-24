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
  Object.values(nestedImageObj).forEach((img) => {
    if (img instanceof Img) {
      img.loadImage();
    } else if (typeof img === 'object' && img !== null) {
      loadAllImages(img);
    }
  });
}

function loadAllSounds(nestedSoundObj) {
  Object.values(nestedSoundObj).forEach((sound) => {
    if (sound instanceof Sound) {
      sound.loadSound();
    } else if (typeof sound === 'object' && sound !== null) {
      loadAllSounds(sound);
    }
  });
}

/**
 * Called once before all the setups.
 * Load all assets here (images, sounds, etc.)
 */
function preload() {
  loadAllImages(Resources.images);
  loadAllSounds(Resources.sounds);
}

function setup() {
  // remove loading when preload finish
  document.getElementById('start-loading-text-wrapper').remove();

  createCanvas(Settings.canvas.width, Settings.canvas.height);
  Controller.changePage(new Welcome(), Constants.Page.WELCOME);
}

const pageLabel = new Text(); // TODO: remove it
function draw() {
  background(Theme.palette.lightGrey);
  pageLabel.draw({
    label: Store.getCurrentPageKey(),
    x: 15,
    y: 15,
    color: Theme.palette.text.primary,
    textSize: Theme.text.fontSize.small,
    textStyle: BOLD,
    textAlign: [LEFT, TOP],
  });

  Store.getCurrentPage().draw();
}

/**
 * If additional event handlers are needed, add them here and also define them in `BasePage`.
 */
const events = ['mousePressed', 'mouseReleased', 'keyPressed', 'keyReleased'];
events.forEach((eventName) => {
  window[eventName] = function (...args) {
    return Store.getCurrentPage()?.[eventName]?.(...args);
  };
});
