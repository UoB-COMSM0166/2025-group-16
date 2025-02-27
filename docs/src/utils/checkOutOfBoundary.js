/**
 * Checks if a rectangle is touching or exceeding the boundaries of a containing area
 * !!! Images should use ImageMode(CENTER)
 * @param {Object} rect - The rectangle to check
 * @param {number} rect.x - Center x-coordinate of the rectangle
 * @param {number} rect.y - Center y-coordinate of the rectangle
 * @param {number} rect.width - Width of the rectangle
 * @param {number} rect.height - Height of the rectangle
 * @param {Object} boundary - The boundary area
 * @param {number} boundary.x - Left x-coordinate of the boundary
 * @param {number} boundary.y - Top y-coordinate of the boundary
 * @param {number} boundary.width - Width of the boundary
 * @param {number} boundary.height - Height of the boundary
 * @returns {boolean} - True if the rectangle is touching or exceeding any boundary edge
 */
function checkOutOfBoundary(rect, boundary) {
  return (
    rect.x - rect.width / 2 <= boundary.x || // Left edge
    rect.x + rect.width / 2 >= boundary.x + boundary.width || // Right edge
    rect.y - rect.height / 2 <= boundary.y || // Top edge
    rect.y + rect.height / 2 >= boundary.y + boundary.height // Bottom edge
  );
}
