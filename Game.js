class Tile {  //start by creating a class for tile. Like a customized variable that will be used later to include tiles on the board 
    
    //all of the qualities that will be necessary to create a tile. Like what does the tile need to do? 
    constructor (x, y, onPath, start, lastRow) {
        this.x = x; //x coordinate of tile
        this.y = y; //y coordinate of tile
        this.lastRow = lastRow; //boolean: true if tile is in last row
        this.onPath = onPath;   //boolean: true if tile is on the path
        this.visited = false;   //boolean: true if tile has been visisted by player yet
        this.start = start;     //boolean: true if tile is the start tile
        this.on = this.start ? true : false;  //boolean: true if tile is the one player is currently on
    }

    //function that draws the tile in its correct position, with the correct color based on the tile's status.
    tileDraw () {

        //On the tile, and its correct
        if(this.on && this.onPath){
            fill('rgb(0,255,0)'); 
            rect(this.x, this.y, 20, 20);  //if the current tile is a tile on the correct path, the rectangle will become green
        }

        //On the tile, and its wrong
        else if(this.on && !this.onPath){
            fill('rgb(100%,0%,10%)');
            rect(this.x, this.y, 20, 20);  //if the current tile is a tile on the wrong path, the color will change to red 
        }

        //clicked the tile and its on the path
        else if(!this.on && ((this.visited && this.onPath) || this.start) ){
            fill(255);
            rect(this.x, this.y, 20, 20); //if a tile has been clicked previously and was part of the correct path, it will turn and remain white
        }

        //clicked the tile and its not on the path
        else if(!this.on && this.visited && !this.onPath){
            fill(0);
            rect(this.x, this.y, 20, 20); //if the tile has been clicked previously and was on the wrong path, the tile will become black
        }
                
        //If you click on one of the tiles of the last row and it is a tile on the correct path, then 'you win' will show up 
        if(this.on && this.onPath && this.lastRow) {  //you win if you meet 3 conditions: if you are A:on a tile, B: that tile is on the path, and C: the tile is on the last row of the board 
            fill('rgb(0,200,0)');
            rect(this.x, this.y, 20, 20);
            textSize(60);
            fill('rgb(0, 200, 0)');
            text('YOU WIN :)', 20, 200);
            gameOver = true;
        }

        //You haven't clicked this tile yet and its not the start tile
        else {
            fill(31); //all unclicked tiles remain grey 
            rect(this.x, this.y, 20, 20);
        }


    }

}

class Board {
    constructor(){  //construct a custom variable for the board that involves all of the characteristics 
        this.cols = 32;  // set 32 squares to be in each row and column
        this.rows = 32;
        this.tiles = [];  //this is the array of tiles. It will be 32x32 = 1024 in length, after it is filled up in createTiles().
        document.addEventListener("click", this.handleClick.bind(this)); //add an event listener, so that the code knows to respond to a click
        document.addEventListener("keydown", this.handleKeyDown.bind(this)); //add an event listener, so that the code knows to respond to a key press 
        this.currentTileIndex; //number: the index in the tiles array corresponding to the tile the player is currently on
    }

    boardSetup() {
        createCanvas(800, 800);
        background(51);
    }

