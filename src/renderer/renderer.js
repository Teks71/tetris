import { BOARD_HEIGHT, BOARD_WIDTH } from '../game/constants.js';

export class CanvasRenderer {
  constructor(playfieldCanvas, nextCanvas) {
    this.playfieldCanvas = playfieldCanvas;
    this.playfieldContext = playfieldCanvas.getContext('2d');
    this.nextCanvas = nextCanvas;
    this.nextContext = nextCanvas.getContext('2d');
    this.boardWidth = BOARD_WIDTH;
    this.boardHeight = BOARD_HEIGHT;
    this.playfieldCellSize = 0;
    this.nextCellSize = 0;

    this.colors = {
      background: 'rgba(2, 6, 23, 0.85)',
      grid: 'rgba(148, 163, 184, 0.15)',
      ghost: 'rgba(148, 163, 184, 0.35)'
    };

    this.handleResize = this.handleResize.bind(this);
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  dispose() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.configureCanvas(
      this.playfieldCanvas,
      this.playfieldContext,
      this.boardWidth,
      this.boardHeight,
      (size) => {
        this.playfieldCellSize = size;
      }
    );
    this.configureCanvas(
      this.nextCanvas,
      this.nextContext,
      6,
      6,
      (size) => {
        this.nextCellSize = size;
      }
    );
  }

  configureCanvas(canvas, context, cols, rows, onCellSize) {
    if (!canvas || !context) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;

    canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
    canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(dpr, dpr);

    const cellSize = Math.min(cssWidth / cols, cssHeight / rows);
    onCellSize(cellSize);
  }

  render({ board, piece, nextPiece }) {
    this.drawPlayfield(board, piece);
    this.drawNextPiece(nextPiece);
  }

  drawPlayfield(board, piece) {
    const context = this.playfieldContext;
    const width = this.playfieldCanvas.clientWidth;
    const height = this.playfieldCanvas.clientHeight;

    context.clearRect(0, 0, width, height);
    context.fillStyle = this.colors.background;
    context.fillRect(0, 0, width, height);

    this.drawGrid(context, width, height, this.playfieldCellSize);

    if (board) {
      for (let y = 0; y < board.length; y += 1) {
        for (let x = 0; x < board[y].length; x += 1) {
          const color = board[y][x];
          if (color) {
            this.drawCell(context, x, y, color, this.playfieldCellSize);
          }
        }
      }
    }

    if (piece) {
      const ghostCells = this.computeGhostCells(board, piece);
      if (ghostCells.length > 0) {
        context.save();
        context.globalAlpha = 0.35;
        for (const cell of ghostCells) {
          if (cell.y >= 0) {
            this.drawCell(context, cell.x, cell.y, this.colors.ghost, this.playfieldCellSize, true);
          }
        }
        context.restore();
      }

      piece.forEachCell(({ x, y, color }) => {
        if (y >= 0) {
          this.drawCell(context, x, y, color, this.playfieldCellSize);
        }
      });
    }
  }

  drawNextPiece(nextPiece) {
    const context = this.nextContext;
    const width = this.nextCanvas.clientWidth;
    const height = this.nextCanvas.clientHeight;
    context.clearRect(0, 0, width, height);

    context.fillStyle = this.colors.background;
    context.fillRect(0, 0, width, height);

    this.drawGrid(context, width, height, this.nextCellSize);

    if (!nextPiece) {
      return;
    }

    const matrix = nextPiece.matrix;
    const offsetX = Math.floor((6 - matrix[0].length) / 2);
    const offsetY = Math.floor((6 - matrix.length) / 2);

    nextPiece.forEachCell(({ x, y, color }) => {
      const drawX = x - nextPiece.position.x + offsetX;
      const drawY = y - nextPiece.position.y + offsetY;
      this.drawCell(context, drawX, drawY, color, this.nextCellSize);
    }, matrix, { x: 0, y: 0 });
  }

  drawGrid(context, width, height, cellSize) {
    if (!cellSize) {
      return;
    }

    context.save();
    context.strokeStyle = this.colors.grid;
    context.lineWidth = 1;

    for (let x = 0; x <= width; x += cellSize) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += cellSize) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    context.restore();
  }

  drawCell(context, x, y, color, cellSize, isGhost = false) {
    const padding = Math.max(1, cellSize * 0.08);
    const drawX = x * cellSize + padding;
    const drawY = y * cellSize + padding;
    const size = cellSize - padding * 2;

    context.save();
    context.fillStyle = isGhost ? color : this.createCellGradient(context, drawX, drawY, size, color);
    context.fillRect(drawX, drawY, size, size);
    if (!isGhost) {
      context.strokeStyle = 'rgba(15, 23, 42, 0.6)';
      context.strokeRect(drawX, drawY, size, size);
    }
    context.restore();
  }

  createCellGradient(context, x, y, size, baseColor) {
    const gradient = context.createLinearGradient(x, y, x + size, y + size);
    gradient.addColorStop(0, lighten(baseColor, 0.2));
    gradient.addColorStop(0.5, baseColor);
    gradient.addColorStop(1, lighten(baseColor, -0.15));
    return gradient;
  }

  computeGhostCells(board, piece) {
    if (!board) {
      return [];
    }

    const clone = piece.clone();
    while (this.canPlace(board, clone, clone.position.x, clone.position.y + 1)) {
      clone.move(0, 1);
    }

    const cells = [];
    clone.forEachCell(({ x, y }) => {
      cells.push({ x, y });
    });
    return cells;
  }

  canPlace(board, piece, posX, posY) {
    let valid = true;
    piece.forEachCell(({ x, y }) => {
      const targetX = x - piece.position.x + posX;
      const targetY = y - piece.position.y + posY;
      if (targetX < 0 || targetX >= this.boardWidth || targetY >= this.boardHeight) {
        valid = false;
        return;
      }
      if (targetY >= 0 && board[targetY][targetX]) {
        valid = false;
      }
    });
    return valid;
  }
}

function lighten(color, amount) {
  const parsed = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  if (!parsed) {
    return color;
  }

  const [r, g, b] = parsed.slice(1).map((hex) => parseInt(hex, 16));
  const adjust = (channel) => {
    const value = Math.min(255, Math.max(0, Math.round(channel + 255 * amount)));
    return value.toString(16).padStart(2, '0');
  };

  return `#${adjust(r)}${adjust(g)}${adjust(b)}`;
}
