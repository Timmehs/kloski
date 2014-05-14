var gameBoard =
		[["l11","l12","l31","l32", "sm3"],
		 ["b1", "b3", "h1","sm1", "e1"  ],
		 ["b2", "b4", "h2","sm2", "e2"  ], 
		 ["l21","l22","l41","l42", "sm4"]];
	

//initPiece(gameBoard[0][1]);
	
var moveCounter = 0;
	
	
$(document).ready(function(){
	
	updatePieces();
	
});

function updatePieces() {
	var pieces = ["#l11","#b1","#l21", "#l31","#h1", "#l41","#sm1","#sm2","#sm3","#sm4"];
	var gamePiece;
	var i;
	var surrounds;
	$("#status").text("Updating");
	for (i = 0; i < pieces.length; i++) {
		gamePiece = $(pieces[i]);
		surrounds = checkAround(findPiece(gamePiece.attr('id')));
		defineConstraints(surrounds, pieces[i]);
	}
	$("#status").text("Stopped " + moveCounter);
	
	if (gameBoard[2][4] == "b4") {
		alert("YOU HAVE SOLVED THE ANCIENT PUZZLE OF KLOSKI!!!");
	}
}
	
	
function defineConstraints(surrounds, id) {
	var gamePiece = $(id);
	var coordinates = [gamePiece.position().left, gamePiece.position().top];
	var position = gamePiece.offset();
	var type = id.substring(1,2);
	var oldX = position.left;
	var oldY = position.top;
	var newX = oldX;
	var newY = oldY;
	var constraints = [];
	var x,y;
	
	switch (type) {
		case "s":
			constraints = smallChecks(surrounds, oldX, oldY);
			break;
		case "l":
			constraints = longChecks(surrounds, oldX, oldY);
			break;
		case "h":
			constraints = horizontalChecks(surrounds, oldX, oldY);
			break;
		case "b":
			constraints = blockChecks(surrounds, oldX, oldY);
			break;
		default:
			break;
	}
	
	gamePiece.draggable({
		containment: constraints,
		stack: ".sm, .long_v, .long_h,",
		grid: [100,100],
		start: function(event, ui) {
				$("#status").text("Started" + moveCounter);
				x = event.originalEvent.pageX;
				y = event.originalEvent.pageY;
			},
		drag: function(event) {
			if (x && y) {
				axis = Math.abs(event.originalEvent.pageX - x) > Math.abs(event.originalEvent.pageY - y) ? 'x' : 'y';
				gamePiece.draggable('option', 'axis', axis);
				x = y = null;
			}
		},
		stop: function(event,ui) {
			$("#status").text("Stopped " + moveCounter);
			x = y = null;
			gamePiece.draggable('option', 'axis', false);
			if ($(id).offset().left != position.left) {
				swapBlanks(id, coordinates);
				moveCounter++;
			} else if($(id).offset().top != position.top) {
				swapBlanks(id, coordinates);
				moveCounter++;
			}
			updatePieces();
		},
		distance: 20
	});
}

