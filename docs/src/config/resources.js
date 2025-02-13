const _path = {
  img: {
    entity: '/docs/assets/images/entity.svg',
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
});

/**
 * @typedef {keyof typeof Constants.EntitySize} EntitySize
 * @typedef {keyof typeof Constants.EntityStatus} EntityStatus
 */
/** @type {{ entity: { [size in EntitySize]: { [status in EntityStatus]: SVGImage } } }} */
const Resources = {
  img: {
    entity: Object.fromEntries(
      Object.entries(_entityVariants.scale).map(([size, scale]) => [
        size,
        Object.fromEntries(
          Object.entries(_entityVariants.status).map(([status, fill]) => [
            status,
            new SVGImage(_path.img.entity, { scale, fill }),
          ]),
        ),
      ]),
    ),
  },
  sound: {},
};
