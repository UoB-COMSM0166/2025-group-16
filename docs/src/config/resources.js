const _base_path = "https://uob-comsm0166.github.io/2025-group-16/"

const _path = {
  img: {
    entity: 'assets/images/entity.svg',
  },
  sound: {},
};

const _entityVariants = Object.freeze({
  scale: Object.freeze({
    [Constants.EntitySize.S]: 1,
    [Constants.EntitySize.M]: 3,
    [Constants.EntitySize.L]: 5,
  }),
  status: Object.freeze({
    [Constants.EntityStatus.ALIVE]: Theme.palette.primary,
    [Constants.EntityStatus.HIT]: Theme.palette.error,
    [Constants.EntityStatus.COOLDOWN]: Theme.palette.warning,
    [Constants.EntityStatus.DIED]: Theme.palette.text.disabled,
  }),
  entity: Theme.palette.entity,
});

/**
 * @typedef {keyof typeof Constants.EntitySize} EntitySize
 * @typedef {keyof typeof Constants.EntityStatus} EntityStatus
 * @typedef {typeof Theme.palette.entity[keyof typeof Theme.palette.entity]} EntityColor
 */

/**
 * @type {{
 *   entity: {
 *     [size in EntitySize]: {
 *       [status in EntityStatus]: SVGImage,
 *       [color in EntityColor]: SVGImage
 *     }
 *   }
 * }}
 */
const Resources = {
  img: {
    entity: Object.fromEntries(
      Object.entries(_entityVariants.scale).map(([size, scale]) => [
        size,
        Object.fromEntries([
          ...Object.values(_entityVariants.entity).map((fill) => [
            fill,
            new SVGImage(`${_base_path}${_path.img.entity}`, { scale, fill }),
          ]),
          ...Object.entries(_entityVariants.status).map(([status, fill]) => [
            status,
            new SVGImage(`${_base_path}${_path.img.entity}`, { scale, fill }),
          ]),
        ]),
      ]),
    ),
  },
  sound: {},
};
