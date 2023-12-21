// Создаем объект игрока с именем и маркером
const PlayerFactory = (name, marker) => {
  let moves = [];
  let winner = false;

  return {
      name,
      marker,
      moves,
      winner
  };
};

const gameBoard = (() => {
// Содержимое ячеек игрового поля
  const boxContent = [
      '', '', '',
      '', '', '',
      '', '', ''
  ];
// Условия победы
  const winConditions = [
      ['0', '1', '2'],
      ['3', '4', '5'],
      ['6', '7', '8'],
      ['0', '3', '6'],
      ['1', '4', '7'],
      ['2', '5', '8'],
      ['0', '4', '8'],
      ['2', '4', '6']
  ]

  // Создание игроков
  const player1 = PlayerFactory('Игрок 1', 'X');
  const player2 = PlayerFactory('Игрок 2', 'O');
  const computer = PlayerFactory('Комплюктер', 'O')

  // Переменные игры
  let playVsComputer = false;
  let player1Turn = true;
  let endGame = false;
  let moveCounter = 0;
  const totalMoves = 9;
  let draw = false;

// Сброс игроков
  const resetPlayers = () => {
      player1.moves = [];
      player2.moves = [];
      player1.winner = false;
      player2.winner = false;
      computer.moves = [];
      computer.winner = false;
  };

  return {
      boxContent,
      winConditions,
      player1,
      player2,
      computer,
      playVsComputer,
      player1Turn,
      moveCounter,
      draw,
      endGame,
      totalMoves,
      resetPlayers
  };
})();

const game = (() => {
// Переключение режима игры
  const modeSwitch = () => {
      gameBoard.playVsComputer = !gameBoard.playVsComputer;
      // При переключении режима сбрасывается все и начинается новая игра
      newGame();
  };

// Отметка выбранной ячейки
  const markBox = chosenBox => {
      // Предотвращает выбор игроком уже отмеченной ячейки
      if (gameBoard.boxContent[chosenBox] !== '') {
          return;
      }

      if (gameBoard.player1Turn === true && !gameBoard.playVsComputer) {
          gameBoard.boxContent[chosenBox] = gameBoard.player1.marker;
          gameBoard.player1.moves.push(chosenBox);
          gameBoard.player1Turn = false;
      } else {
          gameBoard.boxContent[chosenBox] = gameBoard.player2.marker;
          gameBoard.player2.moves.push(chosenBox);
          gameBoard.player1Turn = true;
      };

      if (gameBoard.playVsComputer) {
          gameBoard.boxContent[chosenBox] = gameBoard.player1.marker;
          gameBoard.player1.moves.push(chosenBox);
          gameBoard.computer.moves.push(computerMarkBox());
      }
  };

// Подсчет ходов
  const countMoves = () => {
      if (!gameBoard.playVsComputer) {
          gameBoard.moveCounter = gameBoard.player1.moves.length + gameBoard.player2.moves.length;
      } else {
          gameBoard.moveCounter = gameBoard.player1.moves.length + gameBoard.computer.moves.length;
      };
  };

// Определение выбора компьютера
  const computerMarkBox = () => {
      let freeBoxes = [];
      gameBoard.boxContent.forEach((box, index) => {
          if (box === '') {
              freeBoxes.push(index);
          };
      });
      let computerChoice = freeBoxes[Math.floor(Math.random() * freeBoxes.length)];
      gameBoard.boxContent[computerChoice] = gameBoard.computer.marker;
      return computerChoice.toString();
  };

// Проверка на ничью
  const checkDraw = () => {
      // Если все доступные ходы сделаны и нет победителя, игра заканчивается вничью
      if (gameBoard.moveCounter === gameBoard.totalMoves && (!gameBoard.player1.winner && !gameBoard.player2.winner && !gameBoard.computer.winner)) {
          gameBoard.draw = true;
          gameBoard.endGame = true;
      };
  };

  // Проверка победителя
  const checkWinner = () => {
      gameBoard.winConditions.forEach(condition => {
          if (condition.every(move => gameBoard.player1.moves.includes(move))) {
              gameBoard.player1.winner = true;
          };
          if (condition.every(move => gameBoard.player2.moves.includes(move))) {
              gameBoard.player2.winner = true;
          };
          if (condition.every(move => gameBoard.computer.moves.includes(move))) {
              gameBoard.computer.winner = true;
          }
      });
  };

  const checkGameEnd = () => {
      if (gameBoard.player1.winner || gameBoard.player2.winner || gameBoard.computer.winner || gameBoard.draw) {
          gameBoard.endGame = true;
      };
  };

  const play = (chosenBox) => {
      if (!gameBoard.endGame) {
          markBox(chosenBox);
          countMoves();
          checkWinner();
          checkGameEnd();
          checkDraw();
      };
  };

  const resetGameboard = () => {
      gameBoard.player1Turn = true;
      gameBoard.endGame = false;
      gameBoard.moveCounter = 0;
      gameBoard.draw = false;
      gameBoard.resetPlayers();
      gameBoard.boxContent.fill('');
  };

  const newGame = () => {
      resetGameboard();
      gameUI.resetGameBoardUI();
  };

  return {
      play,
      modeSwitch,
      newGame 
  };
})();

