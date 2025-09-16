# Electron Tetris

A modern Tetris implementation built with Electron and vanilla JavaScript. The game follows familiar mechanics, includes scoring with dynamic speed progression, and adheres to Electron security best practices by isolating renderer logic from the main process.

## Features

- Classic Tetris gameplay with the 7-piece bag randomiser
- Score tracking, line counter, and adaptive level indicator
- Automatic speed progression: each cleared line increases gravity speed by 1%
- Next piece preview, soft drop, hard drop, and pause/resume support
- Responsive layout that adapts to window size while preserving aspect ratio
- Secure Electron configuration with context isolation and a minimal preload bridge

## Project structure

```
├── main.js              # Electron main process
├── preload.js           # Safe bridge between renderer and Electron
├── src/
│   ├── index.html       # Renderer entry point
│   ├── styles.css       # UI styles
│   ├── game/            # Core gameplay logic (board, pieces, game loop)
│   └── renderer/        # Rendering, input handling, and UI bindings
├── package.json         # Scripts and tooling configuration
├── .eslintrc.cjs        # Lint configuration
└── readme.md
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes npm)

### Installation

```bash
npm install
```

### Running in development

```bash
npm start
```

The command launches Electron with live reload provided by Electron itself (restart the app after code changes to refresh logic).

### Linting

```bash
npm run lint
```

### Packaging for distribution

```bash
npm run package
```

The command delegates to `electron-builder` and produces platform-specific artifacts in the `dist/` directory.

## Controls

| Action                        | Key(s)               |
|------------------------------|----------------------|
| Move left / right            | ← / →                |
| Soft drop                    | ↓                    |
| Hard drop                    | Space                |
| Rotate clockwise             | ↑ or X               |
| Rotate counter-clockwise     | Z                    |
| Pause / resume               | P                    |
| Restart                      | R or Restart button  |

## Game mechanics

- The playfield is 10×20 cells.
- The game uses the standard seven-piece bag to prevent streaks of the same tetromino.
- Clearing lines awards points based on the number of lines removed simultaneously and the current level.
- Every cleared line increases the gravity speed by 1% (multiplicative). The UI shows the resulting speed multiplier.
- Level is derived from the number of lines cleared (every 10 lines increases the level indicator).
- Restart resets score, speed, and the bag order.

## Security notes

- Renderer processes run with `contextIsolation: true` and `nodeIntegration: false`.
- Only a minimal `getAppInfo` helper is exposed through the preload script.
- A basic Content Security Policy allows scripts only from the local bundle.

## License

MIT
