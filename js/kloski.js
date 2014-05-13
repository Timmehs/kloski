var gameBoard =
		[["l11","b1","b2","l21"],
		 ["l22","b3","b4","l22"],
		 ["l31","h1","h2","l41"],
		 ["l32","sm1","sm2","l42"],
		 ["sm3","e1","e2","sm4"]];
	
	

function initPiece(id) {
	var type = id.substring(0,1);
	var p = $( "#" + id );
	var position = p.position();
	var surrounds = checkAround(findPiece(id), type);
	defineConstraints(surrounds, id);
}


//initPiece(gameBoard[0][1]);
	
	
	
	
	$(document).ready(function(){
		
		$(".sm").click(function(){
			var surrounds = checkAround(findPiece($(this).attr('id')), "s");
			var id = $(this).attr('id');
			var pos = $(this).offset();
			alert("x: " + pos.left + ", y: " + pos.top);
			defineConstraints(surrounds, id);
		});
		
		$(".long_v").click(function(){
			var surrounds = checkAround(findPiece($(this).attr('id')), "l");
			alert(surrounds);
		});
		
		$(".blank").click(function(){
			checkAround(findPiece($(this).attr('id')), "e");
		
		});
		$(".long_h").click(function(){
			var surrounds = checkAround(findPiece($(this).attr('id')), "h");
			alert(surrounds);
		});
		$(".block").click(function(){
			var surrounds = checkAround(findPiece($(this).attr('id')), "b");
			alert(surrounds);
		});
		
	});
	
	
	function defineConstraints(surrounds, id) {
		var gamePiece = $( "#" + id);
		var position = gamePiece.position().left;
		alert(position);
		
		/*
		var endX = startX;
		var endY = startY;
		if (surrounds[0] == 'e') {
			startX -= 100;
		}
		
		if (surrounds[1] == 'e') {
			startY -= 100;
		}
		if (surrounds[2] == 'e') {
			endX += 100;
		}
		if (surrounds[3] == 'e') {
			endY += 100;
		}
		
		
		$(p).draggable({
			containment: [startX, startY,endX,endY],
			stack: p,
			grid: [100, 100]
			});
		*/
		
	}
		
	
	function findPiece(id) {
		var results = [];
		for (i = 0; i < gameBoard.length; i++) {
			for (j = 0; j < gameBoard[i].length; j++) {
				if (id == gameBoard[i][j]) {
					//alert("Found at " + j + "," + i	);
					results = [j,i];
					return results;
				}
			}
		}
	}
	
	function getPieceType(y,x) {
		var type;
		if (x < 0 || x > 3 || y < 0 || y > 4) {
			type = "x";
		} else {
			type = gameBoard[y][x].substring(0,1);
		}
		return type;
	}
	
	
	function checkAround(coordinates, type){
		var xPos = coordinates[0];
		var yPos = coordinates[1];
		var surroundingPieces = [];
		// Remember board takes Y then X
		switch (type) {
			// Remember pieces > 1 Piece check from "Header" piece
			case "s":
				surroundingPieces[0] = getPieceType(yPos, xPos - 1); // Left
				surroundingPieces[1] = getPieceType(yPos - 1, xPos); // Top
				surroundingPieces[2] = getPieceType(yPos, xPos + 1); // Right
				surroundingPieces[3] = getPieceType(yPos + 1, xPos); // Bottom
				return surroundingPieces;
			case "l":
				surroundingPieces[0] = getPieceType(yPos, xPos - 1); // topLeft
				surroundingPieces[1] = getPieceType(yPos - 1, xPos); // top
				surroundingPieces[2] = getPieceType(yPos, xPos + 1); // topRight
				surroundingPieces[3] = getPieceType(yPos + 1, xPos + 1); // botRight
				surroundingPieces[4] = getPieceType(yPos + 2, xPos); // Bottom
				surroundingPieces[5] = getPieceType(yPos + 1, xPos -1 ); // botLeft
				return surroundingPieces;
			case "h":
				surroundingPieces[0] = getPieceType(yPos, xPos - 1); // left
				surroundingPieces[1] = getPieceType(yPos - 1, xPos); // leftTop
				surroundingPieces[2] = getPieceType(yPos -1, xPos + 1); // rightTop
				surroundingPieces[3] = getPieceType(yPos, xPos + 2); // right
				surroundingPieces[4] = getPieceType(yPos + 1, xPos+1); // rightBot
				surroundingPieces[5] = getPieceType(yPos + 1, xPos); // leftBot
				return surroundingPieces;
			case "b":
				surroundingPieces[0] = getPieceType(yPos, xPos - 1);     // topLeft
				surroundingPieces[1] = getPieceType(yPos - 1, xPos);     // leftTop
				surroundingPieces[2] = getPieceType(yPos -1, xPos + 1);  // rightTop
				surroundingPieces[3] = getPieceType(yPos, xPos + 2);     // topRight
				surroundingPieces[4] = getPieceType(yPos + 1, xPos + 2); // botRight
				surroundingPieces[5] = getPieceType(yPos + 2, xPos + 1); // rightBot
				surroundingPieces[6] = getPieceType(yPos + 2, xPos);     // leftBot
				surroundingPieces[7] = getPieceType(yPos + 1, xPos - 1 ); // rightBot
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