const gameUI = (() => {
  const initMarkBoxes = (gameBoardContainer) => {
      gameBoardContainer.addEventListener('click', (e) => {
          let chosenBox = e.target.id;
          game.play(chosenBox);
          populateGameBoard();
      });
  };

  const populateGameBoard = () => {
      const boxes = document.querySelectorAll('.box');
      gameBoard.boxContent.forEach((markedBox, index) => {
          if (markedBox !== '') {
              boxes[index].textContent = markedBox;
          };
      });
      populateGameStatus();
  };

  const resetGameBoardUI = () => {
      const status = document.querySelector('.game-status');
      status.textContent = 'Игра началась';

      const boxes = document.querySelectorAll('.box');
      boxes.forEach(box => {
          box.textContent = '';
      });
  };

  const initChangeNameBtns = () => {
      const changeNameBtns = document.querySelectorAll('div.players input[type="button"]');

      changeNameBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
              if (e.target.id === 'p1-name-btn') {
                  const p1NameLabel = document.querySelector('div.player1 label');
                  const nameTextField = document.getElementById('player1-name');
                  if (nameTextField.value !== '') {
                      p1NameLabel.textContent = nameTextField.value;
                      gameBoard.player1.name = p1NameLabel.textContent;
                      nameTextField.value = '';
                  };
              };

              if (e.target.id === 'p2-name-btn') {
                  const p2NameLabel = document.querySelector('div.player2 label');
                  const nameTextField = document.getElementById('player2-name');
                  if (nameTextField.value !== '') {
                      p2NameLabel.textContent = nameTextField.value;
                      gameBoard.player2.name = p2NameLabel.textContent;
                      nameTextField.value = '';
                  };
              };
              populateGameStatus();
          });
      });
  };

  const populateGameStatus = () => {
      const p1name = gameBoard.player1.name;
      const p2name = gameBoard.player2.name;
      const status = document.querySelector('.game-status');
      if (gameBoard.endGame) {
          if (gameBoard.draw) {
              status.textContent = 'Ничья';
          } else if (gameBoard.player1.winner) {
              status.textContent = `${p1name} победил`;
          } else if (gameBoard.player2.winner) {
              status.textContent = `${p2name} победил`;
          } else if (gameBoard.computer.winner) {
              status.textContent = `Комплюктер победил`;
          };
          return;
      };

      if (gameBoard.player1Turn) {
          status.textContent = `${p1name} сделал(а) ход.`;
      } else {
          status.textContent = `${p2name} сделал(а) ход.`;
      };
  };

  const switchUImode = () => {
      const switchModeBtn = document.querySelector('.mode');
      const player2panel = document.querySelector('.player2');
      const computerPanel = document.querySelector('.computer')
      if (gameBoard.playVsComputer === false) {
          switchModeBtn.textContent = 'Режим против ПК';
          player2panel.style.visibility = 'visible';
          computerPanel.style.visibility = 'hidden';
      } else {
          switchModeBtn.textContent = 'Режим мультиплеер';
          player2panel.style.visibility = 'hidden';
          computerPanel.style.visibility = 'visible';
      };
  };

  const render = (gameBoardContainer) => {
      initMarkBoxes(gameBoardContainer);
      initChangeNameBtns();
  }

  return {
      render,
      resetGameBoardUI,
      switchUImode
  }
})();

function init() {
  const gameBoardContainer = document.querySelector('.gameBoard');
  gameUI.render(gameBoardContainer);
}
init();