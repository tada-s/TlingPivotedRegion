/* 
 * This javascript implements the main algorithm.
 */

var board = {
	cell: [],
	cellRow: 100,
	cellColumn: 100
};

const LABEL_UNDEF = -1;

const CELL_NULL = 0;
const CELL_EMPTY = 1;
const CELL_PIVOT = 2;

var adjI = [1, 0, -1, 0];
var adjJ = [0, 1, 0, -1];

var cell_label = [];
var label_cell = [];

var g = [];
var residual = [];
var visited = [];

var b = [];
var w = [];
var p = [];
var pAuxLabel = {};

var board_tromino = []


/** Initialization **/

function initBoard(){
	board.cell = [];
	board.rotation = [];
	board.flip = [];
	board.color = [];
	cell_label = [];
	for(var i = 0; i < board.cellRow; i++){
		board.cell.push([]);
		board.rotation.push([]);
		board.flip.push([]);
		board.color.push([]);
		cell_label.push([]);
		for(var j = 0; j < board.cellColumn; j++){
			board.cell[i].push(CELL_NULL);
			board.rotation[i].push(0);
			board.flip[i].push(1);
			board.color[i].push(0);
			cell_label[i].push(LABEL_UNDEF);
		}
	}
}

/** Main Tiling Algorithm **/

function calculateTiling(){
	makeGraph();
	console.log(g);
	maxflow();
	board_tromino = [];
	for(var i = 0; i < b.length; i++){
		var v1 = b[i];
		for(var k1 = 0; k1 < g[v1].length; k1++){
			var v2 = g[v1][k1];
			if(!(v2 == 0 || v2 == 1)){
				var cell2 = label_cell[v2];
				var type2 = board.cell[cell2[0]][cell2[1]];
				if(type2 == CELL_PIVOT && residual[v1][v2] == 0){
					var v3 = pAuxLabel[v2];
					for(var k3 = 0; k3 < g[v3].length; k3++){
						var v4 = g[v3][k3];
						var cell4 = label_cell[v4];
						if(cell4[0] % 2 == 0 && residual[v3][v4] == 0){
							board_tromino.push([label_cell[v1], label_cell[v2], label_cell[v4]]);
						}
					}
				}
			}
		}
	}
	//console.log(board_tromino);
}

function makeGraph(){
	var n = 2;
	b = [];
	w = [];
	p = [];
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			if(board.cell[i][j] == CELL_EMPTY || board.cell[i][j] == CELL_PIVOT){
				cell_label[[i, j]] = n;
				label_cell[n] = [i, j];
				n++;
			}
		}
	}

	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){

			if(board.cell[i][j] == CELL_EMPTY){
				if(i % 2 == 0){
					w.push(cell_label[[i, j]]);
				}else{
					b.push(cell_label[[i, j]]);
				}
			}else if(board.cell[i][j] == CELL_PIVOT){
				p.push(cell_label[[i, j]]);
			}
		}
	}
	g = [];
	residual = [];
	var v = n + p.length;
	for(var i = 0; i < v; i++) {
		g.push([]);
		residual.push([]);
		for(var j = 0; j < v; j++){
			residual[i].push(0);
		}
	}
	
	for(var i = 0; i < b.length; i++){
		g[0].push(b[i]);
		g[b[i]].push(0);
		residual[0][b[i]] = 1;
	}

	for(var i = 0; i < w.length; i++){
		g[w[i]].push(1);
		g[1].push(w[i]);
		residual[w[i]][1] = 1;
	}

	pAuxLabel = {};
	for(var i = 0; i < p.length; i++){
		pAuxLabel[p[i]] = n + i;
		g[p[i]].push(n + i);
		g[n + i].push(p[i]);
		residual[p[i]][n + i] = 1;
	}
	
	for(var i = 0; i < board.cellRow; i++){
		for(var j = 0; j < board.cellColumn; j++){
			if(board.cell[i][j] == CELL_PIVOT){
				var uLabel = cell_label[[i, j]];
				
				for(var k = 0; k < 4; k++){
					var i2 = i + adjI[k];
					var j2 = j + adjJ[k];
					if((0 <= i2 && i2 < board.cellRow) && (0 <= j2 && j2 < board.cellColumn)){
						if(board.cell[i2][j2] == CELL_EMPTY){
							var vLabel = cell_label[[i2, j2]];
							if(i2 % 2 == 0){
								g[pAuxLabel[uLabel]].push(vLabel);
								g[vLabel].push(pAuxLabel[uLabel]);
								residual[pAuxLabel[uLabel]][vLabel] = 1;
							}else{
								g[vLabel].push(uLabel);
								g[uLabel].push(vLabel);
								residual[vLabel][uLabel] = 1;
							}
						}
					}
				}
			}
		}
	}
}

function augmentPathDFS(u){
	if(u == 1) return true;

	visited[u] = true;
	for(var k = 0; k < g[u].length; k++){
		var v = g[u][k];
		if(!visited[v] && residual[u][v] == 1){
			residual[u][v] = 0;
			residual[v][u] = 1;
			
			if(augmentPathDFS(v)){
				return true;
			}

			residual[u][v] = 1;
			residual[v][u] = 0;
		}
	}
	return false;
}

function augmentPath(){
	for(var i = 0; i < g.length; i++){
		visited[i] = false;
	}
	return augmentPathDFS(0);
}

function maxflow(){
	var flow = 0;
	while(augmentPath()){
		flow++;
	}
	console.log("maxFlow = " + flow);
}

