
// location such as: {i: 2, j: 7}

// function countNeighbors(cellI, cellJ, board, value) {
//   var negsCount = 0;
//   for (var i = cellI - 1; i <= cellI + 1; i++) {
//     if (i < 0 || i >= board.length) continue;
//     for (var j = cellJ - 1; j <= cellJ + 1; j++) {
//       if (j < 0 || j >= board[i].length) continue;
//       if (i === cellI && j === cellJ) continue;
//       if (board[i][j] === value) negsCount++;
//     }
//     return negsCount;
//   }
// }

function printContentBoard(board) {
  var newBoard = [];
  for (var i = 0; i < board.length; i++) {
    newBoard[i] = [];
    for (var j = 0; j < board[0].length; j++) {
      newBoard[i][j] = board[i][j].minesAroundCount;
    }
  }
  console.table(newBoard);
}
function copyMatOnePropety(mat, propety) {
  var newMat = [];
  for (var i = 0; i < mat.length; i++) {
    newMat[i] = [];
    for (var j = 0; j < mat[0].length; j++) {
      newMat[i][j] = mat[i][j].propety;
    }
  }
  return newMat;
}

function drawLocation(locations) {
  return locations.shift();
}

function resetLocations(board) {
  var locations = []; 
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      var currLocation = { i: i, j: j };
      locations .push(currLocation);
    }
    shuffle(locations);
  }
  // console.log('locations:',locations)
  return locations;
}

function shuffle(items) {
  var randIdx, keep, i;
  for (i = items.length - 1; i > 0; i--) {
    randIdx = getRandomIntInclusive(0, items.length - 1);
    keep = items[i];
    items[i] = items[randIdx];
    items[randIdx] = keep;
  }
  return items;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

function getRndLocation(board) {
  var rowIdx = getRandomIntInclusive(0, gBoard.length - 1);
  var colIdx = getRandomIntInclusive(0, gBoard.length - 1);
  var rndLocation = { i: rowIdx, j: colIdx };
  return rndLocation;
}

function disContextMenu(selector) {
  var elnoContext = document.querySelector(selector);
  elnoContext.addEventListener(`contextmenu`, e => {
    e.preventDefault();
  })
}
