const GameBoard = (() => {
    let gameState = null;
    const X = 'X';
    const O = 'O';
    const setXO = (setX, row, col) => {
        gameState[row][col] = setX ? X : O;
    };
    const setupNewGameState = () => {
        gameState = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));
    };
    const getCopyOfGameState = () => gameState.map(row => row.slice());
    const print = () => {
        console.log('\t0\t1\t2')
        for (let i = 0; i < 3; ++i) {
            let row = i + '\t';
            for (let j = 0; j < 3; ++j) {
                if (gameState[i][j] === null) {
                    row += '\t ';
                } else {
                    row += gameState[i][j] + '\t';
                }
            }
            console.log(row);
        }
    }
    return { setXO, setupNewGameState, getCopyOfGameState, X, O, print };
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
    const xHasWon = () => rowWin(true) || colWin(true) || diagonalWin(true);
    const oHasWon = () => rowWin(false) || colWin(false) || diagonalWin(false);

    const diagonalWin = (checkForX) => (leftDiagonalWin(checkForX) || rightDiagonalWin(checkForX));
    const startGame = () => {
        GameBoard.setupNewGameState();
        let player1sTurn = true;
        console.log(xHasWon() + ' ' + oHasWon());
        while (!(xHasWon() || oHasWon())) {
            GameBoard.print();
            let rowNum = prompt('Enter row number');
            let colNum = prompt('Enter column number');
            GameBoard.setXO(player1sTurn, rowNum, colNum);
            player1sTurn = !player1sTurn;
        }
        GameBoard.print();
        if (!player1sTurn) {
            console.log('Player 1 has won');
        } else {
            console.log('Player 2 has won');
        }
    };
    return { startGame };
})();