function swapBlanks(id, coordinates) {
	var oldX = coordinates[0]/100;
	var oldY = coordinates[1]/100;
	var gamePiece = $(id);
	var newPosition = gamePiece.position();
	var newX = newPosition.left/100;
	var newY = newPosition.top/100;
	var type = id.substring(1,2);
	var tmpId;
	switch (type) {
		case 's':
			gameBoard[oldX][oldY] = gameBoard[newX][newY];
			gameBoard[newX][newY] = id.substring(1);
			$("#"+gameBoard[oldX][oldY]).css({left: oldX * 100, top: oldY * 100});
			break;
		case 'l':
			if (newY == oldY +1) {
				// Slid down once
				gameBoard[oldX][oldY] = gameBoard[oldX][oldY+2];
				gameBoard[newX][newY+1] = gameBoard[oldX][oldY+1];
				gameBoard[newX][newY] = id.substring(1);
				$("#"+gameBoard[oldX][oldY]).css({left: oldX * 100, top: oldY * 100});
				
			} else if (newY == oldY - 1) {
				// Slid up once
				// bottom to middle, top to bottom, top to id
				gameBoard[oldX][oldY] = gameBoard[oldX][oldY+1];
				gameBoard[oldX][oldY+1] = gameBoard[newX][newY];
				gameBoard[newX][newY] = id.substring(1);
				//alert(gameBoard[0] + "\n" + gameBoard[1] + "\n" + gameBoard[2] + "\n" + gameBoard[3]);
				$("#"+gameBoard[oldX][oldY+1]).css({left: oldX*100, top: (oldY+1) * 100});
			} else if (newX != oldX) {
				// Slid Left or right
				gameBoard[oldX][oldY] = gameBoard[newX][newY];
				gameBoard[newX][newY] = gameBoard[oldX][oldY+1];
				gameBoard[oldX][oldY+1] = gameBoard[newX][newY+1];
				gameBoard[newX][newY+1] = gameBoard[newX][newY];
				gameBoard[newX][newY] = id.substring(1);
				$("#"+gameBoard[oldX][oldY]).css({left: oldX*100, top: (oldY) * 100});
				$("#"+gameBoard[oldX][oldY+1]).css({left: oldX*100, top: (oldY+1) * 100});
			} 
			else if (newY == (oldY + 2) || newY == oldY -2) {
				// Slid down twice
				// 1st bottom to original, middle to new
				// 2nd bottom to middle, head to 1st bottom
				gameBoard[oldX][oldY] = gameBoard[newX][newY];
				gameBoard[newX][newY] = gameBoard[oldX][oldY+1];
				gameBoard[oldX][oldY+1] = gameBoard[newX][newY+1];
				gameBoard[newX][newY+1] = gameBoard[newX][newY];
				gameBoard[newX][newY] = id.substring(1);
				
				$("#"+gameBoard[oldX][oldY]).css({left: oldX*100, top: (oldY) * 100});
				$("#"+gameBoard[oldX][oldY+1]).css({left: oldX*100, top: (oldY+1) * 100});
			} 
			break;
		case 'h':
			if (newY < oldY) {
				gameBoard[oldX][oldY] = gameBoard[newX][newY];
				gameBoard[newX][newY] = gameBoard[oldX+1][oldY];
				gameBoard[oldX+1][oldY] = gameBoard[newX+1][newY];
				gameBoard[newX+1][newY] = gameBoard[newX][newY];
				gameBoard[newX][newY] = id.substring(1);
				$("#"+gameBoard[oldX][oldY]).css({left: oldX*100, top:  oldY * 100});
				$("#"+gameBoard[oldX+1][oldY]).css({left: (oldX+1)*100, top:  oldY * 100});
			} else if (newY > oldY) {
				gameBoard[oldX][oldY] = gameBoard[newX][newY];
				gameBoard[newX][newY] = gameBoard[oldX+1][oldY];
				gameBoard[oldX+1][oldY] = gameBoard[newX+1][newY];
				gameBoard[newX+1][newY] = gameBoard[newX][newY];
				gameBoard[newX][newY] = id.substring(1);
				$("#"+gameBoard[oldX][oldY]).css({left: oldX*100, top:  oldY * 100});
				$("#"+gameBoard[oldX+1][oldY]).css({left: (oldX+1)*100, top:  oldY * 100});	
			} else if (newX > oldX) {
				gameBoard[oldX][oldY] = gameBoard[newX+1][newY];
				gameBoard[newX+1][newY] = gameBoard[oldX+1][oldY];
				gameBoard[newX][newY] = id.substring(1);
				$("#"+gameBoard[oldX][oldY]).css({left: oldX*100, top:  oldY * 100});
			} else if (newX < oldX) {
				gameBoard[oldX+1][oldY] = gameBoard[newX][newY];
				gameBoard[newX+1][newY] = gameBoard[oldX+1][oldY];
				gameBoard[newX][newY] = id.substring(1);
				$("#"+gameBoard[oldX+1][oldY]).css({left: (oldX+1)*100, top:  oldY * 100});
			}
			break;
		case 'b':
			if (newY > oldY) {
				gameBoard[oldX][oldY] = gameBoard[newX][newY+1];
				gameBoard[oldX+1][oldY] = gameBoard[newX+1][newY+1];
				gameBoard[newX][newY] = "b1";
				gameBoard[newX+1][newY] = "b2";
				gameBoard[newX][newY+1] = "b3";
				gameBoard[newX+1][newY+1] = "b4";
				$("#"+gameBoard[oldX+1][oldY]).css({left: (oldX+1)*100, top:  oldY * 100});
				$("#"+gameBoard[oldX][oldY]).css({left: (oldX)*100, top:  oldY * 100});
			} else if (newY < oldY) {
				gameBoard[oldX][oldY+1] = gameBoard[newX][newY];
				gameBoard[oldX+1][oldY+1] = gameBoard[newX+1][newY];
				gameBoard[newX][newY] = "b1";
				gameBoard[newX+1][newY] = "b2";
				gameBoard[newX][newY+1] = "b3";
				gameBoard[newX+1][newY+1] = "b4";
				$("#"+gameBoard[oldX+1][oldY+1]).css({left: (oldX+1)*100, top:  (oldY+1) * 100});
				$("#"+gameBoard[oldX][oldY+1]).css({left: (oldX)*100, top:  (oldY+1) * 100});
			} else if (newX > oldX) {
				gameBoard[oldX][oldY] = gameBoard[newX+1][newY];
				gameBoard[oldX][oldY+1] = gameBoard[newX+1][newY+1];
				gameBoard[newX][newY] = "b1";
				gameBoard[newX+1][newY] = "b2";
				gameBoard[newX][newY+1] = "b3";
				gameBoard[newX+1][newY+1] = "b4";
				$("#"+gameBoard[oldX][oldY]).css({left: (oldX)*100, top:  (oldY) * 100});
				$("#"+gameBoard[oldX][oldY+1]).css({left: (oldX)*100, top:  (oldY+1) * 100});
			} else if (newX < oldX) {
				gameBoard[oldX+1][oldY] = gameBoard[newX][newY];
				gameBoard[oldX+1][oldY+1] = gameBoard[newX][newY+1];
				gameBoard[newX][newY] = "b1";
				gameBoard[newX+1][newY] = "b2";
				gameBoard[newX][newY+1] = "b3";
				gameBoard[newX+1][newY+1] = "b4";
				$("#"+gameBoard[oldX+1][oldY]).css({left: (oldX+1)*100, top:  (oldY) * 100});
				$("#"+gameBoard[oldX+1][oldY+1]).css({left: (oldX+1)*100, top:  (oldY+1) * 100});
			
			}
			
			
			break;
		default:
			break;
	}
	//alert(gameBoard[0] + "\n" + gameBoard[1] + "\n" + gameBoard[2] + "\n" + gameBoard[3]);
	
}

