let currentTurn = 1;

const displayController = (() => {
  const playerTurnText = document.querySelector('.turn');

  function showAIOptions() {
    /* transition page into choose difficulty page */
    const menuPage = document.querySelector('.menu-page');
    menuPage.classList.add('fade-out');

    const difficultyPage = document.querySelector('.difficulty.menu-page');
    setTimeout(() => {
      difficultyPage.classList.remove('invisible');
      difficultyPage.classList.add('fade-in');
    }, 750);
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

  function toggleTurn() {
    if (currentTurn === 1) {
      currentTurn = 0;
      playerTurnText.innerHTML = '<strong>Player 2</strong> Turn';
    } else {
      currentTurn = 1;
      playerTurnText.innerHTML = '<strong>Player 1</strong> Turn';
    }
  }

  function declareWinner(winner) {
    const winnerEl = document.querySelector('p.winner');
    winnerEl.classList.add('display');
    playerTurnText.classList.add('hidden');
    if (winner === 1) {
      winnerEl.innerHTML = '<strong>Player 1 Wins!</strong>';
    } else if (winner === 2) {
      winnerEl.innerHTML = '<strong>Player 2 Wins!</strong>';
    } else {
      winnerEl.innerHTML = '<strong>Draw...</strong>';
    }
  }

  return { add, addToBoard, toggleTurn, declareWinner, showAIOptions };
})();

const gameBoard = ((viewController) => {
  const state = {
    board: [[], [], []],
    isFinished: false,
  };

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
        viewController.declareWinner(1);
        state.isFinished = true;
        return;
      }
      if (line === 'OOO') {
        viewController.declareWinner(2);
        state.isFinished = true;
        return;
      }
      if (
        /* last check to find out if it's a draw */
        state.board[0].filter((item) => item !== undefined).length +
          state.board[1].filter((item) => item !== undefined).length +
          state.board[2].filter((item) => item !== undefined).length ===
        9
      ) {
        viewController.declareWinner(-1);
        state.isFinished = true;
        return;
      }
    }
  }

  function add(row, col, mark) {
    state.board[row][col] = mark;
    viewController.addToBoard(row, col, mark);
    checkWinner();
  }

  return {
    add,
    get isFinished() {
      /* getter to prevent direct manipulation */
      return state.isFinished;
    },
  };
})(displayController); /* external dependencies is better injected */

function playerFactory(name, mark) {
  function play(row, col) {
    gameBoard.add(row, col, mark);
  }

  return {
    play,
  };
}

const playerOne = playerFactory('Maharta', 'X');
const playerTwo = playerFactory('Richa', 'O');

const blocks = document.querySelectorAll('.block');

blocks.forEach((block) => {
  block.addEventListener('click', (e) => {
    if (e.target.childNodes.length > 0 || gameBoard.isFinished) return; // prevent overwriting filled block and playing after game ends.
    const row = e.target.getAttribute('data-row');
    const col = e.target.getAttribute('data-col');
    if (currentTurn === 1) {
      playerOne.play(row, col);
    } else {
      playerTwo.play(row, col);
    }
    displayController.toggleTurn();
  });
});

const playVSAIButton = document.querySelector('button[data-id="ai-button"]');
playVSAIButton.addEventListener('click', displayController.showAIOptions);
