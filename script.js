const GameBoard = (() => {
    let gameState = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];
    const setXO = (setX, row, col) => {
        gameState[row][col] = setX ? 'X' : 'O';
    };
    const reset = () => {
        gameState = new Array(3).fill(new Array(3).fill(null, 0, 3), 0, 3);
    };
    const print = () => {
        console.log(gameState);
    };

    return { setXO, reset, print };
})();