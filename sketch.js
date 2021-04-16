/***********************************************************************************
 Trip   
  by Dana Capistrano
  
this is giving my anxiety but it might just be the two red bulls and iced coffee i just drank ¯\_(ツ)_/¯
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;
var npc1talk;
//load the font
var myHeadingFont;
var myBodyFont;

// Clickables: the manager class
var clickablesManager; // the manager class
var clickables; // an array of clickable objects

var NPCdialogue = []; //Dialogue array
var dialogueFunction; // variable that is a function

// indexes into the clickable array (constants)
const playGameIndex = 0;

var talkedtoweirdNPC = false;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
    clickablesManager = new ClickableManager('data/clickableLayout.csv');
    adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
    myHeadingFont = loadFont('assets/Mondwest-Regular.otf');
    myBodyFont = loadFont('assets/NeueBit-Bold.otf');


    // NPCdialogue[0] = loadImage('assets/dialogue/HousesText.png');
    // NPCdialogue[1] = loadImage('assets/dialogue/HousesText_1.png');
    // NPCdialogue[2] = loadImage('assets/dialogue/HousesText_2.png');
    // NPCdialogue[3] = loadImage('assets/dialogue/HousesText_3.png');
    // NPCdialogue[4] = loadImage('assets/dialogue/HousesText_4.png');
    // NPCdialogue[5] = loadImage('assets/dialogue/HousesText_5.png');
    // NPCdialogue[6] = loadImage('assets/dialogue/HousesText_6.png');
    // NPCdialogue[7] = loadImage('assets/dialogue/LanguageText1.png');
    // NPCdialogue[8] = loadImage('assets/dialogue/LanguageText2.png');
    // NPCdialogue[9] = loadImage('assets/dialogue/LanguageText3.png');
    // NPCdialogue[10] = loadImage('assets/dialogue/LanguageText4.png');
    // NPCdialogue[11] = loadImage('assets/dialogue/LanguageText5.png');
    // NPCdialogue[12] = loadImage('assets/dialogue/LanguageText6.png');
    // NPCdialogue[13] = loadImage('assets/dialogue/LanguageText7.png');
    // NPCdialogue[14] = loadImage('assets/dialogue/VeganText.png');
    // NPCdialogue[15] = loadImage('assets/dialogue/VeganText_1.png');
    // NPCdialogue[16] = loadImage('assets/dialogue/VeganText_2.png');
    // NPCdialogue[17] = loadImage('assets/dialogue/VeganText_3.png');
    // NPCdialogue[18] = loadImage('assets/dialogue/VeganText_4.png');
    // NPCdialogue[19] = loadImage('assets/dialogue/VeganText_5.png');
    // NPCdialogue[20] = loadImage('assets/dialogue/VeganText_6.png');
    // NPCdialogue[21] = loadImage('assets/dialogue/VeganText_7.png');
}

// Setup the adventure manager
function setup() {
    createCanvas(1280, 720);
    playerSprite = createSprite(200, 620);
    var myAnimation = playerSprite.addAnimation('idle', 'assets/femidle01.png', 'assets/femidle02.png', 'assets/femidle03.png', 'assets/femidle04.png', 'assets/femidle05.png', 'assets/femidle05.png', 'assets/femidle06.png');
    playerSprite.addAnimation('walking', 'assets/femwalk01.png', 'assets/femwalk02.png', 'assets/femwalk03.png', 'assets/femwalk04.png', 'assets/femwalk05.png');

    // setup the clickables = this will allocate the array
    clickables = clickablesManager.setup();
    // use this to track movement from toom to room in adventureManager.draw()
    adventureManager.setPlayerSprite(playerSprite);

    // this is optional but will manage turning visibility of buttons on/off
    // based on the state name in the clickableLayout
    adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
    adventureManager.setup();

    // call OUR function to setup additional information about the p5.clickables
    // that are not in the array 
    setupClickables();
}

// Adventure manager handles it all!
function draw() {
    background('#79cdff');
    // draws background rooms and handles movement from one to another
    adventureManager.draw();

    // draw the p5.clickables, in front of the mazes but behind the sprites 
    clickablesManager.draw();

    // No avatar for Splash screen, Instructions screen, 
    if (adventureManager.getStateName() !== "Splash" &&
        adventureManager.getStateName() !== "Instructions" &&
        adventureManager.getStateName() !== "ExitPlane" &&
        adventureManager.getStateName() !== "UglyIsland") {

        // responds to keydowns
        moveSprite();

        // this is a function of p5.js, not of this sketch
        drawSprite(playerSprite);
    }
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
    // toggle fullscreen mode
    if (key === 'f') {
        n * c
        fs = fullscreen();
        fullscreen(!fs);
        return;
    }

    // dispatch key events for adventure manager to move from state to 
    // state or do special actions - this can be disabled for NPC conversations
    // or text entry   

    // dispatch to elsewhere
    adventureManager.keyPressed(key);
}

function mouseReleased() {
    adventureManager.mouseReleased();
}
//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
function moveSprite() {
    // move side to side
    //walk to the right
    if (keyIsDown(68)) {
        playerSprite.changeAnimation('walking');
        //flip to go right
        playerSprite.mirrorX(1);
        playerSprite.velocity.x = 4;
    }
    //walk to the left
    else if (keyIsDown(65)) {
        playerSprite.changeAnimation('walking');
        //flip to go left
        playerSprite.mirrorX(-1);
        playerSprite.velocity.x = -4;
    }
    //move up and down
    //going up
    else if (keyIsDown(83)) {
        playerSprite.changeAnimation('walking');
        playerSprite.velocity.y = 4;
    }
    //going down
    else if (keyIsDown(87)) {
        playerSprite.changeAnimation('walking');
        playerSprite.velocity.y = -4;
    }
    //standing
    else {
        playerSprite.changeAnimation('idle');
        playerSprite.velocity.x = 0;
        playerSprite.velocity.y = 0;
    }
}
//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
    // All clickables to have same effects
    for (let i = 0; i < clickables.length; i++) {
        clickables[i].onHover = clickableButtonHover;
        clickables[i].onOutside = clickableButtonOnOutside;
        clickables[i].onPress = clickableButtonPressed;
    }
}

// tint when mouse is over
clickableButtonHover = function() {
    this.color = "#f400a1";
    this.noTint = false;
    this.tint = "#b6d42c";


}

// color a green if off
clickableButtonOnOutside = function() {
    // backto our green color
    this.color = "#b6d42c";
    this.cornerRadius = 60;
    this.strokeWeight = 0;
    this.textSize = 18;
    this.textFont = myBodyFont;
}

clickableButtonPressed = function() {
    // these clickables are ones that change your state
    // so they route to the adventure manager to do this
    adventureManager.clickablePressed(this.name);
}

// function talktoNPC1() {
//         image(NPCdialogue[0], 532, 15);

// }

    function mousePressed () {
        this.npc1talk.nextFrame();
    }

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//


// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
    // preload is where we define OUR variables
    // Best not to use constructor() functions for sublcasses of PNGRoom
    // AdventureManager calls preload() one time, during startup
    preload() {
        // These are out variables in the InstructionsScreen class
        this.textBoxWidth = (width / 6) * 4;
        this.textBoxHeight = (height / 6) * 4;

        // hard-coded, but this could be loaded from a file if we wanted to be more elegant
        this.instructionsText = "You just landed on an island! Use WASD keys to explore. Talk to the Natives and help out where you can";
    }

    // call the PNGRoom superclass's draw function to draw the background image
    // and draw our instructions on top of this
    draw() {

        // this calls PNGRoom.draw()
        super.draw();

        // text draw settings
        fill(255);
        textAlign(CENTER);
        textSize(30);

        // Draw text in a box
        text(this.instructionsText, width / 6, height / 6, this.textBoxWidth, this.textBoxHeight);
    }
}

class HouseScreen extends PNGRoom {

    preload() {
        this.npc1 = createSprite(662, 192);
        this.npc1.addAnimation('regular', loadAnimation('assets/NPCS/npc101.png', 'assets/NPCS/npc106.png'));

        this.npc1talk = createSprite(532, 15);
        this.npc1talk.addAnimation('talk', loadAnimation('assets/dialogue/HousesText1.png', 'assets/dialogue/HousesText_6.png'));
        this.npc1talk.playing = false;

        

        this.talkbubble = null;
        this.talkedtoNPC = false;
        talkedtoweirdNPC = false;

    }

    load() {
        super.load();

    }

    unload() {
        super.unload();

        this.talkbubble = null;
        talkedtoweirdNPC = false;
    }
    draw() {
        super.draw();
        drawSprite(this.npc1);
        // if (this) {
        //     playerSprite.overlap(this.npc1, image(NPCdialogue[1], 532, 15));
        // } else {
        //     playerSprite.overlap(this.npc1, image(NPCdialogue[1], 532, 15));
        // }
    }
}