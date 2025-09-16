import { Game } from '../game/game.js';
import { CanvasRenderer } from './renderer.js';
import { UIController } from './uiController.js';
import { InputController } from './inputController.js';

const game = new Game();
let renderer;
let ui;
let input;
let lastStatus = null;
let lastTimestamp = 0;

document.addEventListener('DOMContentLoaded', () => {
  const playfieldCanvas = document.getElementById('playfield');
  const nextCanvas = document.getElementById('next-piece');
  const pauseButton = document.getElementById('pause-button');
  const restartButton = document.getElementById('restart-button');

  ui = new UIController({
    scoreEl: document.getElementById('score-value'),
    linesEl: document.getElementById('lines-value'),
    levelEl: document.getElementById('level-value'),
    speedEl: document.getElementById('speed-value'),
    statusEl: document.getElementById('status-text'),
    pauseButton,
    versionEl: document.getElementById('app-version')
  });

  renderer = new CanvasRenderer(playfieldCanvas, nextCanvas);

  input = new InputController({
    moveLeft: () => game.moveHorizontal(-1),
    moveRight: () => game.moveHorizontal(1),
    softDrop: () => game.softDrop(),
    hardDrop: () => game.hardDrop(),
    rotateClockwise: () => game.rotateClockwise(),
    rotateCounterClockwise: () => game.rotateCounterClockwise(),
    togglePause: () => togglePause(),
    restart: () => restartGame()
  });

  pauseButton.addEventListener('click', () => togglePause());
  restartButton.addEventListener('click', () => restartGame());

  window.addEventListener('beforeunload', () => {
    input.detach();
    renderer.dispose();
  });

  requestAnimationFrame(gameLoop);
  restartGame();
  hydrateVersion();
});

function togglePause() {
  const { status } = game.getStats();
  if (status === 'ready' || status === 'over') {
    return;
  }

  game.togglePause();
  const stats = game.getStats();
  ui.updateStatus(stats.status);
  lastStatus = stats.status;
}

function restartGame() {
  game.restart();
  lastTimestamp = 0;
  const stats = game.getStats();
  ui.updateStats(stats);
  ui.updateStatus(stats.status);
  lastStatus = stats.status;
}

function gameLoop(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
  }
  const delta = timestamp - lastTimestamp;
  lastTimestamp = timestamp;

  game.update(delta);
  renderer.render(game.getSnapshot());

  const stats = game.getStats();
  ui.updateStats(stats);
  if (stats.status !== lastStatus) {
    ui.updateStatus(stats.status);
    lastStatus = stats.status;
  }

  requestAnimationFrame(gameLoop);
}

async function hydrateVersion() {
  if (window?.electronAPI?.getAppInfo) {
    try {
      const info = await window.electronAPI.getAppInfo();
      ui.setAppVersion(info);
      return;
    } catch (error) {
      console.error('Failed to retrieve app info', error);
    }
  }

  ui.setAppVersion({
    name: 'Electron Tetris',
    version: 'development',
    platform: navigator.platform
  });
}
