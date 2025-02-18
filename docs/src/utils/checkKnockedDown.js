function checkKnockedDown(hitter, target, hitDirection) {
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
