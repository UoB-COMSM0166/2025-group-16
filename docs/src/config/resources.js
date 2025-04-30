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
    playerAnimation: `${_BASE_PATH}assets/images/entity/playerAnimation`,
    playerAvatar: `${_BASE_PATH}assets/images/welcome/player_avatar.svg`,
    welcome: {
      background: `${_BASE_PATH}assets/images/welcome/background.png`,
      title: `${_BASE_PATH}assets/images/welcome/text_unstoppable.svg`,
      comehere: `${_BASE_PATH}assets/images/welcome/text_comehere.svg`,
      gamaStartArea: `${_BASE_PATH}assets/images/welcome/tileset_square_comehere.svg`,
      check: `${_BASE_PATH}assets/images/welcome/icon_check.svg`,
      speakerOn: `${_BASE_PATH}assets/images/welcome/icon_soundson.svg`,
      speakerOff: `${_BASE_PATH}assets/images/welcome/icon_soundsoff.svg`,
      tutorial: `${_BASE_PATH}assets/images/welcome/icon_tutorial.svg`,
      dialog: `${_BASE_PATH}assets/images/welcome/dialog.svg`,
    },
    mapSelection: [
      `${_BASE_PATH}assets/images/mapSelection/map1_desert.svg`,
      `${_BASE_PATH}assets/images/mapSelection/map2_grass.svg`,
      `${_BASE_PATH}assets/images/mapSelection/map3_jail.svg`,
      `${_BASE_PATH}assets/images/mapSelection/map4_party.svg`,
      `${_BASE_PATH}assets/images/mapSelection/map5_kongfu.svg`,
      `${_BASE_PATH}assets/images/mapSelection/map6_magic.svg`,
    ],
    resultsPage: {
      confetti: `${_BASE_PATH}assets/images/results/confetti.gif`,
    },
    map: {
      game1: `${_BASE_PATH}assets/images/backgrounds/level1_v1.png`,
      game2: `${_BASE_PATH}assets/images/backgrounds/level2_v1.png`,
      game3: `${_BASE_PATH}assets/images/backgrounds/level3_v1.png`,
      game4: `${_BASE_PATH}assets/images/backgrounds/level4_v1.png`,
      game5: `${_BASE_PATH}assets/images/backgrounds/level5_v2.png`,
      game6: `${_BASE_PATH}assets/images/backgrounds/level6_v1.png`,
    },
    mapIntro: {
      demo2: `${_BASE_PATH}assets/images/mapIntro/DEMO2.gif`,
    },
    keyboardControl: `${_BASE_PATH}assets/images/keyboardControl`,
    mapElements: {
      magicCircle: `${_BASE_PATH}assets/images/mapElements/magic_circle.svg`,
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
      playing2: `${_BASE_PATH}assets/sounds/playing2.wav`,
      playing3: `${_BASE_PATH}assets/sounds/playing3.wav`,
      playing4: `${_BASE_PATH}assets/sounds/playing4.wav`,
      playing5: `${_BASE_PATH}assets/sounds/playing5.wav`,
      playing6: `${_BASE_PATH}assets/sounds/playing6.wav`,
      resultpage: `${_BASE_PATH}assets/sounds/resultpage.wav`,
    },
    sound_effect: {
      countdown: `${_BASE_PATH}assets/sounds/321.wav`,
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
const _welcomeScale = Settings.entity.scale[Constants.EntitySize.XL];
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

const _playerAniResources = Object.fromEntries(
  ['lose', 'jump', 'wave_1', 'wave_2'].map((ani) => [
    ani,
    Object.fromEntries(
      Object.values(Theme.palette.player).map((fill) => [
        fill,
        new SVGImage(
          `${_ASSET_PATHS.images.playerAnimation}/player_${ani}.svg`,
          {
            scale: _entityBaseScale,
            fill,
          },
        ),
      ]),
    ),
  ]),
);

const _keyboardControlResources = Settings.players.map((_, pIdx) =>
  Object.fromEntries(
    Object.values(Constants.Control).map((control) => [
      control,
      Object.fromEntries(
        ['active', 'inactive', 'default'].map((status) => [
          status,
          new SVGImage(
            `${_ASSET_PATHS.images.keyboardControl}/keyboard_${control.toLowerCase()}_p${pIdx + 1}.svg`,
            status !== 'default'
              ? {
                  fill:
                    status === 'active'
                      ? Theme.palette.orange
                      : Theme.palette.mint,
                }
              : {},
          ),
        ]),
      ),
    ]),
  ),
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
 *     playerAvatar: {
 *       ing: {
 *          [Constants.palette.entity[0]]: SVGImage,
 *          [Constants.palette.entity[1]]: SVGImage,
 *       },
 *       lose: SVGImage,
 *     },
 *   }
 *   sounds: {},
 * };
 * ```
 */

const _welcomeResources = {
  ...Object.fromEntries(
    Object.entries(_ASSET_PATHS.images.welcome).map(([key, path]) => [
      key,
      path.endsWith('.svg')
        ? new SVGImage(path, { scale: _welcomeScale })
        : new Img(path),
    ]),
  ),
  check: Object.fromEntries(
    Object.values(Theme.palette.player).map((fill) => [
      fill,
      new SVGImage(_ASSET_PATHS.images.welcome.check, {
        scale: _welcomeScale,
        fill,
      }),
    ]),
  ),
};

const Resources = {
  images: {
    entity: _entityResources,
    playerAnimation: _playerAniResources,
    welcome: _welcomeResources,
    keyboardControl: _keyboardControlResources,
    resultsPage: {
      confetti: new Img(_ASSET_PATHS.images.resultsPage.confetti),
    },
    mapSelection: _ASSET_PATHS.images.mapSelection.map(
      (path) => new SVGImage(path, { scale: 2 }),
    ),
    map: {
      game1: new Img(_ASSET_PATHS.images.map.game1),
      game2: new Img(_ASSET_PATHS.images.map.game2),
      game3: new Img(_ASSET_PATHS.images.map.game3),
      game4: new Img(_ASSET_PATHS.images.map.game4),
      game5: new Img(_ASSET_PATHS.images.map.game5),
      game6: new Img(_ASSET_PATHS.images.map.game6),
    },
    mapIntro: {
      demo2: new Img(_ASSET_PATHS.images.mapIntro.demo2),
    },
    playerAvatar: {
      ing: Object.values(Theme.palette.player).map(
        (fill) =>
          new SVGImage(_ASSET_PATHS.images.playerAvatar, {
            fill,
            scale: Settings.entity.scale[Constants.EntitySize.XL],
          }),
      ),
      lose: new SVGImage(_ASSET_PATHS.images.playerAvatar, {
        fill: Theme.palette.robot.grey,
        scale: Settings.entity.scale[Constants.EntitySize.XL],
      }),
    },
    mapElements: {
      magicCircle: new Img(_ASSET_PATHS.images.mapElements.magicCircle),
    },
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
      playing2: new Sound(_ASSET_PATHS.sounds.bgm.playing2),
      playing3: new Sound(_ASSET_PATHS.sounds.bgm.playing3),
      playing4: new Sound(_ASSET_PATHS.sounds.bgm.playing4),
      playing5: new Sound(_ASSET_PATHS.sounds.bgm.playing5),
      playing6: new Sound(_ASSET_PATHS.sounds.bgm.playing6),
      resultpage: new Sound(_ASSET_PATHS.sounds.bgm.resultpage),
    },
    sound_effect: {
      countdown: new Sound(_ASSET_PATHS.sounds.sound_effect.countdown),
    },
  },
};
