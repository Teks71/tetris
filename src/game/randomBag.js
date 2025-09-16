import { TETROMINOES } from './constants.js';

export class RandomBag {
  constructor() {
    this.bag = [];
    this.refill();
  }

  refill() {
    this.bag = Object.keys(TETROMINOES);
    for (let i = this.bag.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }

  take() {
    if (this.bag.length === 0) {
      this.refill();
    }

    return this.bag.pop();
  }
}
