
let puzzle = document.getElementById("puzzle");
let sizeSelector = document.getElementById("size");
let movesDisplay = document.getElementById("moves");
let timerDisplay = document.getElementById("timer");
let winMessage = document.getElementById("win-message");

let clickSound = document.getElementById("clickSound");
let winSound = document.getElementById("winSound");

let size = 3;
let tiles = [];
let emptyIndex = 0;
let moves = 0;
let seconds = 0;
let timerInterval;

function startGame() {
    clearInterval(timerInterval);
    seconds = 0;
    timerDisplay.textContent = "00:00";
    timerInterval = setInterval(updateTimer, 1000);
    moves = 0;
    movesDisplay.textContent = moves;
    size = parseInt(sizeSelector.value);
    puzzle.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    puzzle.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    tiles = [];
    for (let i = 0; i < size * size; i++) {
        tiles.push(i);
    }

    shuffleArray(tiles);
    renderPuzzle();
    winMessage.classList.add("hidden");
    saveGame();
}

function updateTimer() {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, '0');
    const sec = String(seconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
}

function renderPuzzle() {
    puzzle.innerHTML = "";
    tiles.forEach((tile, index) => {
        const div = document.createElement("div");
        div.className = "tile";
        if (tile === 0) {
            div.classList.add("empty");
            emptyIndex = index;
        } else {
            div.textContent = tile;
            div.addEventListener("click", () => moveTile(index));
        }
        puzzle.appendChild(div);
    });
    saveGame();
    checkWin();
}

function moveTile(index) {
    const dx = Math.abs(index % size - emptyIndex % size);
    const dy = Math.abs(Math.floor(index / size) - Math.floor(emptyIndex / size));
    if (dx + dy === 1) {
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        emptyIndex = index;
        moves++;
        movesDisplay.textContent = moves;
        clickSound.play();
        renderPuzzle();
    }
}

function checkWin() {
    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== i + 1) return;
    }
    if (tiles[tiles.length - 1] === 0) {
        clearInterval(timerInterval);
        winMessage.classList.remove("hidden");
        winSound.play();
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function saveGame() {
    localStorage.setItem("tiles", JSON.stringify(tiles));
    localStorage.setItem("size", size);
    localStorage.setItem("moves", moves);
    localStorage.setItem("seconds", seconds);
}

function loadGame() {
    const savedTiles = JSON.parse(localStorage.getItem("tiles"));
    if (!savedTiles) return startGame();

    size = parseInt(localStorage.getItem("size"));
    moves = parseInt(localStorage.getItem("moves"));
    seconds = parseInt(localStorage.getItem("seconds"));
    tiles = savedTiles;
    sizeSelector.value = size;
    puzzle.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    puzzle.style.gridTemplateRows = `repeat(${size}, 1fr)`;
    movesDisplay.textContent = moves;
    timerDisplay.textContent = "00:00";
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    renderPuzzle();
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

window.onload = loadGame;
