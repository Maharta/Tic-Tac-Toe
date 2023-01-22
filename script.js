const displayController = (() => {
  const fadeOutDuration = 750; // in ms
  const playerTurnText = document.querySelector('.turn');

  function hideMenuPage() {
    const menuPage = document.querySelector('.menu-page');
    menuPage.classList.add('fade-out');
  }

  function showAIOptions() {
    /* transition page into choose difficulty page */
    hideMenuPage();
    const difficultyPage = document.querySelector('.difficulty.menu-page');
    setTimeout(() => {
      difficultyPage.classList.remove('invisible'); // using setTimeout to work well with css animations.
      difficultyPage.classList.add('fade-in');
    }, fadeOutDuration);
  }

  function startVSAI() {
    const difficultyPage = document.querySelector('.difficulty.menu-page');
    difficultyPage.classList.remove('fade-in');
    difficultyPage.classList.add('fade-out');
    showBoardPage();
  }

  function showBoardPage() {
    hideMenuPage();
    setTimeout(() => {
      const mainPage = document.querySelector('.main-page');
      const board = document.querySelector('.board');
      mainPage.classList.remove('invisible');
      board.classList.remove('invisible');
      mainPage.classList.add('fade-in');
    }, fadeOutDuration);
  }

  function add(element, to) {
    to.appendChild(element);
  }

  function addToBoard(row, col, mark) {
    const blockToAdd = document.querySelector(
      `.block[data-row="${row}"][data-col="${col}"]`
    );
    blockToAdd.innerText = mark;
  }

  function toggleTurnText(currentPlayer) {
    playerTurnText.innerHTML = `${currentPlayer.name} Turn`;
  }

  function declareWinner(winner, winnerName) {
    const winnerEl = document.querySelector('p.winner');
    winnerEl.classList.remove('invisible');
    winnerEl.classList.add('visible');
    playerTurnText.classList.add('hidden');
    if (winner === 'human') {
      winnerEl.innerHTML = `${winnerName} wins!`;
    } else if (winner === 'AI') {
      winnerEl.innerHTML = `Robots has taken over the world...`;
    } else {
      winnerEl.innerHTML = `Draw`;
    }
  }

  return {
    add,
    addToBoard,
    toggleTurnText,
    declareWinner,
    showAIOptions,
    startVSAI,
    showBoardPage,
  };
})();

