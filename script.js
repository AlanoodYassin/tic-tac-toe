const Gameboard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell(i, j)); // Pass row and column
    }
  }

  const getBoard = () => board;

  return { getBoard };
})();

const soundController = (function () {
  const clickSound = new Audio("./assets/popSound.mp3");
  const backgroundMusic = new Audio("./assets/gameSoundTrack.mp3");

  backgroundMusic.loop = true;

  const playGameTrack = () => backgroundMusic.play();
  const playClick = () => clickSound.play();
  const stopMusic = () => {};
  return { playGameTrack, playClick, stopMusic };
})();

function Cell(rowIndex, columnIndex) {
  let value = null;
  let position = { rowIndex, columnIndex };

  // we get player token from playround
  const updateValue = (playerToken) => {
    value = playerToken;
  };
  const getValue = () => value;
  const getPosition = () => position;

  return { updateValue, getValue, getPosition };
}

const Gamecontroller = function (selectedTokens) {
  const board = Gameboard.getBoard();
  let gameOver = false;

  const getGameOver = () => gameOver;

  const players = [
    { name: "Player 1", token: selectedTokens[0] },
    { name: "Player 2", token: selectedTokens[1] },
  ];

  let activePlayer = players[0];
  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const checkWin = (board) => {
    for (let i = 0; i < 3; i++) {
      const r0 = board[i][0].getValue();
      const r1 = board[i][1].getValue();
      const r2 = board[i][2].getValue();

      if (r0 && r1 && r2 && r0.name === r1.name && r1.name === r2.name) {
        gameOver = true;
        return r0;
      }

      const c0 = board[0][i].getValue();
      const c1 = board[1][i].getValue();
      const c2 = board[2][i].getValue();

      if (c0 && c1 && c2 && c0.name === c1.name && c1.name === c2.name) {
        gameOver = true;
        return c0;
      }
    }

    // Diagonals
    const d1 = board[0][0].getValue();
    const d2 = board[1][1].getValue();
    const d3 = board[2][2].getValue();
    if (d1 && d2 && d3 && d1.name === d2.name && d2.name === d3.name) {
      gameOver = true;
      return d1;
    }

    const a1 = board[0][2].getValue();
    const a2 = board[1][1].getValue();
    const a3 = board[2][0].getValue();
    if (a1 && a2 && a3 && a1.name === a2.name && a2.name === a3.name) {
      gameOver = true;
      return a1;
    }

    return null;
  };

  const checkDraw = (board) => {
    for (let row of board) {
      for (let cell of row) {
        if (cell.getValue() === null) return false;
      }
    }
    gameOver = true;
    return true;
  };

  let winner = null;
  let isDraw = false;

  const playRound = (row, column) => {
    if (gameOver) return;

    const cell = board[row][column];
    if (cell.getValue() !== null) return;

    cell.updateValue(getActivePlayer().token);

    const winningToken = checkWin(board);
    if (winningToken) {
      winner = players.find((p) => p.token.name === winningToken.name);
      gameOver = true;
      return;
    }

    if (checkDraw(board)) {
      isDraw = true;
      gameOver = true;
      return;
    }

    switchPlayerTurn();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: () => board,
    getGameOver,
    getWinner: () => winner,
    isDraw: () => isDraw,
  };
};

