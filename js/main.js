'use strict'

console.log('hello mine sweeper');

// var gNum = 0;

const HIDE = '';
const MINE = '💣';
const LONE = '🌳';
// 🌳 🌲
const MARK = '🚩';
// 🏳️ 🚩🏴
const BOOM = '💥';
const GLEVELS = [{ SIZE: 4, MINES: 2 }, { SIZE: 8, MINES: 12 }, { SIZE: 12, MINES: 30 }]

var gBoard;
var gGame;
var gLevel;
var gMinesLocations;
var gTimerInterval;
var gIsFirstClick;
var gLives;

function init(isOnLoadInit) {
    closemodal()
    gIsFirstClick = true;
    if (isOnLoadInit) {
        gLevel = GLEVELS[0];
    }
    gBoard = buildBoard(gLevel.SIZE);
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        rigthMarkedCount: 0,
        secsPassed: 0,
    }
    resetTimer()
    changeSmiley('😃')
    renderBoard(gBoard, '.board-container')
    disContextMenu('.board-container');
    renderCountMarked ()
}

function onFirstClick (elCell,i,j){
    gIsFirstClick = false;

    gMinesLocations = setMines(gLevel.MINES,i,j);
    console.table(gBoard)
    setMinesNegsCount(gBoard);
    renderBoard(gBoard, '.board-container')
    printContentBoard(gBoard)
    renderCountMarked ()
    var cellAfterRender = gBoard[i][j];
    var elNewCell= document.querySelector(`.cell-${i}-${j}`)

    cellClicked(elNewCell, i, j);
}

function selcectLeval(idx) {
    gLevel = GLEVELS[idx];
    init();
}

function resetTimer() {
    if (gTimerInterval) clearInterval(gTimerInterval);
    gTimerInterval = undefined;
    if (gGame.isOn) {
        var el = document.querySelector('.timer');
        var strTimer = '0 m 0 s';
        el.innerHTML = strTimer;
    }
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
        };
    };
    return board;
}

function renderBoard(mat, selector) {
    var strHTML = '<table border="1"><tbody>';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < mat[0].length; j++) {
            var currCell = mat[i][j];
            var className = `cell cell-${i}-${j}`;
            
            var content = (currCell.isMarked) ? MARK : HIDE;

            // strHTML += `<td class="${className}">${currCell.minesAroundCount}</td>`
            if (currCell.isMine) className += ' mine';
            else if (currCell.minesAroundCount > 0) className += ' has-negs';
            else className += ' lone';

            if (currCell.isShown) {
                if (currCell.isMine) content = MINE;
                else if (currCell.minesAroundCount > 0) content = currCell.minesAroundCount;
                else content = LONE;
            }
            strHTML += `<td class="${className}"
                        onclick= "cellClicked(this,${i},${j})" 
                        oncontextmenu="rigthCellClicked(this,${i},${j})">${content}</td>`

        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>';
    var elContainer = document.querySelector(selector);
    elContainer.innerHTML = strHTML;
}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCount = countNeighbors(board, i, j);
            var currCell = board[i][j];
            if (currCell.minesAroundCount === 'M') continue;
            currCell.minesAroundCount = currCount;
        }
    }
}

function countNeighbors(board, rowIdx, colIdx) {
    var negsCount = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx ||
                j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (currCell.isMine) {
                negsCount++;
            }
        }
    }
    return negsCount;
}

function setMines(amount,rowIdx,colIdx) {
    var locations = resetLocations(gBoard,rowIdx,colIdx)
    var minesLocations = [];
    for (var i = 0; i < amount; i++) {
        var rndLocation = drawLocation(locations);
        minesLocations.push(rndLocation);
        var currCell = gBoard[rndLocation.i][rndLocation.j];
        currCell.isMine = true;
        currCell.minesAroundCount = 'M';
        if (currCell.isMarked) gGame.rigthMarkedCount++;
        renderBoard(gBoard, '.board-container')
    }
    return minesLocations;
}





function gameOver(i, j, cellClicked, elCell) {
    gGame.isOn = false;
    resetTimer();
    gMinesLocations.indexOf()
    revealeMines();
    var content = BOOM;
    renderCell(i, j, content, elCell);
    openModal(false)
    changeSmiley('😟');
}

function revealeMines() {
    for (var i = 0; i < gMinesLocations.length; i++) {
        var currLocation = gMinesLocations[i];
        var currCell = gBoard[currLocation.i][currLocation.j];
        currCell.isShown = true;
        var content = MINE;
        renderCell(currLocation.i, currLocation.j, content)
    }
}

function handleVictory() {
    gGame.isOn = false;
    resetTimer();
    openModal(true);
    changeSmiley('😎');
}

function isVictory(board) {
    var res = false;
    if ((gGame.shownCount + gGame.rigthMarkedCount) === (board.length * board[0].length)) {
        var res = true;
    }
    return res;
}

function openModal(isWin) {
    var elH1Modal = document.querySelector('.modal-game-over h1');
    elH1Modal.innerText = (isWin) ? 'you did it' : 'game over';
    var elModal = document.querySelector('.modal-game-over');
    elModal.style.display = 'inline';
}

function closemodal() {
    var elModal = document.querySelector('.modal-game-over');
    elModal.style.display = 'none';
}

function changeSmiley(smiley){
var elNewButton = document.querySelector('.new-game');
elNewButton.innerHTML = smiley;
}

