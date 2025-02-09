function checkCollision(x1, y1, r1, x2, y2, r2) {
  const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  return distance <= r1 + r2;
}
