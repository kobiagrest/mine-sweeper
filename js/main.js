'use strict'

console.log('hello mine sweeper');

// var gNum = 0;

const SAFE = '✔️';
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
var gNumsLocations;
var gTimerInterval;
var gIsFirstClick;
var gLive;
var gElLives = document.querySelector('.lives');
var gSafeClick;
var gElSafeClick = document.querySelector('.safe-click span');
var gHint;
var gElHint = document.querySelector('.hint span');

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
        isHint: false,
    }
    gLive = 3;
    resetLives()
    gSafeClick = 3;
    gElSafeClick.innerHTML = 3;
    gHint = 3;
    gElHint.innerHTML = 3;
    var elHint = document.querySelector('.hint');
    elHint.classList.remove('click-on')
    resetTimer()
    changeSmiley('😃')
    renderBoard(gBoard, '.board-container')
    disContextMenu('.board-container');
    renderCountMarked()
}

function onFirstClick(elCell, i, j) {
    gIsFirstClick = false;

    gMinesLocations = setMines(gLevel.MINES, i, j);
    console.table(gBoard);
    gNumsLocations = [];
    setMinesNegsCount(gBoard);
    renderBoard(gBoard, '.board-container')
    printContentBoard(gBoard)
    renderCountMarked()
    var cellAfterRender = gBoard[i][j];
    var elNewCell = document.querySelector(`.cell-${i}-${j}`)

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
            gNumsLocations.push({ i: i, j: j });
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

function setMines(amount, rowIdx, colIdx) {
    var locations = resetLocations(gBoard, rowIdx, colIdx)
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



function resetLives() {
    var strHTML = '';
    for (var i = 0; i < gLive; i++) {
        strHTML += '❤️';
    }
    gElLives.innerHTML = strHTML;
}

function gameOver(i, j, cellClicked, elCell) {
    gGame.isOn = false;
    // var gElLives = document.querySelector('.lives');
    if (gLive > 1) {
        var content = MINE;
        renderCell(i, j, content);
        setTimeout(function () {
            content = HIDE;
            renderCell(i, j, content);
            gGame.isOn = true;
        }, 1000)
        gLive--;
        resetLives()
        return;
    }
    gElLives.innerHTML = '';
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

function changeSmiley(smiley) {
    var elNewButton = document.querySelector('.new-game');
    elNewButton.innerHTML = smiley;
}

function safeClick() {
    if (gGame.isOn === false) return;
    if (gSafeClick > 0) {
        gGame.isOn = false;
        var elSafeClick = document.querySelector('.safe-click');
        elSafeClick.classList.add('click-on')
        var rndLocation;
        if (!gNumsLocations) {
            rndLocation = getRndLocation(gBoard);
        } else {
            for (var l = 0; l < gNumsLocations.length; l++) {
                shuffle(gNumsLocations);
                var currLocation = gNumsLocations.shift();
                var currCell = gBoard[currLocation.i][currLocation.j];
                if (currCell.isShown) continue;
                rndLocation = currLocation; break;
            }
        }
        // var elCell = document.querySelector(`cell-${i}-${j}`);
        var content = SAFE;
        renderCell(rndLocation.i, rndLocation.j, content);
        setTimeout(function () {
            gGame.isOn = true;
            renderCell(rndLocation.i, rndLocation.j, HIDE);
            var elSafeClick = document.querySelector('.safe-click');
            elSafeClick.classList.remove('click-on')
        }
            , 1000
        )
        gSafeClick--;
        gElSafeClick.innerHTML = gSafeClick;
    }
}

function isHint() {
    if (gGame.isOn === false) return;
    if (gIsFirstClick === true) return;
    if (gHint > 0) gGame.isHint = true;
    var elHint = document.querySelector('.hint');
    elHint.classList.add('click-on')
}

function getHint(elCell, rowIdx, colIdx) {
    if (gBoard[rowIdx][colIdx].isShown === true || gBoard[rowIdx][colIdx].isMarked === true) return;
    gGame.isHint = false;
    gGame.isOn = false;

    var content = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            var currCell = gBoard[i][j];
            if (currCell.isShown || currCell.isMarked) continue;

            if (currCell.isMine) content = MINE;
            else if (currCell.minesAroundCount > 0) content = currCell.minesAroundCount;
            else content = LONE;
            renderCell(i, j, content);
        }
    }
    setTimeout(function () {
        for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                if (j < 0 || j >= gBoard[0].length) continue;
                var currCell = gBoard[i][j];
                if (currCell.isShown || currCell.isMarked) continue;
                renderCell(i, j, HIDE);
            }
        }
        var elHint = document.querySelector('.hint');
        elHint.classList.remove('click-on')
        gGame.isOn = true;
    }
        , 1000
    )
    gHint--;
    gElHint.innerHTML = gHint;

}