/* 
 * This javascript handles the input from web browser events.
 */

window.onload = eventInitialize;

// Canvas
var elementCanvas;
// Mouse Corrdinates
var mouse = {
	x: 0,
	y: 0
};


/** Event Initialize **/

function eventInitialize(){
	elementCanvas = document.getElementById("canvasMain");
	elementCanvas.addEventListener("mousedown", eventMouseDown);
	elementCanvas.addEventListener("mouseup", eventMouseUp);
	elementCanvas.addEventListener("mousemove", eventMouseMove);

	var elementButtonTiling = document.getElementById("buttonTiling");
	elementButtonTiling.addEventListener("click", eventButtonTilingPress);
	var elementButtonAddTromino = document.getElementById("buttonAddTromino");
	elementButtonAddTromino.addEventListener("click", eventButtonAddTrominoPress);

	initDraw();
	initBoard();

	draw();
}

/** Button Press **/
function eventButtonTilingPress(evt){
	if(drawTrominoFlag){
		drawTrominoFlag = false;
		this.innerHTML = "Show tiling";
		generateGraph();
	}else{
		drawTrominoFlag = true;
		this.innerHTML = "Clear tiling";
		calculateTiling();
	}
	draw();
}

function eventButtonAddTrominoPress(evt){
	document.getElementById("buttonTiling").innerHTML = "Clear tiling";
	drawTrominoFlag = true;
	addTromino();
	draw();
}

/** Event Mouse Down **/

function eventMouseDown(evt){
	updateMouseCoord(evt);
	
	c = getCellIndex(mouse);
	if((0 < c.i && c.i < board.cellRow - 1) && (0 < c.j && c.j < board.cellColumn - 1)){
		if(board.cell[c.i][c.j] == CELL_NULL){
			board.cell[c.i][c.j] = CELL_EMPTY;
		}else if(board.cell[c.i][c.j] == CELL_EMPTY){
			board.cell[c.i][c.j] = CELL_PIVOT;
		}else{
			board.cell[c.i][c.j] = CELL_NULL;
		}
	}
	
	generateGraph();
	if(drawTrominoFlag){
		calculateTiling();
	}
	draw();
}

/** Event Mouse Up **/

function eventMouseUp(evt){
	updateMouseCoord(evt);

	//draw();
}

/** Event Mouse Move **/

function eventMouseMove(evt){
	updateMouseCoord(evt);

	//draw();
}

/** Mouse **/

function updateMouseCoord(evt){
	var clientCanvasRect = elementCanvas.getBoundingClientRect();
	var m = {x:-1, y:-1};
	scaleX = canvas.width / clientCanvasRect.width,
	scaleY = canvas.height / clientCanvasRect.height;
	m.x = Math.round((evt.clientX - clientCanvasRect.left) * scaleX - coordBoardScreenOffX);
	m.y = -Math.round((evt.clientY - clientCanvasRect.top) * scaleY - coordBoardScreenOffY);

	mouse = m;
}

/** Cell and Position **/

function getCellIndex(position){
	var i1 = getCellI(position.x, position.y);
	var j1 = getCellJ(position.x, position.y);
	return {i: i1, j: j1};
}

