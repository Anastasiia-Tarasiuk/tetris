const gridEl = document.querySelector('.grid');
const miniGridEl = document.querySelector('.mini-grid');
const scoreEl = document.querySelector('#score');
const startButtonEl = document.querySelector('#start-button');
const titleEl = document.querySelector('.title');
const theEndEl = document.querySelector('.the-end');
let isGameStarted =  true;

const width = 10; // grid width (number of squares in a row)
const displayWidth = 4;

let currentPosition = null;
let currentRotation = 0;
let currentTetromino = null;
let currentShape = null;
let nextShape = null;
let nextTetromino = null;
let timerId = null;

startButtonEl.addEventListener('click', onButtonClick);
document.addEventListener('keydown', control);

// create grid-like container for squares
for (let i = 0; i < 200; i++) {
    gridEl.appendChild(document.createElement('div'));
}

for (let i = 0; i < 10; i++) {
    const divEl = document.createElement('div');
    divEl.classList.add('taken');
    gridEl.appendChild(divEl);
}

for (let i = 0; i < 16; i++) {
    miniGridEl.appendChild(document.createElement('div'));
}

let squares = Array.from(document.querySelectorAll('.grid div'));
const displaySquares = document.querySelectorAll('.mini-grid div');

//The Tetraminoes
const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
]

const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
]

const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
]

const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1]
]

const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];
const theDisplayTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], 
    [0, displayWidth, displayWidth+1, displayWidth*2+1], 
    [1, displayWidth, displayWidth+1, displayWidth+2], 
    [0, 1, displayWidth, displayWidth+1], 
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]
];

//make tetromino
function pickRandomShape() {
    return Math.floor(Math.random() * theTetrominoes.length);
}

currentShape = pickRandomShape();
nextShape = pickRandomShape();

function makeTetromino(shape) {
    currentPosition = 4;
    currentTetromino = theTetrominoes[shape][currentRotation];
    draw();
}

function makeNextTetromino(shape) {
    nextTetromino = theDisplayTetrominoes[shape];
    drawNext();
}

makeTetromino(currentShape);
makeNextTetromino(nextShape);

//draw the tetromino
function draw() {
    currentTetromino.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
    })
}

function drawNext() {
    nextTetromino.forEach(index => {
        displaySquares[index].classList.add('tetromino');
    })
}

//undraw the tetromino
function undraw() {
    currentTetromino.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
    })
}

function undrawNext() {
    nextTetromino.forEach(index => {
        displaySquares[index].classList.remove('tetromino');
    })
}

//move tetramino down every second
function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
}

// freeze moving
function freeze() {
    if (currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'));
        addScore();
        currentShape = nextShape;
        nextShape = pickRandomShape();
        makeTetromino(currentShape);
        undrawNext();
        makeNextTetromino(nextShape);
        gameOver();
    }
}

//move tetromino unless they touch container sides
function moveLeft() {
    undraw();
    const isAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width === 0);

    if (!isAtLeftEdge) {
        currentPosition -= 1;
    }

    if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition += 1;
    }

    draw();
}

function moveRight() {
    undraw();
    const isAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width === width - 1);

    if (!isAtRightEdge) {
        currentPosition += 1;
    }

    if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -= 1;
    }

    draw();
}

function rotate() {
    undraw();
    currentRotation += 1;
    if (currentRotation === currentTetromino.length) {
        currentRotation = 0;
    }

    currentTetromino = theTetrominoes[currentShape][currentRotation];
    draw();
}


// controls are clickable only if game has started/ not paused /is not over yet
function control(e) {
    if (startButtonEl.innerHTML === "Pause") {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }
}

// iterface has 3 options (start/continue game, pause game and refresh game)
function onButtonClick() {
    if (!isGameStarted) { // refresh
        isGameStarted = true;
        scoreEl.innerHTML = 0;
        theEndEl.innerHTML = "";

        for (let i = 0; i < 200; i ++) {
            squares[i].classList.remove('taken');
            squares[i].classList.remove('tetromino');
        }

        drawNext();
        draw();
        timerId = setInterval(moveDown, 1000);
        startButtonEl.textContent = "Pause";
    } else if (timerId) { // pause
        clearInterval(timerId);
        timerId = null;
        startButtonEl.textContent = "Start";
    } else { // start, continue
        draw();
        timerId = setInterval(moveDown, 1000);
        startButtonEl.textContent = "Pause";
    }
}

// interacts with score. Also cuts and adds rows to grid
function addScore() {
    for (let i = 0; i < 199; i += width) {
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];

        if (row.every(index => squares[index].classList.contains('taken'))) {
            
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
            });

            scoreEl.innerHTML = Number(scoreEl.innerHTML) + width;
            const removedRow = squares.splice(i, width);
            squares = removedRow.concat(squares);

            squares.forEach(el => gridEl.appendChild(el));
        }
    }   
}

// initiates end of the game
function gameOver() {
    if (currentTetromino.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        startButtonEl.innerHTML = "Start";
        clearInterval(timerId);

        displaySquares.forEach(el => el.classList.remove('tetromino'));

        theEndEl.innerHTML = "THE END";
        isGameStarted = false;
    }
}