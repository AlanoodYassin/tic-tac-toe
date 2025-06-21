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

  return {getBoard};

})();


function Cell(rowIndex, columnIndex) {

    let value = null;
    let position = {rowIndex , columnIndex};

    // we get player token from playround
    const updateValue = (playerToken) => {
        value = playerToken;
    }
    const getValue = () => value;
    const getPosition= ()=> position;
  
    return { updateValue, getValue, getPosition }
  }


const Gamecontroller = function () {
 
 
    const board = Gameboard.getBoard();
    let gameOver = false;

    const getGameOver = () => gameOver;


    const playerTokens =[
    {name: "banana", image:"./assets/banana.png"},
    {name: "blueberry", image:"./assets/blueberry.png"},
    {name: "butter", image:"./assets/butter.png"},
    {name: "cream", image:"./assets/cream.png"},
    {name: "kiwi", image:"./assets/kiwi.png"},
    {name: "pinapple", image:"./assets/pinapple.png"},
    {name: "strawberry", image:"./assets/strawberry.png"}, 
    ];


     const players = [
      { name: "Player One", token: playerTokens[0] },
      { name: "Player Two", token:  playerTokens[6] }
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
      winner = players.find(p => p.token.name === winningToken.name);
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

    const statusHeading = document.querySelector('.gamestatus');


    const game = Gamecontroller();

    const updateGameStatus = () => {
        if (game.getGameOver()) {
          const winner = game.getWinner();
          statusHeading.textContent = winner ? `${winner.name} wins!` : "It's a draw!";
        } else {
          statusHeading.textContent = `${game.getActivePlayer().name}'s turn`;
        }
      };

    function renderInitialBoard(board) {
        const gameboardDiv = document.querySelector('.gameboard');
        gameboardDiv.innerHTML = ''; // clear any existing content
      
        board.forEach((row, rowIndex) => {
          row.forEach((cell, columnIndex) => {
            const cellDiv = document.createElement('div');
            cellDiv.classList.add('cell');
            cellDiv.dataset.row = rowIndex;
            cellDiv.dataset.column = columnIndex;
      
            const img = document.createElement('img');
            img.classList.add('base'); 
            img.src = './assets/cell.png';
      
            cellDiv.appendChild(img);
            gameboardDiv.appendChild(cellDiv);
          });
        });
        gameboardDiv.addEventListener('click', handleCellClick);
      }
      
      updateGameStatus();    
    
      function handleCellClick(e) {
        // nearest ancestor element (or itself) that has the class .cell
        const cellDiv = e.target.closest('.cell');
        if (!cellDiv) return;
    
        const row = parseInt(cellDiv.dataset.row);
        const column = parseInt(cellDiv.dataset.column);
    
        const currentPlayer = game.getActivePlayer();
        const cellObj = game.getBoard()[row][column];
    
        if (cellObj.getValue() !== null || game.getGameOver()) return;
    
        game.playRound(row, column, currentPlayer);
        updateCellUI(row, column, currentPlayer.token.image);
        updateGameStatus();
          }
    
      function updatePlayerTurnDisplay() {
        const activePlayer = game.getActivePlayer();
        playerTurnHeading.textContent = `${activePlayer.name}'s turn`;
    }
      function updateCellUI(row, column, tokenImage) {
        const cellDiv = document.querySelector(`.cell[data-row="${row}"][data-column="${column}"]`);
    
        const existing = cellDiv.querySelector('img.topping');
        if (existing) return;
    
        const toppingImg = document.createElement('img');
        toppingImg.src = tokenImage;
        toppingImg.classList.add('topping');
        toppingImg.style.position = 'absolute';
        toppingImg.style.top = '0';
        toppingImg.style.left = '0';
        toppingImg.style.width = '100%';
    
        cellDiv.appendChild(toppingImg);
      }
    

  
    //const updateTurnMessage()


    //boardDiv.addEventListener('click', clickHandlerBoard);
    renderInitialBoard(game.getBoard()); 


  
})();