    //this section is where we create the tiles that will be drawn later. 
    //We start by creating the values that relate to each tile, and then determining each time the code runs
    // which of those values are assigned to be good and bad tiles 
    createTiles() {  

        //first is the start index. Its between 0 and 32 so the player can randomly start anywhere in the top row
        let start = Math.floor(Math.random()*32);  //this part calculates a random number between 0 and 32 to set as the start tile

        //We need to make a list of indexes, such that each tile at those indexes are "on the path"
        let pathTileIndex = start;  //the starting block is always in the path, so the first pathTileIndex is set equal to start 
        let pathTileIndexes = []; //this is the array of tiles that will consist of all of the correct tiles in the path.
        pathTileIndexes.push(x);  

        //the stuff that happens in the below lines calculates some random tiles that touch each other and go to the last row. 
        //The .push pushes these tiles into the array above. 
        //So the numbers in the array become the tile indexes that are good.  
        while(pathTileIndex < 992){ //stop whenever the last row is reached, not before!
            var choices = {up: null, left: null, right: null, down: null};
            if(pathTileIndex > 31) choices.up = pathTileIndex-32;
            if(pathTileIndex%32 != 0) choices.left = pathTileIndex-1;
            if(pathTileIndex%32 != 31) choices.right = pathTileIndex+1;
            choices.down = pathTileIndex+32;
            var choice; //^ all of this code is what creates an array of random numbers that correspond to the tiles that are part of the good path

            var dieRoll = Math.floor(Math.random()*20);  //this is the code that created the random path and makes sure all of the tiles on the path are next to each other
            if(dieRoll < 3 && choices.up != null) choice = choices.up;
            else if(dieRoll < 9 && choices.left != null) choice = choices.left;
            else if(dieRoll < 15 && choices.right != null) choice = choices.right;
            else choice = choices.down;

            if(!pathTileIndexes.includes(choice)) pathTileIndexes.push(choice); //pushes the choice which is the ranomly calculated number to the array if its not already in the array
            pathTileIndex = choice; //Last, important to update the pathTileIndex so that the while loop works
        }

        //Now we'll create the actual tiles

        let z = 0;  //z is the counter that tells you which index you are at in the array of tiles. anywhere from 0 to 1024
        for(var row = 0; row < this.rows; row++){  //this is the for loop that actually creates the tiles and repeats them on the x axis 
            for (var col = 0; col < this.cols; col++){  //this is the for loop that repeats the tiles on the y axis, so it looks like a grid
                
                //the three vars below are booleans that determine if the current tile being created is A) the start tile, B) on the path, and C) on the last row of the grid
                var startTile = (z==start) ? true : false;
                var onPath;
                if(pathTileIndexes.includes(z)) onPath = true;
                else onPath = false;
                var lastRow = z > 991;

                //Now to create the tile with all its info. it has 5 parameters: x coordinate, y coordinate, on path boolean (true or false), start tile boolean, and last row boolean
                var t = new Tile(col*25, row*25, onPath, startTile, lastRow);
                this.tiles.push(t); //add the tile we created to the list of tiles.
                z += 1;
            }
        }
        
        //the last thing to do before the game starts is set the current tile index to the start tile.
        // This can be changed by the player when they move around the grid.
        this.currentTileIndex = start; 

    }

    //p5 repeatedly calls this through draw() to draw all the tiles we created
    //this section calls the tileDraw method for every tile in the array. array was filled up in createTiles().
    drawTiles(){
        this.tiles.forEach(tile => {
            tile.tileDraw();
        })
    }

    //p5 repeatedly calls this through draw() to check if you lost the game yet.
    //this section causes the game to end when you make more than 20 mistakes
    checkForLoss(){  
        if(errorCounter > 20){  //if you make more than 20 mistakes then...
            textSize(60);  //text that is sized 20 appears
            fill('rgb(200, 0, 0)'); //the text will be red
            text('YOU LOSE >:(', 20, 200);  //the text says you lose
            gameOver = true; //when the error counter reaches 20 then the game over is true, which tells the code that you cannot play anymore
        }
    }

    //this is the code that responds to the event when the mouse is clicked
    handleClick(event){
        if (!gameOver && event.x < 800 && event.y < 800){ //you can continue to click new squares if its not game over. You also can't click outside the grid (which is 800x800)
            for(let i = 0; i < this.tiles.length; i++){
                if(this.tiles[i].x >= (event.x-25) && this.tiles[i].x < (event.x) && this.tiles[i].y >= (event.y-25) && this.tiles[i].y < (event.y)){
                    if((i == this.currentTileIndex - 1 && this.currentTileIndex%32!=0) || (i == this.currentTileIndex + 1 && this.currentTileIndex%32!=31) || i == this.currentTileIndex + 32 || i == this.currentTileIndex -32){  //these are the cases where you are able to click a tile. It makes it so that you can only click the tiles that are above, below, or to the left or right of the current tile
                        this.tiles[i].visted = true;  //if the conditions are met, the tile gets visited
                        this.currentTileIndex = i;  //the conditions of the if statement rely on the specification that i is the current tile you are on
                        this.tiles.forEach(tile => tile.on = false);  //
                        this.tiles[i].on = true;

                        //Here, we will check if the tile we clicked is on the path we created. If it is NOT, we will add to our error Counter and increase the penalty for next time.
                        if(!this.tiles[i].onPath){
                            errorCounter += errorPenalty;
                            errorPenalty *= 3;
                        }
                        //If we click on a tile that is on the path, we don't add any error points, and we set the error penalty to 1. 
                        else {
                            errorPenalty = 1;
                        }
                        break;
                    }
                }
            }
        }
    }

