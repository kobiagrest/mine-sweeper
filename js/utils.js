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

function drawLocation(locations) {
  return locations.shift();
}

function resetLocations(board,rowIdx,colIdx) {
  var locations = []; 
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if(i===rowIdx && j===colIdx) continue;
      var currLocation = { i: i, j: j };
      locations .push(currLocation);
    }
    shuffle(locations);
  }
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


function renderCell(i, j, content, elCell) {
  // Select the elCell and set the value
  if (!elCell) {
      var elCell = document.querySelector(`.cell-${i}-${j}`);
  }
  elCell.innerHTML = content;
}

function startTimer (selector){
  var el = document.querySelector(selector);
  var countDownDate = new Date();
  var cuntUpTimerIntreval = setInterval(function() {
      var now = new Date().getTime();
      var distance = now - countDownDate.getTime();
    
      // var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
      var strTimer =`${minutes} m ${seconds} s`;
      
      el.innerHTML = strTimer;
    }, 1000);
    return cuntUpTimerIntreval;
}