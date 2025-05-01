const fistPosition = {
  [Constants.EntityMove.LEFT]: { x: -9, y: 8.5, w: 6, h: 8 },
  [Constants.EntityMove.RIGHT]: { x: 9, y: 8.5, w: 6, h: 8 },
  [Constants.EntityMove.UP]: { x: 9, y: 8, w: 7.5, h: 8 },
  [Constants.EntityMove.DOWN]: { x: 9, y: 8, w: 7.5, h: 8 },
};

const originSize = {
  [Constants.EntityMove.LEFT]: { w: 24, h: 32 },
  [Constants.EntityMove.RIGHT]: { w: 24, h: 32 },
  [Constants.EntityMove.UP]: { w: 26, h: 32 },
  [Constants.EntityMove.DOWN]: { w: 26, h: 32 },
};

/**
 * Checks if the target entity is knocked down by the hitter entity based on the hit direction.
 * @param {Entity} hitterEntity - The entity that is hitting.
 * @param {Object} targetEntity - The entity that is being hit.
 * @returns {boolean} - Returns true if the target entity is knocked down, otherwise false.
 */
function checkKnockedDown(hitterEntity, targetEntity) {
  const hitterFist = getFistPosition(hitterEntity); // get the fist position of the hitter entity
  const target = {
    x: targetEntity.x,
    y: targetEntity.y,
    w: targetEntity.getShape().scaledWidth,
    h: targetEntity.getShape().scaledHeight,
  };

  return (
    hitterFist.x + hitterFist.w / 2 > target.x - target.w / 2 &&
    hitterFist.x - hitterFist.w / 2 < target.x + target.w / 2 &&
    hitterFist.y + hitterFist.h / 2 > target.y - target.w / 2 &&
    hitterFist.y - hitterFist.h / 2 < target.y + target.h / 2
  );
}

/**
 * Calculates the fist position of the hitter entity based on its direction and scale.
 * @param {Entity} hitterEntity - The entity that is hitting.
 * @returns {Object} - The fist's position and size { x, y, w, h }.
 */
function getFistPosition(entity) {
  const hitter = {
    w: entity.getShape().scaledWidth,
    h: entity.getShape().scaledHeight,
  };
  const scale = hitter.w / originSize[entity.direction].w;

  return {
    x: entity.x + fistPosition[entity.direction].x * scale,
    y: entity.y + fistPosition[entity.direction].y * scale,
    w: fistPosition[entity.direction].w * scale,
    h: fistPosition[entity.direction].h * scale,
  };
}
