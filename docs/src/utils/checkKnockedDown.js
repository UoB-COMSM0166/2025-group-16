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
    case Constants.EntityMove.RIGHT:
      return (
        target.y < hitter.y + hitter.h &&
        target.y + target.h > hitter.y &&
        hitter.x + hitter.w > target.x &&
        hitter.x < target.x + target.w
      );
    case Constants.EntityMove.LEFT:
      return (
        target.y < hitter.y + hitter.h &&
        target.y + target.h > hitter.y &&
        hitter.x < target.x + target.w &&
        hitter.x + hitter.w > target.x
      );
    case Constants.EntityMove.UP:
      return (
        target.x < hitter.x + hitter.w &&
        target.x + target.w > hitter.x &&
        hitter.y < target.y + target.h &&
        hitter.y + hitter.h > target.y
      );
    case Constants.EntityMove.DOWN:
      return (
        target.x < hitter.x + hitter.w &&
        target.x + target.w > hitter.x &&
        hitter.y + hitter.h > target.y &&
        hitter.y < target.y + target.h
      );
    default:
      return false;
  }
}
