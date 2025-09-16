export function rotateMatrix(matrix, direction = 1) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = Array.from({ length: cols }, () => Array(rows).fill(0));

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (direction > 0) {
        result[x][rows - 1 - y] = matrix[y][x];
      } else {
        result[cols - 1 - x][y] = matrix[y][x];
      }
    }
  }

  return trimEmptySpace(result);
}

export function cloneMatrix(matrix) {
  return matrix.map((row) => [...row]);
}

function trimEmptySpace(matrix) {
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && matrix[top].every((value) => value === 0)) {
    top += 1;
  }

  while (bottom >= top && matrix[bottom].every((value) => value === 0)) {
    bottom -= 1;
  }

  while (left <= right && matrix.every((row) => row[left] === 0)) {
    left += 1;
  }

  while (right >= left && matrix.every((row) => row[right] === 0)) {
    right -= 1;
  }

  const trimmed = [];
  for (let y = top; y <= bottom; y += 1) {
    const row = [];
    for (let x = left; x <= right; x += 1) {
      row.push(matrix[y][x]);
    }
    trimmed.push(row);
  }

  return trimmed.length > 0 ? trimmed : [[0]];
}
