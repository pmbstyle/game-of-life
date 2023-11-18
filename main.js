const gridSize = 50;
const cellSize = 10;
let grid = createEmptyGrid(gridSize);
let gameStarted = false;
let gameInterval;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');

canvas.addEventListener('mousedown', function(e) {
    if (gameStarted) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    grid[y][x] = !grid[y][x];
    drawCell(x, y, grid[y][x]);
});

startButton.addEventListener('click', function() {
    if (!gameStarted) {
        gameStarted = true;
        startGame();
    }
});

restartButton.addEventListener('click', function() {
    gameStarted = false;
    clearInterval(gameInterval);
    grid = createEmptyGrid(gridSize);
    render(grid);
});

function createEmptyGrid(size) {
    return Array.from({ length: size }, () => Array(size).fill(false));
}

function drawCell(x, y, alive) {
    ctx.fillStyle = alive ? 'black' : 'white';
    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
}

function render(grid) {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            drawCell(x, y, grid[y][x]);
        }
    }
}

function countNeighbors(grid, x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const xi = (x + i + gridSize) % gridSize;
            const yj = (y + j + gridSize) % gridSize;
            count += grid[yj][xi] ? 1 : 0;
        }
    }
    return count;
}

function nextGeneration(grid) {
    const newGrid = createEmptyGrid(gridSize);
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
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
    gameInterval = setInterval(update, 1000);
}

// Initial render of the empty grid
render(grid);
