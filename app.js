const gridEl = document.querySelector('.grid');
const miniGridEl = document.querySelector('.mini-grid');
const scoreEl = document.querySelector('#score');
const startButtonEl = document.querySelector('#start-button');
const titleEl = document.querySelector('.title');
const theEndEl = document.querySelector('.the-end');


const width = 10; // grid width (number of squares in a row)
const displayWidth = 4;
const backgroundColor = "lightgray"

let currentPosition = null;
let currentRotation = 0;
let currentTetromino = null;
let currentShape = null;
let nextShape = null;
let nextTetromino = null;
let timerId = null;
let color = null;
let nextColor = null;
let className = null;
let isGameStarted =  true;


startButtonEl.addEventListener('click', onButtonClick);
document.addEventListener('keydown', control);

// create grid-like container for squares
for (let i = 0; i < 200; i++) {
    gridEl.appendChild(document.createElement('div'));
}

for (let i = 0; i < 10; i++) {
    const divEl = document.createElement('div');
    divEl.classList.add('taken');
    divEl.classList.add('hidden');
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
    draw(currentShape);
}

function makeNextTetromino(shape) {
    nextTetromino = theDisplayTetrominoes[shape];
    drawNext(nextShape);
}

makeTetromino(currentShape);
makeNextTetromino(nextShape);

//draw the tetromino
function draw(currentShape) {
    currentTetromino.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino');
    })

    switch (currentShape) {
        case 0:
            color = "red";
            className = "zero";
            break;
        case 1:
            color = "yellow";
            className = "one";
            break;
        case 2:
            color = "white";
            className = "two";
            break;
        case 3:
            color = "black";
            className = "three";
            break;
        case 4:
            color = "green";
            className = "four";
            break;                                       
    }

    gridEl.childNodes.forEach(div => {
        if (div.classList.contains('tetromino') && !div.classList.contains('taken')) {
            div.style.backgroundColor = color;
        }
    })
}

function drawNext(nextShape) {
    nextTetromino.forEach(index => {
        displaySquares[index].classList.add('tetromino');
    })


    switch (nextShape) {
        case 0:
            nextColor = "red";
            // className = "zero";
            break;
        case 1:
            nextColor = "yellow";
            // className = "one";
            break;
        case 2:
            nextColor = "white";
            // className = "two";
            break;
        case 3:
            nextColor = "black";
            // className = "three";
            break;
        case 4:
            nextColor = "green";
            // className = "four";
            break;                                       
    }

    miniGridEl.childNodes.forEach(child => {
        if (child.nodeName === "DIV") {
            if (child.classList.contains('tetromino')) {
                child.style.backgroundColor = nextColor;
            }
        }
        
    })
}

//undraw the tetromino
function undraw() {
    currentTetromino.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino');
    })

    gridEl.childNodes.forEach(div => {
        if (!div.classList.contains('tetromino') && !div.classList.contains('hidden')) {
            div.style.backgroundColor = backgroundColor;
        }
    })
}

function undrawNext() {
    nextTetromino.forEach(index => {
        displaySquares[index].classList.remove('tetromino');
    })

    miniGridEl.childNodes.forEach(child => {
        if (child.nodeName === "DIV") {
            if (!child.classList.contains('tetromino')) {
                child.style.backgroundColor = backgroundColor;
            }
        }
        
    })
}

//move tetramino down every second
function moveDown() {
    undraw();
    currentPosition += width;
    draw(currentShape);
    freeze();
}

// freeze moving
function freeze() {
    if (currentTetromino.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        currentTetromino.forEach(index => squares[currentPosition + index].classList.add('taken'));

        currentTetromino.forEach(el => {
            gridEl.childNodes[el].classList.add(`${className}`);
        })

        // gridEl.childNodes.forEach(el => {
        //     if (el.classList.contains('taken') && !el.classList.contains('hidden')) {
        //         el.style.backgroundColor = "orange";
        //     }
            
        // })

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

    draw(currentShape);
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

    draw(currentShape);
}

function rotate() {
    undraw();
    currentRotation += 1;
    if (currentRotation === currentTetromino.length) {
        currentRotation = 0;
    }

    currentTetromino = theTetrominoes[currentShape][currentRotation];
    draw(currentShape);
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

        drawNext(nextShape);
        draw(currentShape);
        timerId = setInterval(moveDown, 1000);
        startButtonEl.textContent = "Pause";
    } else if (timerId) { // pause
        clearInterval(timerId);
        timerId = null;
        startButtonEl.textContent = "Start";
    } else { // start, continue
        draw(currentShape);
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

            squares.forEach(el => {
                if (!el.classList.contains('hidden') && !el.classList.contains('tetromino')) {
                    el.style.backgroundColor = backgroundColor;
                    el.classList.remove('zero');
                    el.classList.remove('one');
                    el.classList.remove('two');
                    el.classList.remove('three');
                    el.classList.remove('four');
                }

                gridEl.appendChild(el);
            });
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