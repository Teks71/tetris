import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  HARD_DROP_REWARD,
  INITIAL_DROP_INTERVAL,
  MIN_DROP_INTERVAL,
  SCORE_TABLE,
  SPEED_INCREASE_FACTOR,
  SOFT_DROP_REWARD,
  TETROMINOES
} from './constants.js';
import { Board } from './board.js';
import { Piece } from './piece.js';
import { RandomBag } from './randomBag.js';

export class Game {
  constructor() {
    this.board = new Board(BOARD_WIDTH, BOARD_HEIGHT);
    this.randomBag = new RandomBag();
    this.status = 'ready';
    this.score = 0;
    this.lines = 0;
    this.speedMultiplier = 1;
    this.dropInterval = INITIAL_DROP_INTERVAL;
    this.dropAccumulator = 0;
    this.currentPiece = null;
    this.nextPiece = null;
  }

  start() {
    this.board.reset();
    this.randomBag = new RandomBag();
    this.status = 'running';
    this.score = 0;
    this.lines = 0;
    this.speedMultiplier = 1;
    this.dropInterval = INITIAL_DROP_INTERVAL;
    this.dropAccumulator = 0;
    this.currentPiece = null;
    this.nextPiece = this.createPiece(this.randomBag.take());
    this.spawnPiece();
  }

  restart() {
    this.start();
  }

  togglePause() {
    if (this.status === 'running') {
      this.status = 'paused';
    } else if (this.status === 'paused') {
      this.status = 'running';
    }
  }

  update(delta) {
    if (this.status !== 'running') {
      return false;
    }

    this.dropAccumulator += delta;
    let stateChanged = false;

    while (this.dropAccumulator >= this.dropInterval) {
      this.dropAccumulator -= this.dropInterval;
      const moved = this.tryMove(0, 1);
      if (!moved) {
        this.lockPiece();
      }
      stateChanged = true;

      if (this.status !== 'running') {
        break;
      }
    }

    return stateChanged;
  }

  moveHorizontal(direction) {
    if (this.status !== 'running') {
      return;
    }

    this.tryMove(direction, 0);
  }

  softDrop() {
    if (this.status !== 'running') {
      return;
    }

    const moved = this.tryMove(0, 1);
    if (moved) {
      this.score += SOFT_DROP_REWARD;
      this.dropAccumulator = 0;
    } else {
      this.lockPiece();
    }
  }

  hardDrop() {
    if (this.status !== 'running') {
      return;
    }

    let distance = 0;
    while (this.tryMove(0, 1)) {
      distance += 1;
    }

    if (distance > 0) {
      this.score += distance * HARD_DROP_REWARD;
    }

    this.lockPiece();
  }

  rotateClockwise() {
    this.rotate(1);
  }

  rotateCounterClockwise() {
    this.rotate(-1);
  }

  rotate(direction) {
    if (this.status !== 'running' || !this.currentPiece) {
      return;
    }

    const rotated = this.currentPiece.rotated(direction);
    const kicks = [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -2, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: -1 }
    ];

    for (const kick of kicks) {
      rotated.setPosition(
        this.currentPiece.position.x + kick.x,
        this.currentPiece.position.y + kick.y
      );
      if (this.board.isValidPosition(rotated)) {
        this.currentPiece = rotated;
        return;
      }
    }
  }

  getSnapshot() {
    return {
      board: this.board.getGrid(),
      piece: this.currentPiece ? this.currentPiece.clone() : null,
      nextPiece: this.nextPiece ? this.nextPiece.clone() : null
    };
  }

  getStats() {
    const level = Math.floor(this.lines / 10) + 1;
    return {
      score: this.score,
      lines: this.lines,
      level,
      speedMultiplier: this.speedMultiplier,
      dropInterval: this.dropInterval,
      status: this.status
    };
  }

  createPiece(type) {
    const blueprint = TETROMINOES[type];
    return new Piece(type, blueprint.shape, blueprint.color);
  }

  spawnPiece() {
    this.currentPiece = this.nextPiece ?? this.createPiece(this.randomBag.take());
    this.currentPiece.setPosition(
      Math.floor((this.board.width - this.currentPiece.matrix[0].length) / 2),
      -this.currentPiece.matrix.length
    );

    const nextType = this.randomBag.take();
    this.nextPiece = this.createPiece(nextType);

    if (!this.board.isValidPosition(this.currentPiece)) {
      this.status = 'over';
    }
  }

  tryMove(deltaX, deltaY) {
    if (!this.currentPiece) {
      return false;
    }

    const clone = this.currentPiece.clone();
    clone.move(deltaX, deltaY);

    if (this.board.isValidPosition(clone)) {
      this.currentPiece = clone;
      return true;
    }

    return false;
  }

  lockPiece() {
    if (!this.currentPiece) {
      return;
    }

    this.board.placePiece(this.currentPiece);
    const cleared = this.board.clearLines();

    if (cleared > 0) {
      this.lines += cleared;
      const reward = SCORE_TABLE[cleared] ?? 0;
      const level = Math.floor(this.lines / 10) + 1;
      this.score += reward * level;
      this.speedMultiplier *= SPEED_INCREASE_FACTOR ** cleared;
      const proposedInterval = INITIAL_DROP_INTERVAL / this.speedMultiplier;
      this.dropInterval = Math.max(MIN_DROP_INTERVAL, Math.round(proposedInterval));
    }

    this.dropAccumulator = 0;
    this.spawnPiece();
  }
}
