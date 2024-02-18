const GameBoard = (() => {
    let gameState = null;
    const X = 'X';
    const O = 'O';
    const setXO = (setX, row, col) => {
        const maxRow = gameState.length - 1;
        const maxCol = maxRow;
        if (row > maxRow || row < 0 || col > maxCol || col < 0) return false;
        if (gameState[row][col] !== null) return false;
        gameState[row][col] = setX ? X : O;
        return true;
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
                    row += '\t';
                } else {
                    row += gameState[i][j] + '\t';
                }
            }
            console.log(row);
        }
    }
    return { setXO, setupNewGameState, getCopyOfGameState, X, O, print };
})();

const ScoreChart = (() => {
    let player1Wins = 0;
    let player2Wins = 0;
    const getPlayer1Wins = () => player1Wins;
    const getPlayer2Wins = () => player2Wins;
    const incrementPlayer1Wins = () => { ++player1Wins; };
    const incrementPlayer2Wins = () => { ++player2Wins };
    return { getPlayer1Wins, getPlayer2Wins, incrementPlayer1Wins, incrementPlayer2Wins };
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

    const diagonalWin = (checkForX) => (leftDiagonalWin(checkForX) || rightDiagonalWin(checkForX));
    const startGame = () => {
        let roundNum = 1;
        while (ScoreChart.getPlayer1Wins() < 3 && ScoreChart.getPlayer2Wins() < 3 && roundNum <= 3) {
            GameBoard.setupNewGameState();
            let player1sTurn = true;
            while (!(hasWon(GameBoard.X) || hasWon(GameBoard.O))) {
                GameBoard.print();
                if (player1sTurn) {
                    console.log("Player 1's turn");
                } else {
                    console.log("Player 2's turn");
                }
                let rowNum = prompt('Enter row number(0 to 2)');
                let colNum = prompt('Enter column number(0 to 2)');
                if (!GameBoard.setXO(player1sTurn, rowNum, colNum)) {
                    console.log('Please enter valid row and column number. Place only on empty cells.');
                    continue;
                }
                player1sTurn = !player1sTurn;
            }
            GameBoard.print();
            if (!player1sTurn) {
                console.log('Player 1 has won round ' + roundNum);
                ScoreChart.incrementPlayer1Wins();
            } else {
                console.log('Player 2 has won round ' + roundNum);
                ScoreChart.incrementPlayer2Wins();
            }
            ++roundNum;
        }
        if (ScoreChart.getPlayer1Wins() === 3) {
            console.log('Player 1 has won the game');
        } else if (ScoreChart.getPlayer1Wins() === 3) {
            console.log('Player 2 has won the game');
        } else {
            console.log("It's a tie");
        }
    };
    return { startGame };
})();