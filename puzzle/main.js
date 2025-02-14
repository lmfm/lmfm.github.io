let initialMatrix =  [];
let matrix = [];
let startedGame = false;
let totalSeconds = 0;

let board = document.querySelector('.board');
let header = document.querySelector('.header');
let timer = document.querySelector('.timer');

let size = 0;

addButtonEvents();


//startGame();


function addButtonEvents() {
    let button = document.querySelector('.button');
    button.addEventListener('click', startGame);
}

function initializeGlobals() {
    startedGame = true;
    totalSeconds = 0;
    size = document.querySelector('.selectBoardSize').value;
}

function startGame() {
    initializeGlobals();
    generateMatrix(size);
    drawTokens();
    addEventListeners();
    updateTimer();
}

function loopGame(element, actualPosition, emptyPosition, movement) {
    updateMatrix(element, actualPosition, emptyPosition, movement);
    drawTokens();
    addEventListeners();
    if (compareMatrix()) {
        startedGame = false;
        board.innerHTML += `<div class='win'>You Win !!!</div>`
    }
}

function drawTokens() {
    board.style.setProperty("--columns", size);
    board.innerHTML='';
    matrix.forEach(row => row.forEach(element => {
        if( element == ''){
            board.innerHTML += `<div class='empty'>${element}</div>`
        } else {
            board.innerHTML += `<div class='token'>${element}</div>`}
        }))
}

function addEventListeners(){
    let tokens = document.querySelectorAll('.token')
    tokens.forEach(token => token.addEventListener('click', 
        ()=>{            
            let actualPosition = searchPosition(token.innerText);
            let emptyPosition = searchPosition('');
            let movement = nextMovement(actualPosition, emptyPosition);
            if (movement != 'noMove') {
                loopGame(token.innerText, actualPosition, emptyPosition, movement);
            }
        }))
}

function searchPosition(element){
    let rowIndex = 0;
    let columnIndex = 0;
    matrix.forEach((row, index) => {
        let rowElement = row.findIndex(item => item == element)
        if(rowElement >= 0) {
            rowIndex = index;
            columnIndex = rowElement;
        }
    })
    return [rowIndex, columnIndex];
}

function nextMovement(actualPosition, emptyPosition){
    if(actualPosition[1] == emptyPosition[1]) {
        if (actualPosition[0]-emptyPosition[0] ===-1) {
            return 'down';
        } else if (actualPosition[0]-emptyPosition[0] ===1) {
            return 'up';
        } else {
            return 'noMove';
        }
    } else if(actualPosition[0] == emptyPosition[0]) {
        if (actualPosition[1]-emptyPosition[1] ===-1) {
            return 'right';
        } else if (actualPosition[1]-emptyPosition[1] ===1) {
            return 'left';
        } else {
            return 'noMove';
        }    
    } else {
        return 'noMove';
    }
}

function updateMatrix(element, actualPosition, emptyPosition, movement) {
    matrix[actualPosition[0]][actualPosition[1]] = '';
    matrix[emptyPosition[0]][emptyPosition[1]] = element;
}

function generateMatrix(dimension) {
    console.log('Dimension: ' + dimension);
    // Initialize Matrix size
    initialMatrix = Array.from({ length: dimension }, () => Array(dimension));
    matrix = Array.from({ length: dimension }, () => Array(dimension));

    // Create a new array with all the elements.
    let array = [];
    numElements = (dimension * dimension)-1;
    for (let i = 0;i<=numElements-1;i++) {
        array[i] = (i+1);
    }    
    array[numElements] = '';

    // Compose the initial matrix with the ordered elements of the array.
    let element = 0;
    for (let i = 0;i<=dimension-1;i++) {
        for (let j = 0;j<=dimension-1;j++) {
            initialMatrix[i][j] = array[element];
            element++;
        }
    }

    // Unorder the array.
    //array.sort(()=>Math.random()-0.5);

    // Compose the matrix with the elements of the unordered array.
    element = 0;
    for (let i = 0;i<=dimension-1;i++) {
        for (let j = 0;j<=dimension-1;j++) {
            matrix[i][j] = array[element];
            element++;
        }
    }

    console.log('Array: ' + array);
    console.log('initialMatrix: ' + initialMatrix);
    console.log('matrix: ' + matrix);
}

function compareMatrix() {
    let equalMatrix = true;
    matrix.forEach((row, rowIndex) => row.forEach((element, columnIndex) => {
        if (element != initialMatrix[rowIndex][columnIndex]) {
            equalMatrix = false;
        }
    }))
    return equalMatrix;
}


function updateTimer(){
    if (startedGame) {
        hours = Math.trunc(totalSeconds/3600);
        minutes = Math.trunc((totalSeconds-(hours*3600))/60);
        seconds = Math.trunc((totalSeconds-((hours*3600)+(minutes*60))));
        time = hours.toString().padStart(2,'0')+':'+minutes.toString().padStart(2,'0')+':'+seconds.toString().padStart(2,'0');
        timer.innerHTML = 'Time: ' + time;
        totalSeconds++;
        setTimeout('updateTimer();', 1000);    
    }
}