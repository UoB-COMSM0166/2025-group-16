/**
 * Checks if the target entity is knocked down by the hitter entity based on the hit direction.
 *
 * @param {Entity} hitterEntity - The entity that is hitting.
 * @param {Object} targetEntity - The entity that is being hit.
 * @returns {boolean} - Returns true if the target entity is knocked down, otherwise false.
 */
function checkKnockedDown(hitterEntity, targetEntity) {
  const hitter = {
    x: hitterEntity.x,
    y: hitterEntity.y,
    w: hitterEntity.getShape().scaledWidth,
    h: hitterEntity.getShape().scaledHeight,
  };
  const target = {
    x: targetEntity.x,
    y: targetEntity.y,
    w: targetEntity.getShape().scaledWidth,
    h: targetEntity.getShape().scaledHeight,
  };
  const hitDirection = hitterEntity.direction;
  switch (hitDirection) {
    case Constants.EntityMove.LEFT:
      return (
        hitter.x > target.x &&
        hitter.x < target.x + target.w &&
        hitter.y + hitter.h / 2 < target.y + target.h &&
        hitter.y + hitter.h / 2 > target.y
      );
    case Constants.EntityMove.RIGHT:
      return (
        hitter.x < target.x &&
        hitter.x + hitter.w > target.x &&
        hitter.y + hitter.h / 2 < target.y + target.h &&
        hitter.y + hitter.h / 2 > target.y
      );
    case Constants.EntityMove.UP:
      return (
        hitter.y > target.y &&
        hitter.y < target.y + target.h &&
        hitter.x + hitter.w / 2 < target.x + target.w &&
        hitter.x + hitter.w / 2 > target.x
      );
    case Constants.EntityMove.DOWN:
      return (
        hitter.y < target.y &&
        hitter.y + hitter.h > target.y &&
        hitter.x + hitter.w / 2 < target.x + target.w &&
        hitter.x + hitter.w / 2 > target.x
      );
    default:
      return false;
  }
}
