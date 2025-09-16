export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES = {
  I: {
    color: '#00f0f0',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  },
  J: {
    color: '#0000f0',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  L: {
    color: '#f0a000',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  O: {
    color: '#f0f000',
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  S: {
    color: '#00f000',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ]
  },
  T: {
    color: '#a000f0',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ]
  },
  Z: {
    color: '#f00000',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  }
};

export const SCORE_TABLE = {
  0: 0,
  1: 100,
  2: 300,
  3: 500,
  4: 800
};

export const INITIAL_DROP_INTERVAL = 1000;
export const MIN_DROP_INTERVAL = 80;
export const SPEED_INCREASE_FACTOR = 1.01;
export const SOFT_DROP_REWARD = 1;
export const HARD_DROP_REWARD = 2;
