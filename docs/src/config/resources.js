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
    playerLose: `${_BASE_PATH}assets/images/entity/player_lose.svg`,
    playerlist: `${_BASE_PATH}assets/images/welcomepage/player_avatar.svg`,
    welcomepage: {
      background: `${_BASE_PATH}assets/images/welcomepage/background_welcomepage.png`,
      title: `${_BASE_PATH}assets/images/welcomepage/text_unstoppable.svg`,
      comehere: `${_BASE_PATH}assets/images/welcomepage/text_comehere.svg`,
      gamaStartArea: `${_BASE_PATH}assets/images/welcomepage/tileset_square_comehere.svg`,
      checkiconp1: `${_BASE_PATH}assets/images/welcomepage/icon_check_p1.svg`,
      checkiconp2: `${_BASE_PATH}assets/images/welcomepage/icon_check_p2.svg`,
      areYouARobot: `${_BASE_PATH}assets/images/welcomepage/text_areyouarobot.svg`,
      textOkP1: `${_BASE_PATH}assets/images/welcomepage/text_ok_p1.svg`,
      textOkP2: `${_BASE_PATH}assets/images/welcomepage/text_ok_p2.svg`,
      keyboardP1: `${_BASE_PATH}assets/images/welcomepage/icon_keyboard_p1.svg`,
      keyboardP2: `${_BASE_PATH}assets/images/welcomepage/icon_keyboard_p2.svg`,
    },
    resultsPage: {
      confetti: `${_BASE_PATH}assets/images/results/confetti.gif`,
    },
    map: {
      game1: `${_BASE_PATH}assets/images/backgrounds/level1_v1.png`,
      game2: `${_BASE_PATH}assets/images/backgrounds/level2_v1.png`,
    },
    mapintro1page: {
      demo2: `${_BASE_PATH}assets/images/mapintro1page/DEMO2.gif`,
    },
    // Add more image paths here
  },
  sounds: {
    entity: {
      punch: `${_BASE_PATH}assets/sounds/punch.wav`,
      dong: `${_BASE_PATH}assets/sounds/dong.wav`,
      whoosh: `${_BASE_PATH}assets/sounds/whoosh.wav`,
    },
    bgm: {
      intro: `${_BASE_PATH}assets/sounds/intro.wav`,
      playing1: `${_BASE_PATH}assets/sounds/playing1.wav`,
    },
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
const _welcomePageScale = Settings.entity.scale[Constants.EntitySize.XL];
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

const _playerLoseResources = Object.fromEntries(
  Object.values(Theme.palette.player).map((fill) => [
    fill,
    new SVGImage(_ASSET_PATHS.images.playerLose, {
      scale: _entityBaseScale,
      fill,
    }),
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
 *     playerLose: {
 *       [Constants.palette.player[0]]: SVGImage,
 *       [Constants.palette.player[1]]: SVGImage,
 *     },
 *     welcome:{},
 *     map: {},
 *     playerlist: [p1_avatar, p2_avatar, ...],
 *   }
 *   sounds: {},
 * };
 * ```
 */

const _welomepageResources = Object.fromEntries(
  Object.entries(_ASSET_PATHS.images.welcomepage).map(([key, path]) => [
    key,
    path.endsWith('.svg')
      ? new SVGImage(path, { scale: _welcomePageScale })
      : new Img(path),
  ]),
);

const Resources = {
  images: {
    entity: _entityResources,
    playerLose: _playerLoseResources,
    welcome: _welomepageResources,
    resultsPage: {
      confetti: new Img(_ASSET_PATHS.images.resultsPage.confetti),
    },
    map: {
      game1: new Img(_ASSET_PATHS.images.map.game1),
      game2: new Img(_ASSET_PATHS.images.map.game2),
    },
    mapintro1page: {
      demo2: new Img(_ASSET_PATHS.images.mapintro1page.demo2),
    },
    playerlist: Object.values(Theme.palette.player).map(
      (fill) =>
        new SVGImage(_ASSET_PATHS.images.playerlist, {
          fill,
          scale: Settings.entity.scale[Constants.EntitySize.XL],
        }),
    ),
  },
  sounds: {
    entity: {
      punch: new Sound(_ASSET_PATHS.sounds.entity.punch),
      dong: new Sound(_ASSET_PATHS.sounds.entity.dong),
      whoosh: new Sound(_ASSET_PATHS.sounds.entity.whoosh),
    },
    bgm: {
      intro: new Sound(_ASSET_PATHS.sounds.bgm.intro),
      playing1: new Sound(_ASSET_PATHS.sounds.bgm.playing1),
    },
  },
};