function blockChecks(surrounds, oldX, oldY) {
	var newX = oldX;
	var newY = oldY;
	if (surrounds[0] == 'e' && surrounds[7] == 'e')
		oldX -= 100;
	if (surrounds[1] == 'e' && surrounds[2] == 'e')
		oldY -= 100;
	if (surrounds[3] == 'e' && surrounds[4] == 'e')
		newX += 100;
	if (surrounds[5] == 'e' && surrounds[6] == 'e')
		newY += 100;
	return [oldX, oldY, newX, newY];
}

function longChecks(surrounds, oldX, oldY){
	var newX = oldX;
	var newY = oldY;
	if (surrounds[0] == 'e' && surrounds[5] == 'e') {
		oldX -= 100;
	}
	if (surrounds[1] == 'e') {
		oldY -= 100;
	}
	if (surrounds[1] == '2e')
		oldY -= 200;
	if (surrounds[2] == 'e' && surrounds[3] == 'e')
		newX += 100;
	if (surrounds[4] == 'e')
		newY += 100;
	if (surrounds[4] == '2e')
		newY += 200;
	
	return [oldX, oldY, newX, newY];
}

function horizontalChecks(surrounds, oldX, oldY){
	var newX = oldX;
	var newY = oldY;
	if (surrounds[0] == 'e') {
		oldX -= 100;
	} else if (surrounds[0] == '2e') {
		oldX -= 200;
	}
	if (surrounds[1] == 'e' && surrounds[2] == 'e') {
		oldY -= 100;
	}
	if (surrounds[3] == 'e') {
		newX += 100;
	} else if (surrounds[3] == '2e') {
		newX += 200;
	}

	if (surrounds[4] == 'e' && surrounds[5] == 'e') {
		newY += 100;
	}
	
	
	return [oldX, oldY, newX, newY];
}

function smallChecks(surrounds, oldX, oldY){
	var newX = oldX;
	var newY = oldY;
	if (surrounds[0] == 'e') {
		oldX -= 100;
	}
	if (surrounds[1] == 'e') {
		oldY -= 100;
	}
	if (surrounds[2] == 'e') {
		newX += 100;
	}
	if (surrounds[3] == 'e') {
		newY += 100;
	}
	if (surrounds[0] == '2e') {
		oldX -= 200;
	}
	if (surrounds[1] == '2e') {
		oldY -= 200;
	}
	if (surrounds[2] == '2e') {
		newX += 200;
	}
	if (surrounds[3] == '2e') {
		newY += 200;
	}
	return [oldX, oldY, newX, newY];
}
	

