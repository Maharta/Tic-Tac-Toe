const displayController = (() => {
  function add(element, to) {
    to.appendChild(element);
  }

  function addToBoard(row, col, mark) {
    const blockToAdd = document.querySelector(
      `.block[data-row="${row}"][data-col="${col}"]`
    );
    blockToAdd.innerText = mark;
  }

  return { add, addToBoard };
})();

const gameBoard = ((viewController) => {
  const state = [[], [], []];

  function add(row, col, mark) {
    state[row][col] = mark;
    viewController.addToBoard(row, col, mark);
  }

  return { add };
})(displayController); /* external dependencies is better injected */

function playerFactory(name, mark) {
  function play(row, col) {
    gameBoard.add(row, col, mark);
  }
  return {
    play,
  };
}

let currentTurn = 1;
const playerOne = playerFactory('Maharta', 'X');
const playerTwo = playerFactory('Richa', 'O');

const blocks = document.querySelectorAll('.block');
const playerTurnText = document.querySelector('.turn');

blocks.forEach((block) => {
  block.addEventListener('click', (e) => {
    if (e.target.childNodes.length > 0) return; // prevent overwriting filled block

    const row = e.target.getAttribute('data-row');
    const col = e.target.getAttribute('data-col');
    if (currentTurn === 1) {
      playerOne.play(row, col);
      currentTurn = 0;
      playerTurnText.innerHTML = '<strong>Player 2</strong> Turn';
    } else {
      playerTwo.play(row, col);
      currentTurn = 1;
      playerTurnText.innerHTML = '<strong>Player 1</strong> Turn';
    }
  });
});
