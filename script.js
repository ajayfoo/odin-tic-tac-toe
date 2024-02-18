const GameBoard = (() => {
    let gameState = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    const X = 'X';
    const O = 'O';
    const setXO = (setX, row, col) => {
        gameState[row][col] = setX ? X : O;
    };
    const reset = () => {
        gameState = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => null));
    };
    const getCopyOfGameState = () => gameState.map(row => row.slice());
    return { setXO, reset, getCopyOfGameState, X, O };
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
    const diagonalWin = (checkForX) => (leftDiagonalWin(checkForX) || rightDiagonalWin(checkForX));
    return { rowWin, colWin, diagonalWin };
})();