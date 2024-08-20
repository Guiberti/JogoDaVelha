const cells = document.querySelectorAll(".cell");
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];

cells.forEach((cell) => {
  cell.addEventListener("click", () => {
    const index = cell.getAttribute("data-index");
    if (board[index] === "" && currentPlayer === "X") {
      board[index] = currentPlayer;
      cell.textContent = currentPlayer;
      if (checkWinner(currentPlayer)) {
        alert(`${currentPlayer} ganhou!`);
        resetGame();
      } else {
        currentPlayer = "O";
        aiMove();
      }
    }
  });
});

function aiMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O";
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  if (bestMove !== undefined) {
    board[bestMove] = "O";
    cells[bestMove].textContent = "O";
    if (checkWinner("O")) {
      alert("O ganhou!");
      resetGame();
    } else {
      currentPlayer = "X";
    }
  }
}

function minimax(board, depth, isMaximizing) {
  const scores = {
    X: -1,
    O: 1,
    tie: 0,
  };

  const winner = checkWinner("X") ? "X" : checkWinner("O") ? "O" : null;
  if (winner) {
    return scores[winner];
  }

  if (!board.includes("")) {
    return scores["tie"];
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(player) {
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winConditions.some((condition) => {
    return condition.every((index) => {
      return board[index] === player;
    });
  });
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach((cell) => {
    cell.textContent = "";
  });
  currentPlayer = "X";
}