    //this is the code that responds to the event keyDown, which means the left right up and down keys are pressed
    handleKeyDown(event){ 
        //The 4 accepted keyz are left, right, up, down. 
        let newTile;  //variable that is used below, tells the game to shift the current tile
        if(!gameOver) { //the arrow keys work as long as it is not game over yet 
            if(event.key === "Right" || event.key === "ArrowRight"){  //the computer knows what Right and ArrowRight are, and the if statement applies if those keys are pressed
                //if we can, we move to the right.
                if(this.currentTileIndex%32 != 31){  // the if statement wont apply if the current tile is on the right edge and skip to the other lower side
                    newTile = this.currentTileIndex + 1; //basically if the right arrow key is pressed, then the cureent tile will shift up one because the value of the tiles increase horizontally 
                    this.tiles[newTile].visited = true; //this tile is now visited (affects its color on the grid)
                    this.currentTileIndex = newTile; //this tile is also now the index of the currentTile.
                    this.tiles.forEach(tile => tile.on = false); //now, you aren't on any of the other tiles except this new one
                    this.tiles[newTile].on = true; //you are on this tile.
    
                    //check if the tile we clicked is on the path we created. If not, add to our error Counter and increase the penalty for next time you mess up.
                    if(!this.tiles[newTile].onPath){  //if the tile is not on the path then...
                        errorCounter += errorPenalty; //the errorCounter will go up by the amount in errorPenalty
                        errorPenalty *= 3;  //the errorPenalty multiplies by 3 for each consecutive L you take
                    }
                    //If we click on a tile that is on the path, we don't add any error points, and we revert the errorPenalty to 1. 
                    else {
                        errorPenalty = 1;
                    }
                }
            }

            else if (event.key === "Left" || event.key === "ArrowLeft"){ //the computer knows what Left and ArrowLeft are, and the if statement applies if those keys are pressed
                //if we can, we move to the left.
                if(this.currentTileIndex%32 != 0){  //! 0 means not 0, so the if statement wont apply if the current tile is on the left edge and skip to the other lower side
                    newTile = this.currentTileIndex - 1;  //if the left arrow is presssed, it subtracts 1 on the current tile counter, placing the current tile at 1 less than before 
                    //all this next code is the same as in the 'ArrowRight' case
                    this.tiles[newTile].visited = true;
                    this.currentTileIndex = newTile;
                    this.tiles.forEach(tile => tile.on = false);
                    this.tiles[newTile].on = true;
                    if(!this.tiles[newTile].onPath){
                        errorCounter += errorPenalty;
                        errorPenalty *= 3;
                    }
                    else {
                        errorPenalty = 1;
                    }
                }
    
            }

            else if (event.key === "Up" || event.key === "ArrowUp"){ //the computer knows what Up and ArrowUp are, and the if statement applies if those keys are pressed
                //if we can, we move up.
                if(this.currentTileIndex > 31) { //you can only use the up arrow if the tile is not on the top row, because it wouldnt have anywhere to go up
                    newTile = this.currentTileIndex - 32; //when you subtract 32, it takes you to the tile directly above you
                    //same stuff again
                    this.tiles[newTile].visited = true;  
                    this.currentTileIndex = newTile; //after you change tiles, the new tile becomes the current tile, so that you can continue using the arrow keys with current tile as the starting point 
                    this.tiles.forEach(tile => tile.on = false);
                    this.tiles[newTile].on = true;
                    if(!this.tiles[newTile].onPath){
                        errorCounter += errorPenalty;
                        errorPenalty *= 3;
                    }
                    else {
                        errorPenalty = 1;
                    }
                }
    
            }


            else if (event.key === "Down" || event.key === "ArrowDown"){
                //we can always move down as long as the game is not over
                newTile = this.currentTileIndex + 32; //same thing as before, only adding 32 so that the new tile is directly below where it was before 
                //same stuff again
                this.tiles[newTile].visited = true;
                this.currentTileIndex = newTile; 
                this.tiles.forEach(tile => tile.on = false);
                this.tiles[newTile].on = true;
                if(!this.tiles[newTile].onPath){
                    errorCounter += errorPenalty;
                    errorPenalty *= 3;
                }
                else {
                    errorPenalty = 1;
                }
            }

        }   
    }
}


var board = new Board();
var errorCounter = 0; //counter that when its >20, the player loses.
var errorPenalty = 1; //penalty that gets worse if you make consecutive mistakes without returning to the path.
var gameOver = false; //boolean: only turns true if you make it to the onPath tile of the last row without >20 errors or you make >20 errors

function setup () {
    board.boardSetup(); //makes the grid background
    board.createTiles(); //makes all the tiles for this round of the game
}

function draw() {
    board.drawTiles(); //repeatedly draw the tiles
    board.checkForLoss(); //repeatedly check for loss
}

