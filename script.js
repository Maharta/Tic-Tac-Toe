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
      difficultyPage.classList.remove('invisible');
      difficultyPage.classList.add('fade-in');
    }, fadeOutDuration);
  }

  function startAIEasy() {
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
    playerTurnText.innerHTML = `<strong>${currentPlayer.name}</strong> Turn`;
  }

  function declareWinner(winner, winnerName) {
    const winnerEl = document.querySelector('p.winner');
    winnerEl.classList.remove('invisible');
    winnerEl.classList.add('visible');
    playerTurnText.classList.add('hidden');
    if (winner === 'human') {
      winnerEl.innerHTML = `<strong>${winnerName} wins!</strong>`;
    } else if (winner === 'AI') {
      winnerEl.innerHTML = `<strong>Robots has taken over the world...</strong>`;
    } else {
      winnerEl.innerHTML = `<strong>Draw</strong>`;
    }
  }

  return {
    add,
    addToBoard,
    toggleTurnText,
    declareWinner,
    showAIOptions,
    startAIEasy,
    showBoardPage,
  };
})();

const gameBoard = ((viewController) => {
  const playerOne = playerFactory('Maharta', 'X');
  let playerTwo = playerFactory('Richa', 'O');

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

  function startAIEasy() {
    state.vsAI = 'easy';
    playerTwo = AIFactory('easy');
  }

  function play(row, col) {
    if (state.currentTurn === playerOne) {
      playerOne.play(row, col);
      viewController.toggleTurnText(playerTwo);
      state.currentTurn = playerTwo;
    } else {
      playerTwo.play(row, col);
      viewController.toggleTurnText(playerOne);
      state.currentTurn = playerOne;
    }
  }

  function add(row, col, mark) {
    state.board[row][col] = mark;
    viewController.addToBoard(row, col, mark);
    checkWinner();
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
        viewController.declareWinner(-1);
        state.isFinished = true;
        return;
      }
    }
  }

  return {
    add,
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
    getPossibleMoves,
    startAIEasy,
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

  function play() {
    if (difficulty === 'easy') {
      const possibleMoves = gameBoard.getPossibleMoves();
      const randomMoveToTake =
        possibleMoves[Math.floor(Math.random() * possibleMoves.length)].split(
          ''
        );
      gameBoard.add(+randomMoveToTake[0], +randomMoveToTake[1], mark);
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
        gameBoard.play(row, col);
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
  gameBoard.startAIEasy();
  displayController.startAIEasy();
});
