export function findClosestPoint(grid, pos, targetValue) {
  const height = grid.length;
  const width = grid[0].length;

  // Boundary check for the starting position
  if (pos.x < 0 || pos.x >= width || pos.y < 0 || pos.y >= height) {
    return null;
  }

  if (grid[pos.y][pos.x] === targetValue) {
    return { x: pos.x, y: pos.y };
  }

  // Directions: Right, Left, Down, Up
  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  // BFS tracking
  const queue = [{ x: pos.x, y: pos.y }];
  const visited = new Uint8Array(width * height);
  visited[pos.y * width + pos.x] = 1;

  let head = 0; // Use a pointer instead of shift() for better performance in JS
  while (head < queue.length) {
    const { x, y } = queue[head++];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      // Bounds check
      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        const index = ny * width + nx;

        if (!visited[index]) {
          if (grid[ny][nx] === targetValue) {
            return { x: nx, y: ny };
          }

          visited[index] = 1;
          queue.push({ x: nx, y: ny });
        }
      }
    }
  }

  return null;
}
