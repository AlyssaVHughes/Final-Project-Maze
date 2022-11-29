class Tile {  //start by creating a class for tile. Like a customized variable that will be used later to include tiles on the board 
    constructor (x, y, onPath, start, lastRow) {
        this.x = x;
        this.y = y;
        this.lastRow = lastRow;
        this.onPath = onPath;
        this.clicked = false;
        this.start = start;
        this.on = this.start ? true : false;  
        //Start listing all of the qualities that will be necessary to create a tile. Like what does the tile need to do? 
    }

    tileDraw () {
        //On the tile, and its correct
        if(this.on && this.onPath){
            fill('rgb(0,255,0)'); 
            rect(this.x, this.y, 20, 20);  //if the current tile is a tile on the correct path, the color will become green
        }

        //On the tile, and its wrong
        else if(this.on && !this.onPath){
            fill('rgb(100%,0%,10%)');
            rect(this.x, this.y, 20, 20);  //if the current tile is a tile on the wrong path, the color will change to red 
        }

        //clicked the tile and its on the path
        else if(!this.on && ((this.clicked && this.onPath) || this.start) ){
            fill(255);
            rect(this.x, this.y, 20, 20); //if a tile has been clicked previously and was part of the correct path, it will turn and remain white
        }

        //clicked the tile and its not on the path
        else if(!this.on && this.clicked && !this.onPath){
            fill(0);
            rect(this.x, this.y, 20, 20); //if the tile has been clicked previously and was on the wrong path, the tile will become black
        }

        //You haven't clicked this tile yet and its not the start tile
        else {
            fill(31); //all unclicked tiles remain grey 
            rect(this.x, this.y, 20, 20);
        }
        //If you click on one of the tiles of the last row and it is a tile on the correct path, the you win will show up 
        if(this.on && this.onPath && this.lastRow) {
            fill('rgb(0,200,0)');
            rect(this.x, this.y, 20, 20);
            textSize(60);
            fill('rgb(0, 200, 0)');
            text('YOU WIN :)', 20, 200);
            gameOver = true;
        }
    }

    tileClick() {
        this.clicked = true
    }
}

class Board {
    constructor(){
        this.cols = 32;
        this.rows = 32;
        this.tiles = [];
        document.addEventListener("click", this.handleClick.bind(this));
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.currentTileIndex;
    }

    boardSetup() {
        createCanvas(800, 800);
        background(51);
    }

    createTiles() {
        //first, i is the start index. Its between 0 and 32
        let start = Math.floor(Math.random()*32);

        //We need to make a list of indexes, such that each tile at those index are "in the path"
        let x = start;
        let pathTileIndexes = [];
        pathTileIndexes.push(x);
        while(x < 992){
            var choices = {up: null, left: null, right: null, down: null};
            if(x > 31) choices.up = x-32;
            if(x%32 != 0) choices.left = x-1;
            if(x%32 != 31) choices.right = x+1;
            choices.down = x+32;
            var choice;

            var dieRoll = Math.floor(Math.random()*20);
            if(dieRoll < 3 && choices.up != null) choice = choices.up;
            else if(dieRoll < 9 && choices.left != null) choice = choices.left;
            else if(dieRoll < 15 && choices.right != null) choice = choices.right;
            else choice = choices.down;

            if(!pathTileIndexes.includes(choice)) pathTileIndexes.push(choice);
            x = choice;
        }

        //Now we'll create the actual tiles.
        let z = 0;
        console.log(pathTileIndexes);
        for(var row = 0; row < this.rows; row++){
            for (var col = 0; col < this.cols; col++){
                var startTile = (z==start) ? true : false;
                var onPath;
                if(pathTileIndexes.includes(z)) onPath = true;
                else onPath = false;
                var lastRow = z > 991;
                var t = new Tile(col*25, row*25, onPath, startTile, lastRow);
                this.tiles.push(t);
                z += 1;
            }
        }
        this.currentTileIndex = start;

    }

    drawTiles(){
        this.tiles.forEach(tile => {
            tile.tileDraw();
        })
    }

    checkForLoss(){
        if(errorCounter > 20){
            textSize(60);
            fill('rgb(200, 0, 0)');
            text('YOU LOSE >:(', 20, 200);
            gameOver = true;
        }
    }

