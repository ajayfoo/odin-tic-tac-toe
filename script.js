const GameBoard = (() => {
    let gameState = null;
    const X = 'X';
    const O = 'O';
    const getMaxRowNum = () => {
        if (gameState !== null) return gameState.length - 1;
        else return -1;
    };
    const getMaxColNum = () => getMaxRowNum();
    const setXO = (setX, row, col) => {
        const maxRow = getMaxRowNum();
        const maxCol = getMaxColNum();
        if (row > maxRow || row < 0 || col > maxCol || col < 0) return false;
        if (gameState[row][col] !== null) return false;
        gameState[row][col] = setX ? X : O;
        return true;
    };
    const setupNewGameState = () => {
        gameState = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));
    };
    const getCopyOfGameState = () => gameState.map(row => row.slice());
    const getCellState = (rowNum, colNum) => gameState[rowNum][colNum];
    const print = () => {
        console.log('\t0\t1\t2')
        for (let i = 0; i < 3; ++i) {
            let row = i + '\t';
            for (let j = 0; j < 3; ++j) {
                if (gameState[i][j] === null) {
                    row += '\t';
                } else {
                    row += gameState[i][j] + '\t';
                }
            }
            console.log(row);
        }
    };
    const allCellsAreMarked = () => !gameState.flat().includes(null);
    return { setXO, setupNewGameState, getCopyOfGameState, X, O, print, getMaxRowNum, getMaxColNum, getCellState, allCellsAreMarked };
})();

const ScoreChart = (() => {
    let player1Wins = 0;
    let player2Wins = 0;
    const getPlayer1Wins = () => player1Wins;
    const getPlayer2Wins = () => player2Wins;
    const incrementPlayer1Wins = () => { ++player1Wins; };
    const incrementPlayer2Wins = () => { ++player2Wins; };
    const reset = () => {
        player1Wins = 0;
        player2Wins = 0;
    };
    const print = () => { console.log(`Player 1: ${getPlayer1Wins()}, Player 2: ${getPlayer2Wins()}`) };
    return { getPlayer1Wins, getPlayer2Wins, incrementPlayer1Wins, incrementPlayer2Wins, reset, print };
})();

const GameBoardView = (() => {
    const indexToRowNumColNum = (index) => {
        const maxRowNum = GameBoard.getMaxRowNum();
        const maxColNum = GameBoard.getMaxColNum();
        const rowNum = Math.floor(index / (maxRowNum + 1));
        const colNum = index - (rowNum * (maxColNum + 1));
        return { rowNum, colNum };
    };

    const setCellImage = (isX, cell) => {
        const cellImage = cell.querySelector('img');
        if (isX) {
            cellImage.alt = 'X';
            cellImage.src = 'images/line-md--close.svg';
        } else {
            cellImage.alt = 'O';
            cellImage.src = 'images/mdi--circle-outline.svg';
        }
    };
    const unsetCellImage = (cell) => {
        const cellImage = cell.querySelector('img');
        cellImage.alt = '';
        cellImage.src = '';

    }
    const reset = () => {
        const gameBoardElement = document.querySelector('.game-board');
        const cells = gameBoardElement.querySelectorAll('.cell');
        cells.forEach(unsetCellImage);
    }
    return { indexToRowNumColNum, setCellImage, reset };
})();

const GameController = (() => {
    const rowWin = (checkForX) => {
        const gameState = GameBoard.getCopyOfGameState();
        for (const row of gameState) {
            const count = row.reduce((acc, curr) => {
                if ((checkForX && curr === GameBoard.X) || (!checkForX && curr === GameBoard.O)) {
                    acc += 1;
                }
                return acc;
            }, 0);
            if (count === 3) return true;
        }
        return false;
    };
    const colWin = (checkForX) => {
        const gameState = GameBoard.getCopyOfGameState();
        for (let colNum = 0; colNum < 3; ++colNum) {
            let count = 0;
            for (let rowNum = 0; rowNum < 3; ++rowNum) {
                if ((checkForX && gameState[rowNum][colNum] === GameBoard.X) || (!checkForX && gameState[rowNum][colNum] === GameBoard.O)) {
                    count += 1;
                }
            }
            if (count === 3) return true;
        }
        return false;
    };
    const leftDiagonalWin = (checkForX) => {
        const gameState = GameBoard.getCopyOfGameState();
        let count = 0;
        for (let i = 0; i < 3; ++i) {
            if ((checkForX && gameState[i][i] === GameBoard.X) || (!checkForX && gameState[i][i] === GameBoard.O)) {
                count += 1;
            }
            if (count === 3) return true;
        }
        return false;
    };
    const rightDiagonalWin = (checkForX) => {
        const gameState = GameBoard.getCopyOfGameState();
        let count = 0;
        for (let i = 0; i < 3; ++i) {
            const colNum = gameState.length - 1 - i;
            if ((checkForX && gameState[i][colNum] === GameBoard.X) || (!checkForX && gameState[i][colNum] === GameBoard.O)) {
                count += 1;
            }
            if (count === 3) return true;
        }
        return false;
    };
    const hasWon = (piece) => {
        const checkForX = piece === GameBoard.X;
        return rowWin(checkForX) || colWin(checkForX) || diagonalWin(checkForX)
    };

    const gameBoardElement = document.querySelector('.game-board');
    const cells = gameBoardElement.querySelectorAll('.cell');
    const diagonalWin = (checkForX) => (leftDiagonalWin(checkForX) || rightDiagonalWin(checkForX));
    let haltGame = false;
    const setHaltGame = (halt) => { haltGame = halt; };
    const attachEventListenersForEveryCell = () => {
        let isXPlayersTurn = true;
        const xScoreTxt = document.querySelector("body > div.controls > span > span.x-score > output");
        const oScoreTxt = document.querySelector("body > div.controls > span > span.o-score > output");
        const finalResult = document.querySelector('body>div.final-result');
        let xScore = 0;
        let oScore = 0;
        cells.forEach((cell) => {
            cell.addEventListener('click', () => {
                const { rowNum, colNum } = GameBoardView.indexToRowNumColNum(cell.dataset.index);
                if (GameBoard.getCellState(rowNum, colNum) !== null || haltGame) return;
                GameBoard.setXO(isXPlayersTurn, rowNum, colNum);
                GameBoardView.setCellImage(isXPlayersTurn, cell);
                const xWon = hasWon(GameBoard.X);
                const oWon = hasWon(GameBoard.O);
                if (hasWon(GameBoard.X)) {
                    xScoreTxt.textContent = ++xScore;
                    finalResult.textContent = 'Last round was a won by X';
                }
                else if (hasWon(GameBoard.O)) {
                    oScoreTxt.textContent = ++oScore;
                    finalResult.textContent = 'Last round was a won by O';
                }
                if (GameBoard.allCellsAreMarked()) {
                    console.log('all marked');
                    finalResult.textContent = 'Last round was a tie';
                }
                isXPlayersTurn = !isXPlayersTurn;
                haltGame = xWon || oWon || GameBoard.allCellsAreMarked();
            });
        });
    };
    const startGame = () => {
        ScoreChart.reset();
        GameBoard.setupNewGameState();
        attachEventListenersForEveryCell();
        console.log('Starting a new game');
    };
    return { startGame, setHaltGame };
})();
const nextRoundBtn = document.getElementById('next-round');
nextRoundBtn.addEventListener('click', () => {
    GameController.setHaltGame(false);
    GameBoardView.reset();
    GameBoard.setupNewGameState();
});
GameController.startGame();