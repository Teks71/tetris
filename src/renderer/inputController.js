export class InputController {
  constructor(actions) {
    this.actions = actions;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.pressedKeys = new Set();

    this.preventDefaults = new Set([
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Space'
    ]);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  detach() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown(event) {
    const { code } = event;

    if (this.preventDefaults.has(code)) {
      event.preventDefault();
    }

    if (this.pressedKeys.has(code) && !event.repeat) {
      return;
    }

    const action = this.getActionForCode(code);
    if (!action) {
      return;
    }

    if (event.repeat && (code === 'KeyP' || code === 'KeyR')) {
      return;
    }

    this.pressedKeys.add(code);
    action();
  }

  handleKeyUp(event) {
    this.pressedKeys.delete(event.code);
  }

  getActionForCode(code) {
    switch (code) {
      case 'ArrowLeft':
        return this.actions.moveLeft;
      case 'ArrowRight':
        return this.actions.moveRight;
      case 'ArrowDown':
        return this.actions.softDrop;
      case 'ArrowUp':
      case 'KeyX':
        return this.actions.rotateClockwise;
      case 'KeyZ':
        return this.actions.rotateCounterClockwise;
      case 'Space':
        return this.actions.hardDrop;
      case 'KeyP':
        return this.actions.togglePause;
      case 'KeyR':
        return this.actions.restart;
      default:
        return undefined;
    }
  }
}
