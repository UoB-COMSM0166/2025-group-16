// 1. Add the path to `_ASSET_PATHS`
// 2. Add the asset instance to `Resources`
// 3. Preload it in `sketch.js`.
// 4. Access the asset via `Resources.xxx.xxx` (from `config/resources`).

/* Path Settings */
const _BASE_PATH = window.location.hostname.includes('github.io')
  ? 'https://uob-comsm0166.github.io/2025-group-16/'
  : '';
const _ASSET_PATHS = {
  images: {
    entity: 'assets/images/entity.svg',
    // Add more image paths here
  },
  sounds: {
    // Add sound paths here
  },
};

/* Helper Variables and Functions */
const _entityVariants = Object.freeze({
  scale: Object.freeze({
    [Constants.EntitySize.S]: 1,
    [Constants.EntitySize.M]: 3,
    [Constants.EntitySize.L]: 5,
  }),
  status: Object.freeze({
    [Constants.EntityStatus.ALIVE]: Theme.palette.red,
    [Constants.EntityStatus.HIT]: Theme.palette.yellow,
    [Constants.EntityStatus.COOLDOWN]: Theme.palette.mint,
    [Constants.EntityStatus.DIED]: Theme.palette.text.grey,
  }),
  entity: Theme.palette.entity,
});

const _entityResources = Object.fromEntries(
  // Create size variants
  Object.entries(_entityVariants.scale).map(([size, scale]) => [
    size,
    Object.fromEntries([
      // Add color variants
      ...Object.values(_entityVariants.entity).map((fill) => [
        fill,
        new SVGImage(`${_BASE_PATH}${_ASSET_PATHS.images.entity}`, {
          scale,
          fill,
        }),
      ]),
      // Add status variants
      ...Object.entries(_entityVariants.status).map(([status, fill]) => [
        status,
        new SVGImage(`${_BASE_PATH}${_ASSET_PATHS.images.entity}`, {
          scale,
          fill,
        }),
      ]),
    ]),
  ]),
);

/* Main Resources */
/**
 * Please find the reference structure below:
 *
 * ```
 * const Resources = {
 *   images: {
 *     entity: {
 *       [Constants.EntitySize.S]: {
 *         [Constants.palette.entity[0]]: SVGImage,
 *         [Constants.palette.entity[1]]: SVGImage,
 *         [Constants.palette.entity[2]]: SVGImage,
 *         [Constants.palette.entity[3]]: SVGImage,
 *         [Constants.EntityStatus.ALIVE]: SVGImage,
 *         [Constants.EntityStatus.HIT]: SVGImage,
 *         [Constants.EntityStatus.COOLDOWN]: SVGImage,
 *         [Constants.EntityStatus.DIED]: SVGImage,
 *       },
 *       // [Constants.EntitySize.M]: { ... },
 *       // [Constants.EntitySize.L]: { ... },
 *     },
 *     map: {},
 *   },
 *   sounds: {},
 * }
 * ```
 */
const Resources = {
  images: {
    entity: _entityResources,
    map: {},
  },
  sounds: {},
};
