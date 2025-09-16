import { cloneMatrix, rotateMatrix } from './utils.js';

export class Piece {
  constructor(type, matrix, color) {
    this.type = type;
    this.matrix = cloneMatrix(matrix);
    this.color = color;
    this.position = { x: 0, y: 0 };
  }

  clone() {
    const cloned = new Piece(this.type, this.matrix, this.color);
    cloned.position = { ...this.position };
    return cloned;
  }

  setPosition(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  move(deltaX, deltaY) {
    this.position.x += deltaX;
    this.position.y += deltaY;
  }

  rotated(direction = 1) {
    const rotatedMatrix = rotateMatrix(this.matrix, direction);
    const rotatedPiece = new Piece(this.type, rotatedMatrix, this.color);
    rotatedPiece.position = { ...this.position };
    return rotatedPiece;
  }

  applyRotation(direction = 1) {
    this.matrix = rotateMatrix(this.matrix, direction);
  }

  forEachCell(callback, matrix = this.matrix, position = this.position) {
    for (let y = 0; y < matrix.length; y += 1) {
      for (let x = 0; x < matrix[y].length; x += 1) {
        if (matrix[y][x]) {
          callback({
            x: position.x + x,
            y: position.y + y,
            color: this.color
          });
        }
      }
    }
  }
}
