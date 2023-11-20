const cellSize = 10; // You can adjust the cell size
let gridWidth, gridHeight;
let grid;
let gameStarted = false;
let gameInterval;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

window.addEventListener('resize', resizeAndResetCanvas);
canvas.addEventListener('mousedown', handleCanvasClick);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

document.getElementById('startPlacing').addEventListener('click', startPlacingCells);

function createEmptyGrid(width, height) {
    return Array.from({ length: height }, () => Array(width).fill(false));
}

function resizeAndResetCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gridWidth = Math.floor(canvas.width / cellSize);
    gridHeight = Math.floor(canvas.height / cellSize);
    grid = createEmptyGrid(gridWidth, gridHeight);
    render(grid);
}

function handleCanvasClick(e) {
  if (gameStarted) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;    // the scale factor for X
  const scaleY = canvas.height / rect.height;  // the scale factor for Y

  const x = Math.floor((e.clientX - rect.left) * scaleX / cellSize);
  const y = Math.floor((e.clientY - rect.top) * scaleY / cellSize);

  if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
      grid[y][x] = !grid[y][x];
      drawCell(x, y, grid[y][x]);
  }
}

function drawCell(x, y, alive) {
    ctx.fillStyle = alive ? 'black' : 'white';
    ctx.fillRect(
        x * cellSize + 1, // Add 1px for the left margin
        y * cellSize + 1, // Add 1px for the top margin
        cellSize - 2,     // Subtract 2px to compensate for left and right margins
        cellSize - 2      // Subtract 2px to compensate for top and bottom margins
    );
}

function render(grid) {
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            drawCell(x, y, grid[y][x]);
        }
    }
}

function countNeighbors(grid, x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const xi = (x + i + gridWidth) % gridWidth;
            const yj = (y + j + gridHeight) % gridHeight;
            count += grid[yj][xi] ? 1 : 0;
        }
    }
    return count;
}

function nextGeneration(grid) {
    const newGrid = createEmptyGrid(gridWidth, gridHeight);
    for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
            const neighbors = countNeighbors(grid, x, y);
            newGrid[y][x] = (grid[y][x] && neighbors === 2) || neighbors === 3;
        }
    }
    return newGrid;
}

function update() {
    grid = nextGeneration(grid);
    render(grid);
}

function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        gameInterval = setInterval(update, 100);
    }
}

function restartGame() {
    gameStarted = false;
    clearInterval(gameInterval);
    resizeAndResetCanvas();
}

function startPlacingCells() {
    document.querySelector('.rules').classList.add('hidden');
}

// Initial setup
resizeAndResetCanvas();