const gameBoard = ((viewController) => {
  const playerOne = playerFactory('Player 1', 'X');
  let playerTwo = playerFactory('Player 2', 'O'); // use let because playerTwo could change to AI

  const state = {
    board: [
      ['00', '01', '02'],
      ['10', '11', '12'], // Index not filled with 'X' or 'O represents non marked block / cells.
      ['20', '21', '22'],
    ],
    isFinished: false,
    vsAI: false,
    currentTurn: playerOne,
  };

  function startEasyAI() {
    state.vsAI = 'easy';
    playerTwo = AIFactory('easy');
  }

  function startImpossibleAI() {
    state.vsAI = 'impossible';
    playerTwo = AIFactory('impossible');
  }

  function play(row, col) {
    if (state.currentTurn === playerOne) {
      playerOne.play(row, col);
      viewController.toggleTurnText(playerTwo);
      state.currentTurn = playerTwo;
    } else {
      playerTwo.play(row, col); // row and col could be undefined if playerTwo is an AI.
      viewController.toggleTurnText(playerOne);
      state.currentTurn = playerOne;
    }
  }

  function add(row, col, mark) {
    state.board[row][col] = mark;
    viewController.addToBoard(row, col, mark);
    checkWinner();
  }

  function addToState(row, col, mark) {
    state.board[row][col] = mark;
  }

  function removeFromState(row, col) {
    state.board[row][col] = row.toString() + col.toString();
  }

  function getPossibleMoves() {
    /* reduce 2d array into 1d array of possible moves. */
    return state.board.reduce((accumulator, currentRow) => {
      const possibleMoveInRow = currentRow.filter(
        (cell) => cell !== 'X' && cell !== 'O'
      );
      accumulator.push(...possibleMoveInRow);
      return accumulator;
    }, []);
  }

  function checkWinner() {
    let line;
    for (let i = 1; i < 9; i += 1) {
      switch (i) {
        /* 8 ways to win */
        case 1: {
          line = state.board[0][0] + state.board[0][1] + state.board[0][2];
          break;
        }
        case 2: {
          line = state.board[1][0] + state.board[1][1] + state.board[1][2];
          break;
        }
        case 3: {
          line = state.board[2][0] + state.board[2][1] + state.board[2][2];
          break;
        }
        case 4: {
          line = state.board[0][0] + state.board[1][0] + state.board[2][0];
          break;
        }
        case 5: {
          line = state.board[0][1] + state.board[1][1] + state.board[2][1];
          break;
        }
        case 6: {
          line = state.board[0][2] + state.board[1][2] + state.board[2][2];
          break;
        }
        case 7: {
          line = state.board[0][0] + state.board[1][1] + state.board[2][2];
          break;
        }
        case 8: {
          line = state.board[0][2] + state.board[1][1] + state.board[2][0];
          break;
        }
        default: {
          line = '';
          break;
        }
      }

      if (line === 'XXX') {
        viewController.declareWinner('human', playerOne.name);
        state.isFinished = true;
        return;
      }
      if (line === 'OOO') {
        if (state.vsAI) {
          viewController.declareWinner('AI', playerTwo.name);
        } else {
          viewController.declareWinner('human', playerTwo.name);
        }
        state.isFinished = true;
        return;
      }
      if (
        /* last check to find out if it's a draw */
        state.board[0].filter((item) => item === 'O' || item === 'X').length +
          state.board[1].filter((item) => item === 'O' || item === 'X').length +
          state.board[2].filter((item) => item === 'O' || item === 'X')
            .length ===
          9 &&
        i === 8
        /* i === 8 so the algorithm check for every single case before saying it's a draw on the last turn. */
      ) {
        viewController.declareWinner('draw');
        state.isFinished = true;
        return;
      }
    }
  }

  return {
    /* getter to prevent direct manipulation (read only properties) */
    get isFinished() {
      return state.isFinished;
    },
    get vsAI() {
      return state.vsAI;
    },
    get currentTurn() {
      return state.currentTurn;
    },
    get playerOne() {
      return playerOne;
    },
    get playerTwo() {
      return playerTwo;
    },
    get board() {
      return state.board;
    },
    add,
    removeFromState,
    addToState,
    getPossibleMoves,
    startEasyAI,
    startImpossibleAI,
    play,
  };
})(displayController); /* external dependencies is better injected */

function playerFactory(name, mark) {
  function play(row, col) {
    gameBoard.add(row, col, mark);
  }
  return {
    get name() {
      return name;
    },
    mark,
    play,
  };
}

