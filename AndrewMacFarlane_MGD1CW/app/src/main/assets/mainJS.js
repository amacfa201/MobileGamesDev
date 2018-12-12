class aSprite {
	 constructor(x, y, imageSRC, velx, vely, spType, scaleX, scaleY){  //Constructor for sprite clase where values are assigned
	 this.zindex = 0;
	 this.x = x;
	 this.y = y;
	 this.vx = velx;
	 this.vy = vely;
	 this.sType = spType;
	 this.sImage = new Image();
	 this.sImage.src = imageSRC;
	 this.sizeX = scaleX; //sets scale of sprite for x
	 this.sizeY = scaleY;  //sets scale of sprite for y
 }

 get xPos(){  //Getter for x position
	return this.x;
 }

 get yPos(){
	return this.y; //Getter for y position
 }


 set xPos(newX){    //Setter for x position
 this.x = newX;
 }

 set yPos(newY){ //Setter for y position
 this.y = newY;
 }


 render()   //Basic render function for drawing simple images
 {
  canvasContext.drawImage(this.sImage,this.x, this.y);
 }
 // Method

 scrollBK(delta) // Used to render the scrolling background
 {
 //var xPos = delta * this.vx;


	 canvasContext.save();

	 canvasContext.scale(this.sizeX, this.sizeY);
	 canvasContext.translate(-delta, 0); //scroll background from input


     //Renders several copies of the image one after another to create seamless scrolling
	 canvasContext.drawImage(this.sImage,0, 0,canvas.width, canvas.height);
	 canvasContext.drawImage(this.sImage,canvas.width, 0, canvas.width, canvas.height);
	 canvasContext.drawImage(this.sImage,canvas.width*2,0, canvas.width, canvas.height);
	 canvasContext.drawImage(this.sImage,canvas.width*4,0, canvas.width, canvas.height);

	 canvasContext.restore();
 }

 sPos(newX,newY){
	 this.x = newX;
	 this.y = newY;
 }

 // Static Method
 //static distance(a, b) {
	 //const dx = a.x - b.x;
	 //const dy = a.y - b.y;

	// return Math.hypot(dx, dy);
 //}

 // Method
 spriteType(){
 //console.log('I am an instance of aSprite!!!');
 }

 }

 class mainGame extends aSprite {

 spriteType(){
super.spriteType();

 }
 }

 var canvas;
 var canvas;
 var canvasContext; //Stores canvas context
 var travel=0;
 var jetPack;
 var missile;

