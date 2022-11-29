class Tile {  //start by creating a class for tile. Like a customized variable that will be used later to include tiles on the board 
    constructor (x, y, onPath, start) {
        this.x = x;
        this.y = y;
        this.lastRow = x > 991
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
        fill('rgb(200,0 ,0)');
        rect(this.x, this.y, 20, 20);
        textSize(60);
        fill('rgb(200, 0, 0)');
        text('YOU WIN :)', 20, 200);
        }

tileClick() 
    this.clicked = true

    }
}


class Board {
    constructor(){
        this.cols = 32;
        this.rows = 32;
        this.tiles = [];
        //this.leftKey = 
        //this.rightKey =
        //this.upKey = 
        //this.downKey = 
        //this.keystate = 

        document.addEventListener("click", this.handleClick.bind(this));
        
        //document.addEventListener("keydown", function (e) {
          //  keystate[e.keyCode] = true;
        //});
        //document.addEventListener("keyup", function (e) {
          //  delete keystate[e.keyCode];
        //});
        
       // if (keystate[leftKey]) {
        //code to be executed when left arrow key is pushed.
        //}
        //if (keystate[upKey]) {
        //code to be executed when up arrow key is pushed.
        //}
        //if (keystate[rightKey]) {
        //code to be executed when right arrow key is pushed.
        //}
        //if (keystate[downKey]) {
        //code to be executed when down arrow key is pushed.
        //}
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
                var t = new Tile(col*25, row*25, onPath, startTile);
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

    handleClick(event){
        if (event.x < 800 && event.y < 800){
            for(let i = 0; i < this.tiles.length; i++){
                if(this.tiles[i].x >= (event.x-25) && this.tiles[i].x < (event.x) && this.tiles[i].y >= (event.y-25) && this.tiles[i].y < (event.y)){
                    if((i == this.currentTileIndex - 1 && this.currentTileIndex%32!=0) || (i == this.currentTileIndex + 1 && this.currentTileIndex%32!=31) || i == this.currentTileIndex + 32 || i == this.currentTileIndex -32){
                        this.tiles[i].tileClick();
                        this.currentTileIndex = i;
                        this.tiles.forEach(tile => tile.on = false);
                        this.tiles[i].on = true;
                        break;
                    }
                }
            }
        }
    }
    
}

var board = new Board();

function setup () {
    board.boardSetup();
    board.createTiles();
}

function draw() {
    board.drawTiles();
}

