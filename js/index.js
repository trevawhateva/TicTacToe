$(document).ready(function() {

  //choose X or O
  var user,
      comp,
      clickHolder,
      winner = false;

  $("#myModal").modal('show');

  $('#X').click(function() {
    user = 'X';
    comp = 'O';
    $("#myModal").modal('hide');

  });

  $('#O').click(function() {
    user = 'O';
    comp = 'X';
    $("#myModal").modal('hide');
  });
  //end choose X or O

  var board = [
    '-', '-', '-', //board[0,1,2]
    '-', '-', '-', //board[3,4,5]
    '-', '-', '-' //board[6,7,8]
  ];

  var domBoard = [
    "#one","#two","#three",
    "#four","#five","#six",
    "#seven","#eight","#nine"
  ];

  var winningRow = [];

  $('#again').click(function(){
    winningRow = [];
    winner = false;
    for (var i = 0; i < board.length; i++) {
      board[i] = '-';
    }
    for (var j = 0; j < board.length; j++) {
      $(domBoard[j]).removeClass('clicked-box winning-box').addClass('box').css({'pointer-events':'auto','color':'#008CC2'}).html('<h1>-</h1>');
      $(domBoard[j]).children().removeClass('spin');
    }
    $('#reset').addClass('hide');
    $('.win-banner').html('<h1></h1>');
  });

  //user choice
  $('.box').click(function() {
    clickHolder = $(this).attr('id');
    board[domBoard.indexOf('#' + clickHolder)] = user;
    boardToDom();
    chickenDinner(board,user);
    console.log(winningRow);
    if (!winner) {
      compMove(board);
    } else if (winner) {
      console.log(user + " WINS!");
      highlightWin();
      $('#win').html('<h1>' + user + ' WINS!</h1>');
      $('#reset').removeClass('hide');
    }

    boardToDom();
    console.log(board);

    chickenDinner(board,comp);
    console.log(winningRow);
    if (winner) {
        console.log(comp + " WINS!")
        highlightWin();
        $('#win').html('<h1>' + board[domBoard.indexOf(winningRow[0])] + ' WINS!</h1>');
        $('#reset').removeClass('hide');
      }

    if (!winner) {
      var boardFull = false,
          counter = 0;
      for (var i = 0; i < board.length; i++) {
        if (board[i] != '-') {
          counter++;
        }
      }
      if (counter === 9) {
        $('#win').html('<h1>DRAW!</h1>');
        $('#reset').removeClass('hide');
      }
    }

  });

  // check for win!
  function chickenDinner(board, player) {

    // check rows X
    if (board[0] === player && board[1] === player && board[2] === player) {
      winningRow.push(domBoard[0], domBoard[1], domBoard[2]);
      winner = true;
    }
    if (board[3] === player && board[4] === player && board[5] === player) {
      winningRow.push(domBoard[3], domBoard[4], domBoard[5]);
      winner = true;
    }
    if (board[6] === player && board[7] === player && board[8] === player) {
      winningRow.push(domBoard[6], domBoard[7], domBoard[8]);
      winner = true;
    }

    // check columns X
    if (board[0] === player && board[3] === player && board[6] === player) {
      winningRow.push(domBoard[0], domBoard[3], domBoard[6]);
      winner = true;
    }
    if (board[1] === player && board[4] === player && board[7] === player) {
      winningRow.push(domBoard[1], domBoard[4], domBoard[7]);
      winner = true;
    }
    if (board[2] === player && board[5] === player && board[8] === player) {
      winningRow.push(domBoard[2], domBoard[5], domBoard[8]);
      winner = true;
    }

    // check diagonals x
    if (board[0] === player && board[4] === player && board[8] === player) {
      winningRow.push(domBoard[0], domBoard[4], domBoard[8]);
      winner = true;
    }
    if (board[2] === player && board[4] === player && board[6] === player) {
      winningRow.push(domBoard[2], domBoard[4], domBoard[6]);
      winner = true;
    }

  } // end chickenDinner()

  function compMove(board) {

    var boardCopy = board;
    var moveMade = false;

    // makes winning move if available
    makeWinningMove();

    // block user from making winning move
    blockWinningMove();

    // or take any available
    cornerCenterEdge();

    // makes winning move if available
    function makeWinningMove() {
      if (moveMade === false) {
      for (var i = 0; i < 9; i++) {
        if (boardCopy[i] === '-') {
          boardCopy[i] = comp;
          if (nextMoveWin(boardCopy, comp)) {
            board[i] = comp;
            moveMade = true;
            console.log("winning move");
            break;
          } else {
            boardCopy[i] = '-';
          }
        }
      }
      }
    }

    // blocks user from making winning move
    function blockWinningMove() {
      if (moveMade === false) {
      for (var j = 0; j < 9; j++) {
        if (boardCopy[j] === '-') {
          boardCopy[j] = user;
          if (nextMoveWin(boardCopy, user)) {
            board[j] = comp;
            moveMade = true;
            console.log("block move");
            break;
          } else {
            boardCopy[j] = '-';
          }
        }
      }
      }
    }

    // comp takes corner, center, edges
    function cornerCenterEdge() {
      var allCorners = [0, 2, 6, 8];
      var availCorners = [];
      var allEdge = [1,3,5,7];
      var availEdge = [];

      for (var k = 0; k < allCorners.length; k++) {
        if (board[allCorners[k]] === '-') {
          availCorners.push(allCorners[k]);
        }
      }

      for (var l = 0; l < allCorners.length; l++) {
        if (board[allEdge[l]] === '-') {
          availEdge.push(allEdge[l]);
        }
      }

      // if more than one corner is available move to random corner
      if (availCorners.length > 1 && moveMade === false) {

        var rando = Math.floor(Math.random() * availCorners.length);
        board[availCorners[rando]] = comp;
        moveMade = true;
        console.log("multiple corner move");

        // if only one corner is available move there
      } else if (availCorners.length === 1 && moveMade === false) {

        board[availCorners[0]] = comp;
        moveMade = true;
        console.log("single corner move");

        // if no corners are available move to center square
      } else if (availCorners.length === 0 && board[4] === '-' && moveMade === false) {

        board[4] = comp;
        moveMade = true;
        console.log("center move");

        // otherwise, move to any available edge square
      } else if (moveMade === false && availEdge.length != 0) {

        var rando = Math.floor(Math.random() * availEdge.length);
        board[availEdge[rando]] = comp;
        moveMade = true;
        console.log("edge move");

      }
    }

  }

  function nextMoveWin(board, player) {

    // check rows X
    if (board[0] === player && board[1] === player && board[2] === player) {
      return true;
    }
    if (board[3] === player && board[4] === player && board[5] === player) {
      return true;
    }
    if (board[6] === player && board[7] === player && board[8] === player) {
      return true;
    }

    // check columns X
    if (board[0] === player && board[3] === player && board[6] === player) {
      return true;
    }
    if (board[1] === player && board[4] === player && board[7] === player) {
      return true;
    }
    if (board[2] === player && board[5] === player && board[8] === player) {
      return true;
    }

    // check diagonals x
    if (board[0] === player && board[4] === player && board[8] === player) {
      return true;
    }
    if (board[2] === player && board[4] === player && board[6] === player) {
      return true;
    }

  }

  function boardToDom() {

    for (var i = 0; i < board.length; i++) {

      if (board[i] === 'X' || board[i] === 'O') {
        $(domBoard[i]).html("<h1>" + board[i] + "</h1>").addClass('clicked-box').removeClass('box').css({"pointer-events": "none","color":"white"});
      }

    }
  }

  function highlightWin() {
    for (var i = 0; i < board.length; i++) {
      if (board[i] === '-') {
        $(domBoard[i]).addClass('clicked-box').removeClass('box').css({'pointer-events': 'none', 'color': '#B41F00'});
      }
    }

    for (var i = 0; i < winningRow.length; i++) {
      $(winningRow[i]).addClass('winning-box');
      $(winningRow[i]).children().addClass('spin');
    }

  }

}); //end document ready