var score = 0; //players score
var dead = 0;   //Boolean 0=Alive 1=Dead
var soundMgr;  //Var for holding the sound manager, this is imported from the Sound.java file
var gameState =0; // 0:Intro Screen, 1:Main Game, 2:Death/Replay Screen







 function resizeCanvas() {  //Sets the height of the canvas relative to the size of the window
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
 }

 function load() //Entry Point for the javascript code as it is called in the HTML file
 {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	init(); //Init function called here to initialize necessary values for game
 }

 function init() {
    //Resetting values in case of errors elsewhere
    gameState =0;
	dead =0;
	score = 0;
	gotHs = 0;
	if (canvas.getContext) {


              //Sets up Event Listeners for window, mouse and touch
			 window.addEventListener('resize', resizeCanvas, false);
			 window.addEventListener('orientationchange', resizeCanvas, false);

			 canvas.addEventListener("touchstart", GetTouch, false);
			 canvas.addEventListener("touchmove", touchXY, true);
			 canvas.addEventListener("touchend", touchUp, false);
			 canvas.addEventListener("click", GetClickDown , false);

			 document.body.addEventListener("touchcancel", touchUp, false);

			 resizeCanvas();

             //Creates instances of sprite class
			 bkgdImage = new aSprite(0,0,"bg3.jpg", 100, 0, "Generic", 1,1);
			 //introBkgd = new aSprite(0,0,"bg3.jpg", 100, 0, "Generic", 1,1);
			 jetPack = new aSprite(100,0,"jetpackman3.png", 0, 0, "Generic");
			 missile = new aSprite(100,0,"missile2.png", 0, 0, "Generic");
			 //Sets sprites to starting positions
			 missile.sPos(800,300);
			 jetPack.sPos(220,0);
			 jetPack.x = 220;
			 jetPack.y = 0;
			 //console.log(theCar.y);
			 if (soundMgr != null) soundMgr.playMusic(0); //Play main music if the sound manager exists, this is to ensure the browser version doesnt crash when attempting to play sounds
             //setInitHS(); //call function to set an initial highscore
			 startTimeMS = Date.now(); //Records start time
			 gameLoop(); //Starts game loop
		}
 }

 function gameLoop(){


//Tracks time to be based into scrollBK.
var elapsed = (Date.now() - startTimeMS)/1000;
	travel += elapsed * bkgdImage.vx;

	if (travel > bkgdImage.sImage.width)
	{
		travel = 0;
	}
startTimeMS = Date.now();
    if(gameState == 0)  //Intro screen gameState
    	{
    	    introRender(elapsed);
    	}

    if(gameState == 1) //Main Game gameState
    	{
	//console.log("X: " + Math.round(missile.x) + "/" + theCar.x + "  Y: " + Math.round(missile.y) + "/" + theCar.y);



	//console.log(dead);
if(jetPack.y < 720)
{
   //console.log("IN")
   jetPack.y +=1.8; // Makes jetpack float back down
}


if(jetPack.y > 720)
{

	jetPack.y = 720; //Sets floor level for jetpack, it cannot go below here
	//console.log(theCar.y)
}
	missile.x -=9.95; // Makes missile travel across the screen from right to left
	update(elapsed);



	    mainRender(elapsed);




	//GetClick();
	Missile(); //Calls missile method to control missiles behaviour including reseting its postion when it can no longer hit the player

	//Draws current player score to canvas
	canvasContext.font = "60px Arial";
	canvasContext.fillStyle = "White";

	canvasContext.fillText("Score: " + score ,canvas.width/9,70);

    //Sets collision bounding boxes for jetpack and missile
	var jetpackCol = {x: jetPack.x, y: jetPack.y, width: jetPack.sImage.width, height: jetPack.sImage.height}
	var missileCol = {x: missile.x, y: missile.y, width: missile.sImage.width, height: missile.sImage.height}


//Detects if collision between the missile and jetpacks bounding boxes has occured
if (jetpackCol.x < missileCol.x + missileCol.width && jetpackCol.x + jetpackCol.width > missileCol.x && jetpackCol.y < missileCol.y + missileCol.height && jetpackCol.height + jetpackCol.y > missileCol.y) {

     if (soundMgr != null) soundMgr.playSound(0); // Plays death sound
	dead=1; //Sets dead to true
	calcHighscores(); //Calls highscore method
	gameState =2; // changes game to the endscreen

}
}
if(gameState == 2)
	{
	    endRender(elapsed);

	}


 requestAnimationFrame(gameLoop);
//var ctx = canvas.getContext("2d");
//ctx.font = "3px Arial";
//ctx.strokeText(Hello World,10,50);




 }

