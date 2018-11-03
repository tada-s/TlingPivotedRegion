/* 
 * This javascript renders in canvas.
 */

var canvas, ctx;
var drawTrominoFlag = false;

/** Initialization **/

function initDraw(){
	canvas = document.getElementById("canvasMain");
	ctx = canvas.getContext("2d");
	drawTrominoFlag = false;
}

/** Main draw **/

function draw(){ 
	clearCanvas();
	drawBoard();
	if(drawTrominoFlag){
		drawTrominoes();
	}
	drawPivots();

}

/** Main draw methods **/

/** Clear Canvas **/

function clearCanvas(){
	ctx.fillStyle = "rgba(255, 255, 255, 1)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/** Draw grids **/

function drawBoard(){
	// Background Grid
	ctx.strokeStyle = "rgba(0, 0, 0, 0.02)";
	ctx.lineWidth = 2;

	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			var x = getCellX(i, j);
			var y = getCellY(i, j);
			drawCell(x, y, sizeBoardCell);
		}
	}

	// Cell
	ctx.strokeStyle = "rgba(150, 150, 150, 1)";
	ctx.lineWidth = 2;
	ctx.fillStyle = "rgba(230, 230, 230, 1)";

	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			if(board.cell[i][j] != CELL_NULL){
				var x = getCellX(i, j);
				var y = getCellY(i, j);
				fillCell(x, y, sizeBoardCell);
				drawCell(x, y, sizeBoardCell);
			}
		}
	}
}

/** Draw Trominoes **/

function drawTrominoes(){
	ctx.fillStyle = "rgba(50, 50, 50, 1)";

	

	for(var i = 0; i < board_tromino.length; i++){
		var tromino = board_tromino[i];
		var rotation = 0;
		
		var dx = tromino[0][1] - tromino[1][1] + tromino[2][1] - tromino[1][1];
		var dy = tromino[0][0] - tromino[1][0] + tromino[2][0] - tromino[1][0];
		
		rotation = (1 - dx) + (1 - Math.abs(dx + dy) / 2);
		
		var x = getCellX(tromino[1][0], tromino[1][1]);
		var y = getCellY(tromino[1][0], tromino[1][1]);
		drawTromino(x, y, rotation);
	}
}

function drawPivots(){
	ctx.strokeStyle = "rgba(230, 230, 230, 1)";
	ctx.fillStyle = "rgba(160, 160, 160, 1)";
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			if(board.cell[i][j] == CELL_PIVOT){
				var x = getCellX(i, j);
				var y = getCellY(i, j);
				drawPivot(x, y, sizeBoardCell);
			}
		}
	}
}

/** Auxiliar drawing methods **/

/** Draw a single tromino **/

function drawTromino(x, y, rotation){
	var delta = 3; // Padding parameter
	// Polygon coordinates of tromino in vx, vy
	var vx = [
		- 1 * 0.5 * sizeBoardCell + delta,
		+ 3 * 0.5 * sizeBoardCell - delta,
		+ 3 * 0.5 * sizeBoardCell - delta,
		+ 1 * 0.5 * sizeBoardCell - delta,
		+ 1 * 0.5 * sizeBoardCell - delta,
		- 1 * 0.5 * sizeBoardCell + delta,
		- 1 * 0.5 * sizeBoardCell + delta
	];
	var vy = [
		- 1 * 0.5 * sizeBoardCell + delta,
		- 1 * 0.5 * sizeBoardCell + delta,
		+ 1 * 0.5 * sizeBoardCell - delta,
		+ 1 * 0.5 * sizeBoardCell - delta,
		+ 3 * 0.5 * sizeBoardCell - delta,
		+ 3 * 0.5 * sizeBoardCell - delta,
		- 1 * 0.5 * sizeBoardCell + delta
	];
	// Rotate 
	for(var r = 0; r < rotation; r++){
		for(var i = 0; i < 7; i++){
			var temp = vx[i];
			vx[i] = -vy[i];
			vy[i] = temp;
		}
	}
	
	
	ctx.beginPath();
	ctx.moveTo(x + vx[0] + coordBoardScreenOffX, -(y + vy[0]) + coordBoardScreenOffY);
	for(var i = 1; i < 7; i++){
		ctx.lineTo(x + vx[i] + coordBoardScreenOffX, -(y + vy[i]) + coordBoardScreenOffY);
	}
	ctx.closePath();
	ctx.fill();
}

/** Draw a single cell **/

function drawCell(x, y, size){
	var n = coordCellX.length;
	ctx.beginPath();
	ctx.moveTo(x + coordCellX[n - 1] * size + coordBoardScreenOffX, -(y + coordCellY[n - 1] * size) + coordBoardScreenOffY);
	for(var i = 0; i < n; i++){
		ctx.lineTo(x + coordCellX[i] * size + coordBoardScreenOffX, -(y + coordCellY[i] * size) + coordBoardScreenOffY);
	}
	ctx.closePath();
	ctx.stroke();
}

/** Draw a pivot **/

function drawPivot(x, y, size){
	ctx.beginPath();
	ctx.arc(x + coordBoardScreenOffX, -y + coordBoardScreenOffY, size * .5 * .5, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();

}

/** Fill a single cell **/

function fillCell(x, y, size){
	var n = coordCellX.length;
	ctx.beginPath();
	ctx.moveTo(x + coordCellX[n - 1] * size + coordBoardScreenOffX, -(y + coordCellY[n - 1] * size) + coordBoardScreenOffY);
	for(var i = 0; i < n; i++){
		ctx.lineTo(x + coordCellX[i] * size + coordBoardScreenOffX, -(y + coordCellY[i] * size) + coordBoardScreenOffY);
	}
	ctx.closePath();
	ctx.fill();
}