function AIFactory(difficulty) {
  const { name, mark } = playerFactory('Mr.Destructoid', 'O');

  function doBestMove() {
    const bestMove = {
      val: -999,
      row: -1,
      col: -1,
    };
    const possibleMoves = gameBoard.getPossibleMoves();
    possibleMoves.forEach((possibleMove) => {
      const [row, col] = possibleMove.split('').map(Number);
      gameBoard.addToState(row, col, mark);
      const val = minimax(0, false);
      if (val > bestMove.val) {
        bestMove.val = val;
        bestMove.row = row;
        bestMove.col = col;
      }
      gameBoard.removeFromState(row, col);
    });
    gameBoard.add(bestMove.row, bestMove.col, mark);
  }

  function evaluate(board) {
    let line;
    for (let i = 1; i < 9; i += 1) {
      switch (i) {
        /* 8 ways to win */
        case 1: {
          line = board[0][0] + board[0][1] + board[0][2];
          break;
        }
        case 2: {
          line = board[1][0] + board[1][1] + board[1][2];
          break;
        }
        case 3: {
          line = board[2][0] + board[2][1] + board[2][2];
          break;
        }
        case 4: {
          line = board[0][0] + board[1][0] + board[2][0];
          break;
        }
        case 5: {
          line = board[0][1] + board[1][1] + board[2][1];
          break;
        }
        case 6: {
          line = board[0][2] + board[1][2] + board[2][2];
          break;
        }
        case 7: {
          line = board[0][0] + board[1][1] + board[2][2];
          break;
        }
        case 8: {
          line = board[0][2] + board[1][1] + board[2][0];
          break;
        }
        default: {
          line = '';
          break;
        }
      }

      if (line === 'XXX') {
        return -10;
      }
      if (line === 'OOO') {
        return +10;
      }
    }
    return 0;
  }

  function minimax(depth, isMaximizingPlayer) {
    /* depth used for optimizing AI move, AI will try to win ASAP or Prolong the game if isn't possible to win */
    /* 
      Maximizing player should be true when it is the AI Turn (O Mark)
       First value of the isMaximizingPlayer will be false, since the first time it called is on the human or 'X' turn 
    */
    const score = evaluate(gameBoard.board);
    if (score === 10) {
      return score - depth;
    }

    if (score === -10) {
      return score + depth;
    }

    if (gameBoard.getPossibleMoves().length === 0) {
      return score; // score would be 0 here when it's draw.
    }

    const possibleMoves = gameBoard.getPossibleMoves();
    if (isMaximizingPlayer) {
      let max = -999;
      possibleMoves.forEach((possibleMove) => {
        const [row, col] = possibleMove.split('').map(Number);
        gameBoard.addToState(row, col, mark);
        max = Math.max(max, minimax(depth + 1, !isMaximizingPlayer));
        gameBoard.removeFromState(row, col);
      });
      return max;
    }

    // if minimizing player
    let min = 999;
    possibleMoves.forEach((possibleMove) => {
      const [row, col] = possibleMove.split('').map(Number);
      gameBoard.addToState(row, col, 'X');
      min = Math.min(min, minimax(depth + 1, !isMaximizingPlayer));
      gameBoard.removeFromState(row, col);
    });
    return min;
  }

  function doRandomMove() {
    const possibleMoves = gameBoard.getPossibleMoves();
    const randomMoveToTake = possibleMoves[
      Math.floor(Math.random() * possibleMoves.length)
    ]
      .split('')
      .map(Number);
    gameBoard.add(randomMoveToTake[0], randomMoveToTake[1], mark);
  }

  function play() {
    if (difficulty === 'easy') {
      doRandomMove();
    } else {
      /* impossible to beat AI with minimax algorithm */
      doBestMove();
    }
  }

  return { name, mark, play };
}

const blocks = document.querySelectorAll('.block');

blocks.forEach((block) => {
  block.addEventListener('click', (e) => {
    if (
      e.target.childNodes.length > 0 || // prevent overwriting filled block, playing after game ends, and playing while AI turn (AI move after 500ms to simulate thinking)
      gameBoard.isFinished ||
      (gameBoard.currentTurn === gameBoard.playerTwo && gameBoard.vsAI)
    )
      return;
    const row = e.target.getAttribute('data-row');
    const col = e.target.getAttribute('data-col');
    gameBoard.play(row, col);
    if (gameBoard.vsAI && !gameBoard.isFinished) {
      setTimeout(() => {
        gameBoard.play(); // AI play function doesn't need row and col arguments.
      }, 500);
    }
  });
});

const playerVSAIButton = document.querySelector('button[data-id="ai-button"]');
playerVSAIButton.addEventListener('click', () => {
  document
    .querySelector('button[data-id="two-player-button"]') // disable two player button if vs AI is clicked
    .setAttribute('disabled', true);
  displayController.showAIOptions();
});

const playerVSPlayerButton = document.querySelector(
  'button[data-id="two-player-button"]'
);
playerVSPlayerButton.addEventListener('click', () => {
  playerVSAIButton.setAttribute('disabled', true);
  displayController.showBoardPage();
});

const easyButton = document.querySelector('button[data-id="easy-button"]');
easyButton.addEventListener('click', () => {
  gameBoard.startEasyAI();
  displayController.startVSAI();
});

const impossibleButton = document.querySelector(
  'button[data-id="impossible-button"]'
);
impossibleButton.addEventListener('click', () => {
  gameBoard.startImpossibleAI();
  displayController.startVSAI();
});
