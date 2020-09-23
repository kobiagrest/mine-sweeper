'use strict'

console.log('hello mine sweeper');

const HIDE = 'h';
const MINE = 'M';
const LONE = 'L';
const MARK = '?';
const BOOM = '!';

var gBoard;
var gGame;
var gLevel;

//   נשאר לתת למשתמש לבחור רמה, אבל זה עובד כבר בכל הרמות
function init() {
    gLevel = {
        SIZE: 4,
        MINES: 2,
    }
    // gLevel = {
    //     SIZE: 8,
    //     MINES: 12,
    // }
    // gLevel = {
    //     SIZE: 12,
    //     MINES: 30,
    // }
    gBoard = buildBoard(gLevel.SIZE);
    gGame = {
        isOn: true,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
    }
    // console.table(gBoard)
    setMines(gLevel.MINES);
    console.table(gBoard)
    setMinesNegsCount(gBoard);
    renderBoard(gBoard, '.board-container')
    // var currCount = countNeighbors(gBoard, 2, 2);
    // console.log('currCount', currCount)
    printContentBoard(gBoard)
    disContextMenu('.board-container');
}

function gameOver(i, j, cellClicked, elCell) {
    console.log('game over')
    gGame.isOn = false;
    console.log('gGame', gGame);
    var content = BOOM;
    renderCell(i, j, content, elCell);
}

// if gGame.shownCount+ gGame.markedCount === board.length*bord[0].length

function handleVictory() {

}
function isVictory(board) {
    var res = false;
    if ((gGame.shownCount + gGame.markedCount) === (board.length * board[0].length)) {
        console.log('winner!!')
        var res = true;
    }
    return res;
}

// cellMarked(elCell) לשנות אולי בסוף את השם של הפונקציה של הקליק הימני לזה
// לשקול לשים את הקוד הכפול של ההקלקות ביחד, ולחשוב על דרך לבדוק אם זה קליק ימני או שמאלי
// או לעשות פונקציה שמציבה על ידי הקלקה שתכלול את הקוד, ותשנה את התוכן בהתאם לסוג ההקלקה (נראאה לי יותר קל ונח ומסודר)
// בינתיים אני משאיר לי את ההשוואות לאמת ושקר אך בסוף אבדוק איפה אפשר לקצר ל! וכו

function rigthCellClicked(elCell, i, j) {
    if (gGame.isOn === false) return;
    console.log('elCell:', elCell)
    console.dir(elCell)
    var cellClicked = gBoard[i][j];
    console.log('cellClicked:', cellClicked);
    var content = '';
    if (cellClicked.isShown) return;
    if (cellClicked.isMarked === false) {
        cellClicked.isMarked = true;
        content = MARK;
        gGame.markedCount++;
    } else {
        content = HIDE;
        cellClicked.isMarked = false;
        gGame.markedCount--;
    }
    renderCell(i, j, content, elCell);
    console.log('gGame', gGame);
}

function cellClicked(elCell, i, j) {
    if (gGame.isOn === false) return;
    console.log(elCell);
    console.dir(elCell);
    var cellClicked = gBoard[i][j];
    console.log('cellClicked:', cellClicked);
    if (cellClicked.isMarked === true || cellClicked.isShown === true) return;
    if (cellClicked.isMine === true) {
        gameOver(i, j, cellClicked, elCell);
        return;
    }
    cellClicked.isShown = true;
    gGame.shownCount++;
    if (!isVictory(gBoard)) {
        var content = cellClicked.minesAroundCount;
        if (cellClicked.minesAroundCount === 0) content = LONE;
        renderCell(i, j, content, elCell);
        console.log('gGame', gGame);
    } else handleVictory();
}


function renderCell(i, j, content, elCell) {
    // Select the elCell and set the value
    // var elCell = document.querySelector(`.cell-${i}-${j}`);
    elCell.innerHTML = content;
}

function setMinesNegsCount(board) {

    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var currCount = countNeighbors(board, i, j);
            // console.log(`cell ${i},${j} num negs: ${currCount}`);
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
            // console.log(currCell);
            if (currCell.isMine) {
                negsCount++;
            }
        }
    }
    return negsCount;
}
function setMines(amount) {
    var locations = resetLocations(gBoard)
    console.log(locations)
    for (var i = 0; i < amount; i++) {
        var rndLocation = drawLocation(locations);
        // console.log('rndLocation:', rndLocation);
        var currCell = gBoard[rndLocation.i][rndLocation.j];
        // console.log('currCell',currCell);
        currCell.isMine = true;
        currCell.minesAroundCount = 'M';
        if (currCell.isShown) renderBoard(gBoard, '.board-container')
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
            var content = HIDE;

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


