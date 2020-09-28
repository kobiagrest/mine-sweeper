function rigthCellClicked(elCell, i, j) {
    if (!gTimerInterval) gTimerInterval = startTimer('.timer');
    if (gGame.isOn === false) return;

    var cellClicked = gBoard[i][j];
    var content = '';
    if (cellClicked.isShown) return;
    if (cellClicked.isMarked === false) {
        cellClicked.isMarked = true;
        content = MARK;
        gGame.markedCount++;
        renderCountMarked()
        // console.log('gGame.markedCount',gGame.markedCount)
        console.log('cellClicked', cellClicked) //למחוק
        // console.log('gGame.rigthMarkedCount',gGame.rigthMarkedCount)

        if (cellClicked.isMine === true) {
            gGame.rigthMarkedCount++;
        }
        renderCell(i, j, content, elCell);
        if (isVictory(gBoard)) {
            handleVictory()
            return;
        }
    } else {
        content = HIDE;
        cellClicked.isMarked = false;
        gGame.markedCount--;
        renderCountMarked()
        // console.log('gGame.markedCount',gGame.markedCount)
        console.log('cellClicked', cellClicked) //למחוק
        // console.log('gGame.rigthMarkedCount',gGame.rigthMarkedCount)
        

        if (cellClicked.isMine === true) {
            gGame.rigthMarkedCount--;
        }
        renderCell(i, j, content, elCell);
    }

}

function renderCountMarked() {
    var elFlags = document.querySelector('.flags');
    var countFlags = gLevel.MINES - gGame.markedCount;
    elFlags.innerHTML = `🚩 ${countFlags}`;
}



function cellClicked(elCell, i, j) {
    if (!gTimerInterval) gTimerInterval = startTimer('.timer', true);
    if (gGame.isOn === false) return;
    if (gGame.isHint === true){
        getHint(elCell,i,j); return;
    } 

    var cellClicked = gBoard[i][j];


    if (gIsFirstClick === true) {
        if (cellClicked.isMarked) return;
        onFirstClick(elCell, i, j);
        return;
    }

    if (cellClicked.isMarked === true || cellClicked.isShown === true) return;
    if (cellClicked.isMine === true) {
        gameOver(i, j, cellClicked, elCell);
        return;
    }
    cellClicked.isShown = true;
    gGame.shownCount++;
    var content = cellClicked.minesAroundCount;
    if (cellClicked.minesAroundCount === 0) content = LONE;
    renderCell(i, j, content, elCell);


    if (isVictory(gBoard)) {
        handleVictory()
        return;
    }
    else if (cellClicked.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    }
}

function renderCell(i, j, content, elCell) {
    // Select the elCell and set the value
    if (!elCell) {
        var elCell = document.querySelector(`.cell-${i}-${j}`);
    }
    elCell.innerHTML = content;
}


function expandShown(board, elCell, rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx ||
                j < 0 || j >= board[0].length) continue;
            var currCell = board[i][j];
            if (currCell.isShown === true || currCell.isMarked === true) continue;
            currCell.isShown = true;
            gGame.shownCount++;

            if (isVictory(gBoard)) {
                var elCurrCell = document.querySelector(`.cell-${i}-${j}`);
                renderCell(i, j, LONE, elCurrCell);
                handleVictory()
                return;
            }
            var content = currCell.minesAroundCount;
            if (currCell.minesAroundCount === 0) {
                expandShown(board, elCell, i, j)
                content = LONE;
            }
            var elCurrCell = document.querySelector(`.cell-${i}-${j}`)
            renderCell(i, j, content, elCurrCell);
        }
    }
}

