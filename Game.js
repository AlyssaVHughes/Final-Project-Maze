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
        if(this.on && this.onPath && this.lastRow) {  //you win if you meet 3 conditions: if you are A:on a tile, B: that tile is on the path, and C: the tile is on the last row of the board 
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
    constructor(){  //construct a custom variable for the board that involves all of the characteristics 
        this.cols = 32;  // set 32 squares to be in each row and column
        this.rows = 32;
        this.tiles = [];  //this is the array of tiles, and each numerical value corresponds to a tile
        document.addEventListener("click", this.handleClick.bind(this)); //add an event listener, so that the code knows to respond to an action 
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        this.currentTileIndex;
    }

    boardSetup() {
        createCanvas(800, 800);
        background(51);
    }

    createTiles() {  //this section is where we create the tiles that will be drawn later. We start by creating the values that relate to each tile, and then determining each time the code runs which of those values are assigned to be good and bad tiles 
        //first, i is the start index. Its between 0 and 32
        let start = Math.floor(Math.random()*32);  //this part calculates a random number between 0 and 32 to set as the start tile

        //We need to make a list of indexes, such that each tile at those index are "in the path"
        let x = start;  //the x value of the start tile is equal to the number that was randomly calculated in the above line, and sets the start tile 
        let pathTileIndexes = []; //this is the array of tiles that will consist of all of the correct tiles in the path. the below code calculates the random numbers, and then pushes the calculations up to the array
        pathTileIndexes.push(x); //the stuff that happens in the below lines calculates some random numbers that touch each other. The .push pushes these calculated number into the array above which equals the path tile index. So the numbers in the array become the tiles that are good.  
        while(x < 992){
            var choices = {up: null, left: null, right: null, down: null};
            if(x > 31) choices.up = x-32;
            if(x%32 != 0) choices.left = x-1;
            if(x%32 != 31) choices.right = x+1;
            choices.down = x+32;
            var choice; //^ all of this code is what creates an array of random numbers that correspond to the tiles that are part of the good path

            var dieRoll = Math.floor(Math.random()*20);  //this is the code that created the random path and makes sure all of the tiles on the path are next to each other
            if(dieRoll < 3 && choices.up != null) choice = choices.up;
            else if(dieRoll < 9 && choices.left != null) choice = choices.left;
            else if(dieRoll < 15 && choices.right != null) choice = choices.right;
            else choice = choices.down;

            if(!pathTileIndexes.includes(choice)) pathTileIndexes.push(choice); //pushes the choice which is the ranomly calculated number to the array
            x = choice;
        }

        //Now we'll create the actual tiles. ***I DONT REALLY UNDERSTAND THIS SECTION**

        let z = 0;  //z is the counter that tells you which index you are at in the array of lines. anywhere from 0 to 1024
        for(var row = 0; row < this.rows; row++){  //this is the for loop that actually creates the tiles and repeats them on the x axis 
            for (var col = 0; col < this.cols; col++){  //this is the for loop that repeats the tiles on the y axis, so it looks like a grid
                var startTile = (z==start) ? true : false;  //
                var onPath;  //create a variable that applies to all tiles on the path
                if(pathTileIndexes.includes(z)) onPath = true; //if statement that says: if the path 
                else onPath = false;
                var lastRow = z > 991;  //variable that states that the last row is all of the tiles that have a value that is greater than 991
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

    checkForLoss(){  //this section causes the game to end when you make more than 20 mistakes
        if(errorCounter > 20){  //if you make more than 20 mistakes then...
            textSize(60);  //test that is sized 20 appears
            fill('rgb(200, 0, 0)'); //the text will be red
            text('YOU LOSE >:(', 20, 200);  //the text says you lose
            gameOver = true;//when the error counter reaches 20 then the game over is true, which tells the code that you cannot play anymore
        }
    }

    handleClick(event){  //this is the code that responds to the event when the mouse is clicked
        if (!gameOver && event.x < 800 && event.y < 800){ //you can continue to click new squares if its not game over or if you havent reached a tile greater than 800 (you havent reached the bottom row yet)
            for(let i = 0; i < this.tiles.length; i++){  //the square starts at 0 and continuously repeats by 1 
                if(this.tiles[i].x >= (event.x-25) && this.tiles[i].x < (event.x) && this.tiles[i].y >= (event.y-25) && this.tiles[i].y < (event.y)){
                    if((i == this.currentTileIndex - 1 && this.currentTileIndex%32!=0) || (i == this.currentTileIndex + 1 && this.currentTileIndex%32!=31) || i == this.currentTileIndex + 32 || i == this.currentTileIndex -32){  //these are the cases where you are able to click a tile. It makes it so that you can only click the tiles that are above, below, or to the left or right of the current tile
                        this.tiles[i].tileClick();  //if the conditions are met, the tile gets clicked
                        this.currentTileIndex = i;  //the conditions of the if statement rely on the specification that i is the current tile you are on
                        this.tiles.forEach(tile => tile.on = false);  //
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

    handleKeyDown(event){ //this is the code that responds to the event keyDown, which means the left right up and down keys are pressed
        //The 4 accepted keyz are left, right, up, down. 
        let newTile;  //variable that is used below, tells the game to shift the current tile
        if(!gameOver) { //the arrow keys work as long as it is not game over yet 
            if(event.key === "Right" || event.key === "ArrowRight"){  //the computer knows what Right and ArrowRight are, and the if statement applies if those keys are pressed
                //if we can, we move to the right.
                if(this.currentTileIndex%32 != 31){  //! 31 means not 31, so the if statement wont apply if the current tile is on the right edge and skip to the other lower side
                    newTile = this.currentTileIndex + 1; //basically if the right arrow key is pressed, then the cureent tile will shift up one, which is always to the right of the tiles on the board because the value of the tiles increase horizontally 
                    this.tiles[newTile].tileClick();
                    this.currentTileIndex = newTile;
                    this.tiles.forEach(tile => tile.on = false);
                    this.tiles[newTile].on = true;
    
                    //Here, we will check if the tile we clicked is on the path we created. If it is NOT, we will add to our error Counter and increase the penalty for next time.
                    if(!this.tiles[newTile].onPath){  //if the tile is not on the path then...
                        errorCounter += errorPenalty; //the error penalty will go up 
                        errorPenalty *= 3;  //the error penalty multiplies by 3 till it gets to 20
                    }
                    //If we click on a tile that is on the path, we don't add any error points, and we revert the error penalty to 1. 
                    else {
                        errorPenalty = 1;
                    }
                }
            }
            else if (event.key === "Left" || event.key === "ArrowLeft"){ //the computer knows what Left and ArrowLeft are, and the if statement applies if those keys are pressed
                //if we can, we move to the left.
                if(this.currentTileIndex%32 != 0){  //! 0 means not 0, so the if statement wont apply if the current tile is on the left edge and skip to the other lower side
                    newTile = this.currentTileIndex - 1;  //if the left arrow is presssed, it subtracts 1 on the current tile counter, placing the current tile at 1 less than before 
                    this.tiles[newTile].tileClick();
                    this.currentTileIndex = newTile;
                    this.tiles.forEach(tile => tile.on = false);
                    this.tiles[newTile].on = true;
    
                    //Here, we will check if the tile we clicked is on the path we created. If it is NOT, we will add to our error Counter and increase the penalty for next time.
                    if(!this.tiles[newTile].onPath){
                        errorCounter += errorPenalty;//makes sure its on path every time we use the arrow key and if its not then we add the error penalty
                        errorPenalty *= 3;
                    }
                    //If we click on a tile that is on the path, we don't add any error points, and we revert the error penalty to 1. 
                    else {
                        errorPenalty = 1; //if you make an error, the counter goes up 1 
                    }
                }
    
            }
            else if (event.key === "Up" || event.key === "ArrowUp"){
                //if we can, we move up.
                if(this.currentTileIndex > 31) { //you can only use the up arrow if the tile is not on the top row, because it wouldnt have anywhere to go up
                    newTile = this.currentTileIndex - 32; //when you subtract 32, it takes you to the tile directly above you
                    this.tiles[newTile].tileClick();  
                    this.currentTileIndex = newTile; //after you cnage tiles, the new tile becomes the current tile, so that you can continue using the arrow keys with current tile as the starting point 
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
                newTile = this.currentTileIndex + 32; //same thing as before, only adding 32 so that the new tile is directly below where it was before 
                this.tiles[newTile].tileClick();
                this.currentTileIndex = newTile;   //the current tile updates
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

