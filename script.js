const cells = document.querySelectorAll(".cell");
let currentPlayer = "X";
let board = Array(9).fill("");

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const index = cell.getAttribute("data-index");
    if (board[index] || currentPlayer !== "X") return;
    makeMove(index, "X");
    if (checkWinner("X")) return endGame("X");
    currentPlayer = "O";
    setTimeout(aiMove, 1000);
  });
});

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
}

function aiMove() {
  let bestScore = -Infinity, bestMove;
  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = "O";
      const score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) bestScore = score, bestMove = i;
    }
  });
  makeMove(bestMove, "O");
  if (checkWinner("O")) return endGame("O");
  currentPlayer = "X";
}

function minimax(board, depth, isMaximizing) {
  const scores = { X: -1, O: 1, tie: 0 };
  const winner = checkWinner("X") ? "X" : checkWinner("O") ? "O" : null;
  if (winner || !board.includes("")) return scores[winner] ?? scores.tie;

  let bestScore = isMaximizing ? -Infinity : Infinity;
  board.forEach((cell, i) => {
    if (!cell) {
      board[i] = isMaximizing ? "O" : "X";
      const score = minimax(board, depth + 1, !isMaximizing);
      board[i] = "";
      bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);
    }
  });
  return bestScore;
}

function checkWinner(player) {
  return [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ].some(condition => condition.every(index => board[index] === player));
}

function endGame(winner) {
  alert(`${winner} ganhou!`);
  board.fill("");
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = "X";
}