
// Function to change the score
function changeScore() {
    //increments global score variable by 1
    score++;
    // updates the score label
    labelScore.setText(score.toString());
}// the functions associated with preload, create and update.
var actions = { preload: preload, create: create, update: update };
// Some more instructions
var backgroungVelocity = 0.11;

var height = 400;
var width = 790;
var game = new Phaser.Game(width, height, Phaser.AUTO, "game", actions);
// The rest of the file
var score = 0;
// Global variable to hold the text displaying the score.
var labelScore;
// Global player variable declared but not initialised.
var player;
// Global pipes variable initialised to the empty array.
var pipes = [];
// the interval (in seconds) at which new pipe columns are spawned
var pipeInterval = 1.1;
var gravi = 2000;
var fire;
var floor;
var sky;
// Loads all resources for the game and gives them names.

var gapMargin = 20;
var gapSize = 100;
var blockHeight = 50;

jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + " (" +
    jQuery("#email").val() + "): " + jQuery("#score").val() + "</p>");
    //event_details.preventDefault();
});
function preload() {
    // make image file available to game and associate with alias playerImg
    game.load.image("playerImg","../assets/flappy-cropped.png");
    // make sound file available to game and associate with alias score
    game.load    .audio("score", "../assets/point.ogg");
    // make image file available to game and associate with alias pipe
    game.load.image("pipe","../assets/pipe.png");
    game.load.image("Fire","../assets/fire.png");
    game.load.image("floor","../assets/floor.png");
    game.load.image("background", "../assets/images.jpg");
}
function create(){
    game.stage.setBackgroundColor("#2A8C8B"); //blue2A8C8B
    game.add.text(280, 180, "Enter for SUPERHARDCORE",
        {font:"30px Arial", fill: "#ASDFGH"});
    game.add.text(180, 240, "Space for SUPERMEGAULTRAHARDCORE",
        {font:"30px Arial", fill: "#ASDFGH"});
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(begin);
}

var bgtile;
// Initialises the game. This function is only called once.
function start() {
    gapSize = 100;
    //game.time.events.loop(1 * Phaser.Timer.SECOND, function(){
    //    var background = game.add.sprite(0, 0, "background");
    //    game.physics.arcade.enable(background);
    //    background.body.velocity.x = -backgroungVelocity;
    //});
    bgtile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('background').height, 'background');
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.remove(begin);
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
    game.stage.setBackgroundColor("#ASDFGH"); //blue2A8C8B
    // set the background colour of the scene

    // add welcome text

    // initialise the player and associate it with playerImg
    floor = game.add.sprite(0,390, "floor");
    fire = game.add.sprite(40, 180, "Fire");
    player = game.add.sprite(80, 200, "playerImg");
    game.add.text(20, 20, "GLHF",
        {font: "30px Arial", fill: "#FFFFFF"});
    // add score text
    labelScore = game.add.text(20, 60, "0",
        {font: "30px Arial", fill: "#FFFFFF"});
    // Start the ARCADE physics engine.
    // ARCADE is the most basic physics engine in Phaser.
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // enable physics for the player sprite
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(fire);
    // set the player's gravity
    player.body.gravity.y = gravi;
    fire.body.gravity.y = gravi;
    // associate spacebar with jump function
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);

    // time loop for game to update
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);

    player.checkWorldBounds = true;
    player.events.onOutOfBounds.add(gameOver);
}

function begin() {
    gapSize = 60;
    //game.time.events.loop(1 * Phaser.Timer.SECOND, function(){
    //    var background = game.add.sprite(0, 0, "background");
    //    game.physics.arcade.enable(background);
    //    background.body.velocity.x = -backgroungVelocity;
    //});
    bgtile = game.add.tileSprite(0, 0, game.stage.bounds.width, game.cache.getImage('background').height, 'background');
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.remove(begin);
    game.stage.setBackgroundColor("#ASDFGH"); //blue2A8C8B
    // set the background colour of the scene

    // add welcome text

    // initialise the player and associate it with playerImg
    floor = game.add.sprite(0,390, "floor");
    fire = game.add.sprite(40, 180, "Fire");
    player = game.add.sprite(80, 200, "playerImg");
    game.add.text(20, 20, "GLHF",
        {font: "30px Arial", fill: "#FFFFFF"});
    // add score text
    labelScore = game.add.text(20, 60, "0",
        {font: "30px Arial", fill: "#FFFFFF"});
    // Start the ARCADE physics engine.
    // ARCADE is the most basic physics engine in Phaser.
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // enable physics for the player sprite
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(fire);
    // set the player's gravity
    player.body.gravity.y = gravi;
    fire.body.gravity.y = gravi;
    // associate spacebar with jump function
    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(playerJump);

    // time loop for game to update
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);

    player.checkWorldBounds = true;
    player.events.onOutOfBounds.add(gameOver);
}
// This function updates the scene. It is called for every new frame.
function update() {
    // Call gameOver function when player overlaps with any pipe
    //game.physics.arcade.overlap(player, floor, gameOver);
    game.physics.arcade.collide(player, pipes, gameOver);

    if (bgtile)
        bgtile.tilePosition.x -= 30;



}

// Adds a pipe part to the pipes array
function addPipeBlock(x, y) {
    // make a new pipe block
    var block = game.add.sprite(x,y,"pipe");
    // insert it in the pipe array
    pipes.push(block);
    // enable physics engine for the block
    game.physics.arcade.enable(block);
    // set the block's horizontal velocity to a negative value
    // (negative x value for velocity means movement will be towards left)
    block.body.velocity.x = -800;
}

//// Generate moving pipe
//function generatePipe() {
//    // Generate  random integer between 1 and 5. This is the location of the
//    // start point of the gap.
//    var gapStart = game.rnd.integerInRange(1, 5);
//    // Loop 8 times (8 is the height of the canvas).
//    for (var count = 0; count < 8; count++) {
//        // If the value of count is not equal to the gap start point
//        // or end point, add the pipe image.
//        if(count != gapStart && count != gapStart+1){
//            addPipeBlock(750, count * 50);
//        }
//    }
//    // Increment the score each time a new pipe is generated.
//    changeScore();
//}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for(var y=gapStart; y > 0 ; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }
    for(var y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    changeScore();
}

function playerJump() {
    // the more negative the value the higher it jumps
    player.body.velocity.y = -500;
    fire.body.velocity.y = -500;
}

// Function to change the score
function changeScore() {
    //increments global score variable by 1
    score++;
    // updates the score label
    labelScore.setText(score.toString());
}

function gameOver() {
    game.destroy();
    $("#score").val(score);
    $("#greeting").show();

}
$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});