function findPiece(id) {
	var results = [];
	var i, j;
	for (i = 0; i < gameBoard.length; i++) {
		for (j = 0; j < gameBoard[i].length; j++) {
			if (id == gameBoard[i][j]) {
				//alert("Found at " + j + "," + i	);
				results = [i,j];
				return results;
			}
		}
	}
}
	
function getPieceType(x,y) {
	var type;
	if (x < 0 || x > 3 || y < 0 || y > 4) {
		type = "x";
	} else {
		type = gameBoard[x][y].substring(0,1);
	}
	return type;
}


function checkAround(coordinates){
	var xPos = coordinates[0];
	var yPos = coordinates[1];
	var type = gameBoard[xPos][yPos].substring(0,1);
	var surroundingPieces = [];
	// Remember board takes Y then X
	switch (type) {
		// Remember pieces > 1 Piece check from "Header" piece
		case "s":
			surroundingPieces[0] = getPieceType(xPos-1, yPos); // Left
			surroundingPieces[1] = getPieceType(xPos, yPos-1); // Top
			surroundingPieces[2] = getPieceType(xPos+1, yPos); // Right
			surroundingPieces[3] = getPieceType(xPos, yPos+1); // Bottom
			// check for 2 empties in a row
			if (surroundingPieces[0] == 'e' && getPieceType(xPos-2, yPos) == 'e' ) {
				surroundingPieces[0] = '2e';
			}
			if (surroundingPieces[1] == 'e' && getPieceType(xPos, yPos - 2) == 'e' ) {
				surroundingPieces[1] = '2e';
			}
			if (surroundingPieces[2] == 'e' && getPieceType(xPos+2, yPos) == 'e' ) {
				surroundingPieces[2] = '2e';
			}
			if (surroundingPieces[3] == 'e' && getPieceType(xPos, yPos + 2) == 'e' ) {
				surroundingPieces[3] = '2e';
			}
			return surroundingPieces;
		case "l":
			surroundingPieces[0] = getPieceType(xPos-1, yPos); // topLeft
			surroundingPieces[1] = getPieceType(xPos, yPos-1); // Top
			surroundingPieces[2] = getPieceType(xPos+1, yPos); // topRight
			surroundingPieces[3] = getPieceType(xPos+1, yPos+1); // bottomRight
			surroundingPieces[4] = getPieceType(xPos, yPos+2); // Bottom
			surroundingPieces[5] = getPieceType(xPos-1, yPos+1); // Bottom
			// check for 2 empties in a row
			if (surroundingPieces[1] == 'e' && getPieceType(xPos, yPos-2) == 'e' ) {
				surroundingPieces[1] = '2e';
			}
			if (surroundingPieces[4] == 'e' && getPieceType(xPos, yPos + 3) == 'e' ) {
				surroundingPieces[4] = '2e';
			}
			return surroundingPieces;
		case "h":
			surroundingPieces[0] = getPieceType(xPos-1, yPos); // Left
			surroundingPieces[1] = getPieceType(xPos, yPos-1); // leftTop
			surroundingPieces[2] = getPieceType(xPos+1, yPos-1); // rightTop
			surroundingPieces[3] = getPieceType(xPos+2, yPos); // Right
			surroundingPieces[4] = getPieceType(xPos+1, yPos+1); // rightBottom
			surroundingPieces[5] = getPieceType(xPos, yPos+1); // rightBottom
			// check for 2 empties in a row
			if (surroundingPieces[0] == 'e' && getPieceType(xPos-2, yPos) == 'e' ) {
				surroundingPieces[0] = '2e';
			}
			if (surroundingPieces[3] == 'e' && getPieceType(xPos + 3, yPos) == 'e' ) {
				surroundingPieces[3] = '2e';
			}
			return surroundingPieces;
		case "b":
			surroundingPieces[0] = getPieceType(xPos-1, yPos); // Left
			surroundingPieces[1] = getPieceType(xPos, yPos-1); // leftTop
			surroundingPieces[2] = getPieceType(xPos+1, yPos-1); // rightTop
			surroundingPieces[3] = getPieceType(xPos+2, yPos); // Right
			surroundingPieces[4] = getPieceType(xPos+2, yPos+1); // rightBottom
			surroundingPieces[5] = getPieceType(xPos+1, yPos+2); // rightBottom
			surroundingPieces[6] = getPieceType(xPos, yPos+2); // rightBottom
			surroundingPieces[7] = getPieceType(xPos-1, yPos+1); // rightBottom
			return surroundingPieces;
			break;
		default:
			break;
	}
}
	

function refreshBoard() {
	// This function needs to update 
	// move arrow hints for pieces near
	// blank spaces.
}
