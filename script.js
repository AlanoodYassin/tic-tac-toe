const Gameboard = (function () {
    const rows = 3;
    const columns = 3;
    let board = [];
  
    const initialize = () => {
      board = [];
      for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i][j] = '';
        }
      }
    };
  
    const getBoard = () => board;
  
    const setCell = (row, column, player) => {
      if (row >= 0 && row < rows && column >= 0 && column < columns && board[row][column] === '') {
        board[row][column] = player.symbol;
        return true;
      }
      return false;
    };
  
    const resetBoard = () => {
      initialize();
    };
  
    // initialize on module load
    initialize();
  
    return {
      getBoard,
      setCell,
      resetBoard
    };
  })();
  

const Gamecontroller = function (playerOneName = "Player One", playerTwoName = "Player Two") {
    const board = Gameboard();

    const players = [
        { name: playerOneName, symbol: "X" },
        { name: playerTwoName, symbol: "O" }
    ];

    let activePlayer = players[0];
    let gameOver = false;

    const getActivePlayer = () => activePlayer;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`It's now ${activePlayer.name}'s turn`);
    };

    const checkWin = () => {
        const b = board.getBoard();

        // Rows and Columns
        for (let i = 0; i < 3; i++) {
            if (b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2])
                return b[i][0];
            if (b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i])
                return b[0][i];
        }

        // Diagonals
        if (b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2])
            return b[0][0];
        if (b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0])
            return b[0][2];

        return null;
    };

    const checkDraw = () => {
        return board.getBoard().flat().every(cell => cell !== '');
    };

    const playRound = (row, column) => {
        if (gameOver) {
            console.log("Game over. Please reset to play again.");
            return;
        }

        const moveSuccessful = board.setCell(row, column, activePlayer);
        if (!moveSuccessful) {
            console.log("Invalid move! Try again.");
            return;
        }

        board.printBoard();

        const winnerSymbol = checkWin();
        if (winnerSymbol) {
            const winner = players.find(p => p.symbol === winnerSymbol);
            console.log(`${winner.name} (${winner.symbol}) wins!`);
            gameOver = true;
            return;
        }

        if (checkDraw()) {
            console.log("It's a draw!");
            gameOver = true;
            return;
        }

        switchPlayerTurn();
    };

    const startGame = () => {
        board.resetBoard();
        board.printBoard();
        activePlayer = players[0];
        gameOver = false;
        console.log("Game started!");
        console.log(`${activePlayer.name}'s turn`);
    };

    const resetGame = () => {
        startGame();
    };

    return {
        startGame,
        playRound,
        getActivePlayer,
        resetGame
    };
};




