export class UIController {
  constructor({
    scoreEl,
    linesEl,
    levelEl,
    speedEl,
    statusEl,
    pauseButton,
    versionEl
  }) {
    this.scoreEl = scoreEl;
    this.linesEl = linesEl;
    this.levelEl = levelEl;
    this.speedEl = speedEl;
    this.statusEl = statusEl;
    this.pauseButton = pauseButton;
    this.versionEl = versionEl;
    this.statusClasses = ['status--ready', 'status--running', 'status--paused', 'status--over'];
  }

  updateStats({ score, lines, level, speedMultiplier }) {
    this.scoreEl.textContent = score.toLocaleString();
    this.linesEl.textContent = lines.toString();
    this.levelEl.textContent = level.toString();
    this.speedEl.textContent = `${speedMultiplier.toFixed(2)}×`;
  }

  updateStatus(status) {
    const message = this.getStatusMessage(status);
    this.statusClasses.forEach((cls) => this.statusEl.classList.remove(cls));
    this.statusEl.classList.add(`status--${status}`);
    this.statusEl.textContent = message;

    const isPaused = status === 'paused';
    this.pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    this.pauseButton.setAttribute('aria-pressed', isPaused ? 'true' : 'false');
    this.pauseButton.disabled = status === 'ready' || status === 'over';
  }

  setAppVersion(info) {
    if (!this.versionEl || !info) {
      return;
    }

    const { name, version, platform } = info;
    this.versionEl.textContent = `${name ?? 'App'} v${version ?? '0.0.0'} • ${platform}`;
  }

  getStatusMessage(status) {
    switch (status) {
      case 'running':
        return 'Running';
      case 'paused':
        return 'Paused';
      case 'over':
        return 'Game over';
      case 'ready':
      default:
        return 'Press Restart to begin';
    }
  }
}