    handleClick(event){
        if (!gameOver && event.x < 800 && event.y < 800){
            for(let i = 0; i < this.tiles.length; i++){
                if(this.tiles[i].x >= (event.x-25) && this.tiles[i].x < (event.x) && this.tiles[i].y >= (event.y-25) && this.tiles[i].y < (event.y)){
                    if((i == this.currentTileIndex - 1 && this.currentTileIndex%32!=0) || (i == this.currentTileIndex + 1 && this.currentTileIndex%32!=31) || i == this.currentTileIndex + 32 || i == this.currentTileIndex -32){
                        this.tiles[i].tileClick();
                        this.currentTileIndex = i;
                        this.tiles.forEach(tile => tile.on = false);
                        this.tiles[i].on = true;

                        //Here, we will check if the tile we clicked is on the path we created. If it is NOT, we will add to our error Counter and increase the penalty for next time.
                        if(!this.tiles[i].onPath){
                            errorCounter += errorPenalty;
                            errorPenalty *= 3;
                        }
                        //If we click on a tile that is on the path, we don't add any error points, and we revert the error penalty to 1. 
                        else {
                            errorPenalty = 1;
                        }
                        break;
                    }
                }
            }
        }
    }

    handleKeyDown(event){
        //The 4 accepted keyz are left, right, up, down. 
        let newTile;
        if(!gameOver) {
            if(event.key === "Right" || event.key === "ArrowRight"){
                //if we can, we move to the right.
                if(this.currentTileIndex%32 != 31){
                    newTile = this.currentTileIndex + 1;
                    this.tiles[newTile].tileClick();
                    this.currentTileIndex = newTile;
                    this.tiles.forEach(tile => tile.on = false);
                    this.tiles[newTile].on = true;
    
                    //Here, we will check if the tile we clicked is on the path we created. If it is NOT, we will add to our error Counter and increase the penalty for next time.
                    if(!this.tiles[newTile].onPath){
                        errorCounter += errorPenalty;
                        errorPenalty *= 3;
                    }
                    //If we click on a tile that is on the path, we don't add any error points, and we revert the error penalty to 1. 
                    else {
                        errorPenalty = 1;
                    }
                }
            }
            else if (event.key === "Left" || event.key === "ArrowLeft"){
                //if we can, we move to the left.
                if(this.currentTileIndex%32 != 0){
                    newTile = this.currentTileIndex - 1;
                    this.tiles[newTile].tileClick();
                    this.currentTileIndex = newTile;
                    this.tiles.forEach(tile => tile.on = false);
                    this.tiles[newTile].on = true;
    
                    //Here, we will check if the tile we clicked is on the path we created. If it is NOT, we will add to our error Counter and increase the penalty for next time.
                    if(!this.tiles[newTile].onPath){
                        errorCounter += errorPenalty;
                        errorPenalty *= 3;
                    }
                    //If we click on a tile that is on the path, we don't add any error points, and we revert the error penalty to 1. 
                    else {
                        errorPenalty = 1;
                    }
                }
    
            }
            else if (event.key === "Up" || event.key === "ArrowUp"){
                //if we can, we move up.
                if(this.currentTileIndex > 31) {
                    newTile = this.currentTileIndex - 32;
                    this.tiles[newTile].tileClick();
                    this.currentTileIndex = newTile;
                    this.tiles.forEach(tile => tile.on = false);
                    this.tiles[newTile].on = true;
    
                    //Here, we will check if the tile we clicked is on the path we created. If it is NOT, we will add to our error Counter and increase the penalty for next time.
                    if(!this.tiles[newTile].onPath){
                        errorCounter += errorPenalty;
                        errorPenalty *= 3;
                    }
                    //If we click on a tile that is on the path, we don't add any error points, and we revert the error penalty to 1. 
                    else {
                        errorPenalty = 1;
                    }
                }
    
            }
            else if (event.key === "Down" || event.key === "ArrowDown"){
                //we can always move down.
                newTile = this.currentTileIndex + 32;
                this.tiles[newTile].tileClick();
                this.currentTileIndex = newTile;
                this.tiles.forEach(tile => tile.on = false);
                this.tiles[newTile].on = true;
    
                //Here, we will check if the tile we clicked is on the path we created. If it is NOT, we will add to our error Counter and increase the penalty for next time.
                if(!this.tiles[newTile].onPath){
                    errorCounter += errorPenalty;
                    errorPenalty *= 3;
                }
                //If we click on a tile that is on the path, we don't add any error points, and we revert the error penalty to 1. 
                else {
                    errorPenalty = 1;
                }
            }
        }
        
    }
    
}

var board = new Board();
var errorCounter = 0;
var errorPenalty = 1;
var gameOver = false;

function setup () {
    board.boardSetup();
    board.createTiles();
}

function draw() {
    board.drawTiles();
    board.checkForLoss();
}

