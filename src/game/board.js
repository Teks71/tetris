import { BOARD_HEIGHT, BOARD_WIDTH } from './constants.js';

export class Board {
  constructor(width = BOARD_WIDTH, height = BOARD_HEIGHT) {
    this.width = width;
    this.height = height;
    this.grid = this.createEmptyMatrix();
  }

  createEmptyMatrix() {
    return Array.from({ length: this.height }, () => Array(this.width).fill(null));
  }

  reset() {
    this.grid = this.createEmptyMatrix();
  }

  isValidPosition(piece, offsetX = 0, offsetY = 0, matrix = piece.matrix) {
    let isValid = true;

    piece.forEachCell(({ x, y }) => {
      const newX = x + offsetX;
      const newY = y + offsetY;

      if (newX < 0 || newX >= this.width) {
        isValid = false;
        return;
      }

      if (newY >= this.height) {
        isValid = false;
        return;
      }

      if (newY >= 0 && this.grid[newY][newX]) {
        isValid = false;
      }
    }, matrix, piece.position);

    return isValid;
  }

  placePiece(piece) {
    piece.forEachCell(({ x, y, color }) => {
      if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
        this.grid[y][x] = color;
      }
    });
  }

  clearLines() {
    const remainingRows = [];
    let cleared = 0;

    for (let y = 0; y < this.height; y += 1) {
      const isComplete = this.grid[y].every((cell) => cell);
      if (isComplete) {
        cleared += 1;
      } else {
        remainingRows.push(this.grid[y]);
      }
    }

    while (remainingRows.length < this.height) {
      remainingRows.unshift(Array(this.width).fill(null));
    }

    this.grid = remainingRows;
    return cleared;
  }

  getGrid() {
    return this.grid;
  }
}