function calcHighscores()
{
    //var currentHS = localStorage.getItem("Highscore"); //Fetches current highscore from storage
    //if(score > currentHS ) //If the player has beaten the highscore it saves their score as the new highscore
    //{
     //  var storage = window.localStorage;
     //  storage.setItem("Highscore", score);

    //}


}

 function introRender(delta)
 {
    //Render function  for Intro screen Draws the title and instructions + scrolling background
     canvasContext.clearRect(0,0,canvas.width, canvas.height);
  	 bkgdImage.scrollBK(travel);
  	 canvasContext.font = "bold 60px Arial"
     canvasContext.textAlign = "center";
     canvasContext.fillStyle = "white";
     canvasContext.fillText("Jetpack Jamboree", canvas.width/2,100, canvas.width);
     canvasContext.font = "bold 40px Arial"
     canvasContext.fillText("Tap the screen to gain height on your jet pack", canvas.width/2,200, canvas.width);
     canvasContext.fillText("and avoid the missiles!", canvas.width/2, 300, canvas.width);
     canvasContext.fillText("Tap anywhere on the screen to start!", canvas.width/2, 350, canvas.width);
 }

 function mainRender(delta) {

    //Render function for the main game, Draws scrolling background and missile, if the player is alive it will render the player sprite


	canvasContext.clearRect(0,0,canvas.width, canvas.height);

	bkgdImage.scrollBK(travel);
    //Resize();

	if(dead != 1){
		 jetPack.render();
	}

	missile.render();

 }

 function endRender(delta)
 {
    //End screen render function. Has scrolling display and required text. Determines if player has acheived a highscore and responds accordingly
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    bkgdImage.scrollBK(travel);
    canvasContext.font = "bold 60px Arial"
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Game Over", canvas.width/2,100, canvas.width);
    canvasContext.font = "bold 40px Arial"

    //if(score < localStorage.getItem("Highscore") ){
    canvasContext.fillText("Your Score was: " + score, canvas.width/2,200, canvas.width);
   //canvasContext.fillText("The Highscore is : " + localStorage.getItem("Highscore"), canvas.width/2,220, canvas.width);
    //}
   // else
    //{
     //canvasContext.fillText("You got the highscore of  " + localStorage.getItem("Highscore"), canvas.width/2,220, canvas.width);
   // }
    canvasContext.fillText("Tap the screen to try again!", canvas.width/2, 250, canvas.width);

 }

 function update(delta) {
 }

 function collisionDetection() {

 }

 function styleText(txtColour, txtFont, txtAlign, txtBaseline)
 {
	 canvasContext.fillStyle = txtColour;
	 canvasContext.font = txtFont;
	 canvasContext.textAlign = txtAlign;
	 canvasContext.textBaseline = txtBaseline;
 }

 function touchUp(evt) {
	 evt.preventDefault();
	  //console.log("1")
	 // Terminate touch path
	 lastPt=null;
 }


 function touchDown(evt) {
	 evt.preventDefault();
	 //console.log("2")
	 if(gameOverScreenScreen)
	 {
	 return;
	 }
	 touchXY(evt);
 }

 function touchXY(evt) {


	 //console.log("3")
	 evt.preventDefault();
	 if(lastPt!=null) {
	 var touchX = evt.touches[0].pageX - canvas.offsetLeft;
	 var touchY = evt.touches[0].pageY - canvas.offsetTop;
	 }
	 lastPt = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
	 //console.log("LP= " + lastPt)
 }

 function GetClickDown(evt) //Registers Mouse click
 {
     var jetPackSpeed = 100;
	evt.preventDefault();
	var clickX = evt.pageX - canvas.offsetLeft;
	var clickY = evt.pageY - canvas.offsetTop;
	//.log(clickX);

	//console.log("LP= " + lastPt.x)
	if(gameState == 2) // When in the endscreen game state and a click is registed it will reload the game and some key variables
        {
            dead =0;
            gameState=0;
            score = 0;
            jetPack.x = 220;
            jetPack.y = 0;
        }
        if(gameState == 0) // Moves from intro screen to game when a click is registered
        {
            dead =0;
            gameState=1;
            gotHs = 0
            score = 0;
            jetPack.x = 220;
            jetPack.y = 0;
        }


	jetPack.sPos(jetPack.x, jetPack.y -=jetPackSpeed); // Moves jetpack when a click is registered
 }

 function GetTouch(evt) // Performs the same functions as described for  GetClickDown(evt) but for touch controls
  {
 	evt.preventDefault();
 	var touchX = evt.pageX - canvas.offsetLeft;
 	var touchY = evt.pageY - canvas.offsetTop;
 	//.log(clickX);
 	//lastPt = {x:evt.pageX  - canvas.offsetLeft , y:evt.pageY  - canvas.offsetTop};
 	//console.log("LP= " + lastPt.x)
    if(gameState == 2)
            {
                dead =0;
                gameState=0;
                score = 0;
                jetPack.x = 220;
                jetPack.y = 0;
            }
            if(gameState == 0)
            {
                dead =0;
                gameState=1;
                score = 0;
                jetPack.x = 220;
                jetPack.y = 0;
            }
 	jetPack.sPos(jetPack.x, jetPack.y -= 40);
  }

 function Missile()
 {
	//console.log("x= " + missile.x)
	if(missile.x < -10) //If missile has past player
	{
		var randY = Math.round(Math.random() * (canvas.height - 50)); //Calculates missiles y coord to new random value
		//console.log("randy = " + canvas.height-50);
		missile.x = 1925 // Moves missile back to right of screen
		if(dead == 0)
			{
				score++; // If player has survived current missile attack, increments score
			}
		if(randY < 280)
		{
			 missile.y = randY; // Sets missile to new random value
		}

	}
 }




 function setInitHS() // Sets initial high score
 {
    var storage = window.localStorage;
    //storage.setItem("Highscore", 0);
    var currentScore = localStorage.getItem("Highscore");
    console.log("Highscore = " + currentScore);
 }