const screencontroller = (function () {
  let selectedTokens = [];
  let currentSelectingPlayer = 1; // Player 1 starts
  let game = null; // will create later

  window.onload = function () {
    const body = document.querySelector("body");

    // Create and add game status heading
    const statusHeading = document.createElement("h1");
    statusHeading.classList.add("gamestatus");

    const playerTokens = [
      { name: "banana", image: "./assets/banana.png" },
      { name: "blueberry", image: "./assets/blueberry.png" },
      { name: "butter", image: "./assets/butter.png" },
      { name: "cream", image: "./assets/cream.png" },
      { name: "kiwi", image: "./assets/kiwi.png" },
      { name: "pinapple", image: "./assets/pinapple.png" },
      { name: "strawberry", image: "./assets/strawberry.png" },
    ];

    renderTokenPreviews(playerTokens);

    const startButton = document.querySelector(".start-button");
    const homescreen = document.querySelector(".homescreen");

    const updateGameStatus = () => {
      if (game.getGameOver()) {
        const winner = game.getWinner();
        statusHeading.textContent = winner
          ? `${winner.name} Wins!`
          : "It's a Draw!";
      } else {
        statusHeading.textContent = `${game.getActivePlayer().name}'s Turn`;
      }
    };

    startButton.addEventListener("click", () => {
      const messageBox = document.querySelector(".message-box");
      if (selectedTokens.length < 2) {
        messageBox.textContent = "Please select tokens for both players.";
        return;
      }

      messageBox.textContent = ""; // clear message
      homescreen.remove();
      game = Gamecontroller(selectedTokens);
      renderInitialBoard(game.getBoard());
      updateGameStatus();
    });

    function renderTokenPreviews(tokens) {
      const menubar = document.querySelector(".menubar");
      const messageBox = document.querySelector(".message-box"); // get message box
      messageBox.textContent = "Player 1, pick your token";

      tokens.forEach((token) => {
        const cell = document.createElement("div");
        cell.classList.add("preview-cell");

        const base = document.createElement("img");
        base.src = "./assets/cell.png";
        base.classList.add("base");

        const topping = document.createElement("img");
        topping.src = token.image;
        topping.classList.add("topping");

        const label = document.createElement("div");
        label.classList.add("token-label");
        label.textContent = token.name;

        cell.appendChild(base);
        cell.appendChild(topping);
        cell.appendChild(label);

        cell.addEventListener("click", () => {
          if (
            selectedTokens.find((t) => t.name === token.name) ||
            selectedTokens.length >= 2
          )
            return; // already taken or already selected 2

          cell.classList.add("selected");
          selectedTokens.push(token);

          if (selectedTokens.length === 1) {
            messageBox.textContent = "Player 2, pick your token";
            currentSelectingPlayer = 2;
          } else if (selectedTokens.length === 2) {
            messageBox.textContent = "Both players selected. Start the game!";
          }
        });

        menubar.appendChild(cell);
      });
    }

    function renderInitialBoard(board) {
      const body = document.querySelector("body");

      const gameScreen = document.createElement("div");
      gameScreen.classList.add("gameScreen");
      body.appendChild(gameScreen);

      const Header = document.createElement("div");
      Header.classList.add("gameHeader");
      gameScreen.appendChild(Header);

      const logo = document.createElement("img");
      logo.src = "./assets/Title.png";
      logo.classList.add("gamelogo");

      const resetButton = document.createElement("img");
      resetButton.src = "./assets/restart.png";
      resetButton.classList.add("resetButton");

      resetButton.addEventListener("click", () => {
  // Reset all cell values in the existing board
  const board = game.getBoard();
  board.forEach(row => {
    row.forEach(cell => {
      cell.updateValue(null); // this clears the cell value
    });
  });

  // Remove any existing toppings in the UI
  const toppingImgs = document.querySelectorAll(".cell img.topping");
  toppingImgs.forEach(img => img.remove());

  // Reset game controller logic
  game = Gamecontroller(selectedTokens);

  // Reset status heading to player 1's turn
  updateGameStatus();
});




      Header.appendChild(logo);

      const picnicscene = document.createElement("div");
      picnicscene.style.backgroundImage = "url('./assets/picnic-scene.png')";
      picnicscene.classList.add("gamescene");
      gameScreen.appendChild(picnicscene);

      const footer = document.createElement("div");
      footer.classList.add("footer");

      footer.appendChild(statusHeading);
      footer.appendChild(resetButton);
      gameScreen.appendChild(footer);

      const gameboardDiv = document.createElement("div");
      gameboardDiv.classList.add("gameboard");
      picnicscene.appendChild(gameboardDiv);

      gameboardDiv.innerHTML = "";
      board.forEach((row, rowIndex) => {
        row.forEach((cell, columnIndex) => {
          const cellDiv = document.createElement("div");
          cellDiv.classList.add("cell");
          cellDiv.dataset.row = rowIndex;
          cellDiv.dataset.column = columnIndex;

          const img = document.createElement("img");
          img.classList.add("base");
          img.src = "./assets/cell.png";

          cellDiv.appendChild(img);
          gameboardDiv.appendChild(cellDiv);
        });
      });

      soundController.playGameTrack();
      gameboardDiv.addEventListener("click", handleCellClick);
    }

    function handleCellClick(e) {
      const cellDiv = e.target.closest(".cell");
      if (!cellDiv || !game) return;

      const row = parseInt(cellDiv.dataset.row);
      const column = parseInt(cellDiv.dataset.column);

      const currentPlayer = game.getActivePlayer();
      const cellObj = game.getBoard()[row][column];

      if (cellObj.getValue() !== null || game.getGameOver()) return;

      game.playRound(row, column);
      soundController.playClick();
      updateCellUI(row, column, currentPlayer.token.image);
      updateGameStatus();
    }

    function updateCellUI(row, column, tokenImage) {
      const cellDiv = document.querySelector(
        `.cell[data-row="${row}"][data-column="${column}"]`
      );

      const existing = cellDiv.querySelector("img.topping");
      if (existing) return;

      const toppingImg = document.createElement("img");
      toppingImg.src = tokenImage;
      toppingImg.classList.add("topping");
      toppingImg.style.position = "absolute";
      toppingImg.style.top = "0";
      toppingImg.style.left = "0";
      toppingImg.style.width = "100%";

      cellDiv.appendChild(toppingImg);
    }
  };
})();
