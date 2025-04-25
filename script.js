let size = 3;
let board = [];
let empty = { x: 0, y: 0 };
let moves = 0;
let timer;
let seconds = 0;

document.getElementById("size").addEventListener("change", (e) => {
  size = parseInt(e.target.value);
});

function startGame() {
  clearInterval(timer);
  seconds = 0;
  moves = 0;
  document.getElementById("moves").textContent = "0";
  document.getElementById("timer").textContent = "00:00";
  createBoard();
  timer = setInterval(updateTimer, 1000);
}

function createBoard() {
  const total = size * size;
  let numbers = [...Array(total).keys()].slice(1);
  numbers.push(0);
  do {
    shuffle(numbers);
  } while (!isSolvable(numbers));

  board = [];
  const boardElement = document.getElementById("board");
  boardElement.innerHTML = "";
  boardElement.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      const value = numbers[i * size + j];
      board[i][j] = value;
      const tile = document.createElement("div");
      tile.className = value ? "tile" : "tile empty";
      tile.textContent = value || "";
      tile.addEventListener("click", () => moveTile(i, j));
      boardElement.appendChild(tile);
      if (value === 0) {
        empty = { x: i, y: j };
      }
    }
  }
}

function moveTile(x, y) {
  if (Math.abs(empty.x - x) + Math.abs(empty.y - y) === 1) {
    board[empty.x][empty.y] = board[x][y];
    board[x][y] = 0;
    empty = { x, y };
    moves++;
    document.getElementById("moves").textContent = moves;
    updateBoard();
    if (isComplete()) {
      clearInterval(timer);
      alert("Você venceu!");
      saveRanking();
      updateRanking();
    }
  }
}

function updateBoard() {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile, index) => {
    const i = Math.floor(index / size);
    const j = index % size;
    const value = board[i][j];
    tile.className = value ? "tile" : "tile empty";
    tile.textContent = value || "";
  });
}

function isComplete() {
  let count = 1;
  for (let i = 0; i < size; i++)
    for (let j = 0; j < size; j++) {
      if (i === size - 1 && j === size - 1) return board[i][j] === 0;
      if (board[i][j] !== count++) return false;
    }
  return true;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function isSolvable(arr) {
  let inv = 0;
  for (let i = 0; i < arr.length - 1; i++)
    for (let j = i + 1; j < arr.length; j++)
      if (arr[i] && arr[j] && arr[i] > arr[j]) inv++;
  if (size % 2 === 1) return inv % 2 === 0;
  const row = Math.floor(arr.indexOf(0) / size);
  return (inv + row) % 2 === 1;
}

function updateTimer() {
  seconds++;
  const min = String(Math.floor(seconds / 60)).padStart(2, "0");
  const sec = String(seconds % 60).padStart(2, "0");
  document.getElementById("timer").textContent = `${min}:${sec}`;
}

function saveRanking() {
  const rank = JSON.parse(localStorage.getItem("ranking")) || [];
  rank.push({ moves, time: document.getElementById("timer").textContent });
  rank.sort((a, b) => a.moves - b.moves);
  localStorage.setItem("ranking", JSON.stringify(rank.slice(0, 10)));
}

function updateRanking() {
  const list = document.getElementById("rankingList");
  list.innerHTML = "";
  const rank = JSON.parse(localStorage.getItem("ranking")) || [];
  rank.forEach(r => {
    const item = document.createElement("li");
    item.textContent = `${r.moves} movimentos - ${r.time}`;
    list.appendChild(item);
  });
}

window.onload = () => {
  updateRanking();
  startGame();
};