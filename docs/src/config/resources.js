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
    entity: `${_BASE_PATH}assets/images/entity/`,
    map: {
      game1: `${_BASE_PATH}assets/images/backgrounds/level1_v1.png`,
    },
    // Add more image paths here
  },
  sounds: {
    // Add sound paths here
  },
};

/* Helper Variables and Functions */
/**
 * @example getEntityImagePath(Constants.EntityType.Player, Constants.AnimationStatus.WALK, Constants.EntityMove.RIGHT, 1)
 *
 * return: 'assets/images/entity/player_walk_right_1.svg'
 */
const _getEntityImagePath = (entityType, animationStatus, entityMove, number) =>
  _ASSET_PATHS.images.entity +
  entityType.toLowerCase() +
  '_' +
  animationStatus.toLowerCase() +
  '_' +
  entityMove.toLowerCase() +
  (number ? `_${number}` : '') +
  '.svg';

const _entityVariants = Object.freeze({
  status: Object.freeze({
    [Constants.EntityStatus.ALIVE]: Theme.palette.red,
    [Constants.EntityStatus.HIT]: Theme.palette.yellow,
    [Constants.EntityStatus.COOLDOWN]: Theme.palette.mint,
    [Constants.EntityStatus.DIED]: Theme.palette.text.grey,
  }),
  frameNo: Object.freeze({
    [Constants.EntityAnimationStatus.IDLE]: 1,
    [Constants.EntityAnimationStatus.ATTACK]: 2,
    [Constants.EntityAnimationStatus.WALK]: 2,
  }),
});

const _entityBaseScale = 1 / Settings.entity.scale[Constants.EntitySize.S];

const _entityResources = Object.fromEntries(
  // Add entity type: player, robot
  Object.values(Constants.EntityType).map((type) => [
    type,
    // Add color variants
    Object.fromEntries(
      Object.values(
        Theme.palette[
          type === Constants.EntityType.PLAYER ? 'player' : 'robot'
        ],
      ).map((fill) => [
        fill,
        // Add entity animation: idle, attack, walk
        Object.fromEntries(
          Object.values(Constants.EntityAnimationStatus).map((animation) => [
            animation,
            // Add move direction: up, down, left, right
            Object.fromEntries(
              Object.entries(Constants.EntityMove).map(([direction]) => [
                direction,
                // Get sequenced images
                Array.from(
                  { length: _entityVariants.frameNo[animation] },
                  (_, idx) =>
                    new SVGImage(
                      _getEntityImagePath(type, animation, direction, idx + 1),
                      {
                        scale: _entityBaseScale,
                        fill,
                      },
                    ),
                ),
              ]),
            ),
          ]),
        ),
      ]),
    ),
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
 *       [Constants.EntityType.Player]: {
 *         [Constants.palette.entity[0]]: {
 *           [Constants.EntityAnimationStatus.IDLE]: {
 *             [Constants.EntityMove.UP]: SVGImage[],
 *             [Constants.EntityMove.DOWN]: SVGImage[],
 *             [Constants.EntityMove.RIGHT]: SVGImage[],
 *             [Constants.EntityMove.LEFT]: SVGImage[],
 *           },
 *           [Constants.EntityAnimationStatus.ATTACK]: {...},
 *           [Constants.EntityAnimationStatus.WALK]: {...},
 *         },
 *         [Constants.palette.entity[1]]: {...},
 *         [Constants.palette.entity[2]]: {...},
 *         [Constants.palette.entity[3]]: {...},
 *        },
 *       [Constants.EntityType.Robot]: {...},
 *     }
 *     map: {},
 *   }
 *   sounds: {},
 * };
 * ```
 */

const Resources = {
  images: {
    entity: _entityResources,
    map: {
      game1: _ASSET_PATHS.images.map.game1,
    },
  },
  sounds: {},
};
