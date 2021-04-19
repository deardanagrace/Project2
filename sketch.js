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
var collectibles;
var coral1;
//load the font
var myHeadingFont;
var myBodyFont;

// Clickables: the manager class
var clickablesManager; // the manager class
var clickables; // an array of clickable objects

// indexes into the clickable array (constants)
const playGameIndex = 0;



// Allocate Adventure Manager with states table and interaction tables
function preload() {
    clickablesManager = new ClickableManager('data/clickableLayout.csv');
    adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
    myHeadingFont = loadFont('assets/Mondwest-Regular.otf');
    myBodyFont = loadFont('assets/NeueBit-Bold.otf');

}

// Setup the adventure manager
function setup() {
    createCanvas(1280, 720);
    playerSprite = createSprite(200, 620);
    var myAnimation = playerSprite.addAnimation('idle', 'assets/femidle01.png', 'assets/femidle02.png', 'assets/femidle03.png', 'assets/femidle04.png', 'assets/femidle05.png', 'assets/femidle05.png', 'assets/femidle06.png');
    playerSprite.addAnimation('walking', 'assets/femwalk01.png', 'assets/femwalk02.png', 'assets/femwalk03.png', 'assets/femwalk04.png', 'assets/femwalk05.png');
    playerSprite.addAnimation('swimming', 'assets/NPCS/femswimming01.png', 'assets/NPCS/femswimming04.png');



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

    // No avatar for following Screens, 
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

function moveSwimSprite() {
    // move side to side
    //walk to the right
    if (keyIsDown(68)) {
        playerSprite.changeAnimation('swimming');
        //flip to go right
        playerSprite.mirrorX(1);
        playerSprite.velocity.x = 4;
    }
    //walk to the left
    else if (keyIsDown(65)) {
        playerSprite.changeAnimation('swimming');
        //flip to go left
        playerSprite.mirrorX(-1);
        playerSprite.velocity.x = -4;
    }
    //move up and down
    //going up
    else if (keyIsDown(83)) {
        playerSprite.changeAnimation('swimming');
        playerSprite.velocity.y = 4;
    }
    //going down
    else if (keyIsDown(87)) {
        playerSprite.changeAnimation('swimming');
        playerSprite.velocity.y = -4;
    }
    //standing
    else {
        playerSprite.changeAnimation('swimming');
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
        this.instructionsText = "You just landed on an island! Use WASD keys to explore. Walk up to the natives to talk to them and help where you can. Black text is you, and pink text are the islanders! Enjoy your vacay! ";
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
class ExitPlaneScreen extends PNGRoom {
	preload() {
		this.planeDialogue = createSprite(662, 142);
        this.planeDialogue.addAnimation('talk', loadAnimation('assets/dialogue/ExitPlaneText.png'));
	}
	draw() {
		 super.draw();
        drawSprite(this.planeDialogue);
	}
}
class UglyIslandScreen extends PNGRoom {
	preload() {
		this.islandDialogue = createSprite(662, 290);
        this.islandDialogue.addAnimation('talk', loadAnimation('assets/dialogue/UglyIslandText.png'));
	}
	draw() {
		 super.draw();
        drawSprite(this.islandDialogue);
}
}
class HouseScreen extends PNGRoom {

    preload() {
        //draw npcs
        this.npc1 = createSprite(662, 192);
        this.npc1.addAnimation('regular', loadAnimation('assets/NPCS/npc101.png', 'assets/NPCS/npc106.png'));
        this.npc2 = createSprite(1056, 322);
        this.npc2.addAnimation('regular', loadAnimation('assets/NPCS/npc201.png', 'assets/NPCS/npc206.png'));
        this.npc3 = createSprite(547, 443);
        this.npc3.addAnimation('regular', loadAnimation('assets/NPCS/npc301.png', 'assets/NPCS/npc306.png'));
        //draw dialogue boxes
        this.housetalk = createSprite(666, 90);
        this.housetalk.addAnimation('talk', loadAnimation('assets/dialogue/HousesText.png'));
    }

    load() {
        super.load();
    }

    draw() {
        //place sprites
        super.draw();
        drawSprite(this.npc1);
        drawSprite(this.npc2);
        drawSprite(this.npc3);
        drawSprite(this.housetalk);


        if (playerSprite.overlap(this.npc1)) {
            this.housetalk.visible = true;
        } else {
            this.housetalk.visible = false;
        }
    }
}

class UtensilsScreen extends PNGRoom {

    preload() {
        //draw npcs
        this.npc1 = createSprite(420, 520);
        this.npc1.addAnimation('regular', loadAnimation('assets/NPCS/npc401.png', 'assets/NPCS/npc406.png'));
        this.npc2 = createSprite(384, 520);
        this.npc2.addAnimation('regular', loadAnimation('assets/NPCS/npc601.png', 'assets/NPCS/npc606.png'));
        this.npc3 = createSprite(290, 520);
        this.npc3.addAnimation('regular', loadAnimation('assets/NPCS/npc201.png', 'assets/NPCS/npc206.png'));
        //preloading the table!!!
        this.table = createSprite (341,557);
        this.table.addAnimation('tabling',loadAnimation ('assets/table.png'));
        //draw dialogue boxes
        this.utensiltalk = createSprite(420, 400);
        this.utensiltalk.addAnimation('talk', loadAnimation('assets/dialogue/UtensilText.png'));
    }

    load() {
        super.load();
    }

    draw() {
        //place sprites
        super.draw();
        drawSprite(this.npc1);
        drawSprite(this.npc2);
        drawSprite(this.npc3);
        drawSprite(this.utensiltalk);
        drawSprite (this.table);

        if (playerSprite.overlap(this.npc1)) {
            this.utensiltalk.visible = true;
        } else {
            this.utensiltalk.visible = false;
        }
    }
}

class FruitsScreen extends PNGRoom {

    preload() {
        //preload npc
        this.npc1 = createSprite(1076, 235);
        this.npc1.addAnimation('regular', loadAnimation('assets/NPCS/npc301.png', 'assets/NPCS/npc306.png'));

        //preload dialogue boxes
        this.fruittalk = createSprite(382, 518);
        this.fruittalk.addAnimation('talk', loadAnimation('assets/dialogue/FruitsText.png'));
        this.fruittalk1 = createSprite(1076, 110);
        this.fruittalk1.addAnimation('talk', loadAnimation('assets/dialogue/FruitsText1.png'));

        //preload the fruits
        //persimon first at random and with different animations that can be changed later
        this.persimon1 = createSprite(random(205, 1140), random(140, 430));
        this.persimon1.addAnimation('fruiting', 'assets/persimmon.png');
        this.persimon1.addAnimation('collected', 'assets/fruitempty.png');
        this.persimon2 = createSprite(random(205, 1140), random(140, 430));
        this.persimon2.addAnimation('fruiting', 'assets/persimmon.png');
        this.persimon2.addAnimation('collected', 'assets/fruitempty.png');
        this.persimon3 = createSprite(random(205, 1140), random(140, 430));
        this.persimon3.addAnimation('fruiting', 'assets/persimmon.png');
        this.persimon3.addAnimation('collected', 'assets/fruitempty.png');
        //pineapple
        this.pineapple1 = createSprite(random(93, 920), random(140, 540));
        this.pineapple1.addAnimation('fruiting', 'assets/pineapple.png');
        this.pineapple1.addAnimation('collected', 'assets/fruitempty.png');
        this.pineapple2 = createSprite(random(93, 920), random(140, 540));
        this.pineapple2.addAnimation('fruiting', 'assets/pineapple.png');
        this.pineapple2.addAnimation('collected', 'assets/fruitempty.png');
        this.pineapple3 = createSprite(random(93, 920), random(140, 540));
        this.pineapple3.addAnimation('fruiting', 'assets/pineapple.png');
        this.pineapple3.addAnimation('collected', 'assets/fruitempty.png');
        //banana
        this.banana1 = createSprite(random(691, 1140), random(63, 430));
        this.banana1.addAnimation('fruiting', 'assets/banana.png');
        this.banana1.addAnimation('collected', 'assets/fruitempty.png');
        this.banana2 = createSprite(random(691, 1140), random(63, 430));
        this.banana2.addAnimation('fruiting', 'assets/banana.png');
        this.banana2.addAnimation('collected', 'assets/fruitempty.png');
        this.banana3 = createSprite(random(691, 1140), random(63, 430));
        this.banana3.addAnimation('fruiting', 'assets/banana.png');
        this.banana3.addAnimation('collected', 'assets/fruitempty.png');
        //coconut
        this.coconut1 = createSprite(random(93, 920), random(140, 540));
        this.coconut1.addAnimation('fruiting', 'assets/coconut.png');
        this.coconut1.addAnimation('collected', 'assets/fruitempty.png');
        this.coconut2 = createSprite(random(93, 920), random(140, 540));
        this.coconut2.addAnimation('fruiting', 'assets/coconut.png');
        this.coconut2.addAnimation('collected', 'assets/fruitempty.png');
        this.coconut3 = createSprite(random(93, 920), random(140, 540));
        this.coconut3.addAnimation('fruiting', 'assets/coconut.png');
        this.coconut3.addAnimation('collected', 'assets/fruitempty.png');

       //a silly little trigger container so that dialogue will automatically load when you enter the state/ screen

       this.trigger = createSprite (368,672);
       this.trigger.addAnimation ('triggered','assets/emptytrigger.png');
    }

    load() {
        super.load();

    }

    draw() {

        //place sprites
        super.draw();
        //npc
        drawSprite(this.npc1);
        //the dialogue
        drawSprite(this.fruittalk);
        drawSprite(this.fruittalk1);
        //the fruits
       	drawSprite (this.persimon1);
       	drawSprite (this.persimon2);
       	drawSprite (this.persimon3);
       	drawSprite (this.pineapple1);
       	drawSprite (this.pineapple2);
       	drawSprite (this.pineapple3);
       	drawSprite (this.banana1);
       	drawSprite (this.banana2);
       	drawSprite (this.banana3);
       	drawSprite (this.coconut1);
       	drawSprite (this.coconut2);
       	drawSprite (this.coconut3);
       	//trigger
       	drawSprite (this.trigger);
       	//trigger interaction
       if (playerSprite.overlap(this.trigger)) {
            this.fruittalk.visible = true;
        } else {
            this.fruittalk.visible = false;
        }
        //npc talk
        if (playerSprite.overlap(this.npc1)) {
            this.fruittalk1.visible = true;
        } else {
            this.fruittalk1.visible = false;
        }
       	//if overlaps with the fruit, character collects it :) ((it goes invisible hehehe))
       	if (this.persimon1.overlap(playerSprite)) {
            this.persimon1.changeAnimation('collected');
        }
        if (this.persimon2.overlap(playerSprite)) {
            this.persimon2.changeAnimation('collected');
        }
        if (this.persimon3.overlap(playerSprite)) {
            this.persimon3.changeAnimation('collected');
        }
        if (this.pineapple1.overlap(playerSprite)) {
            this.pineapple1.changeAnimation('collected');
        }
        if (this.pineapple2.overlap(playerSprite)) {
            this.pineapple2.changeAnimation('collected');
        }
        if (this.pineapple3.overlap(playerSprite)) {
            this.pineapple3.changeAnimation('collected');
        }
         if (this.banana1.overlap(playerSprite)) {
            this.banana1.changeAnimation('collected');
        }
        if (this.banana2.overlap(playerSprite)) {
            this.banana2.changeAnimation('collected');
        }
        if (this.banana3.overlap(playerSprite)) {
            this.banana3.changeAnimation('collected');
        }
        if (this.coconut1.overlap(playerSprite)) {
            this.coconut1.changeAnimation('collected');
        }
        if (this.coconut2.overlap(playerSprite)) {
            this.coconut2.changeAnimation('collected');
        }
        if (this.coconut3.overlap(playerSprite)) {
            this.coconut3.changeAnimation('collected');
        }
    }
}

// function collect() {
// 	this.persimonSprites.remove()
// }
class LanguageScreen extends PNGRoom {

    preload() {
        //draw npcs
        this.npc1 = createSprite(662, 192);
        this.npc1.addAnimation('regular', loadAnimation('assets/NPCS/npc301.png', 'assets/NPCS/npc306.png'));
        this.npc2 = createSprite(1056, 322);
        this.npc2.addAnimation('regular', loadAnimation('assets/NPCS/npc401.png', 'assets/NPCS/npc406.png'));
        this.npc3 = createSprite(547, 443);
        this.npc3.addAnimation('regular', loadAnimation('assets/NPCS/npc501.png', 'assets/NPCS/npc506.png'));
        //draw dialogue boxes
        this.languagetalk = createSprite(666, 90);
        this.languagetalk.addAnimation('talk', loadAnimation('assets/dialogue/LanguageText.png'));
        this.languagetalk1 = createSprite(666, 90);
        this.languagetalk1.addAnimation('talk', loadAnimation('assets/dialogue/languagetext2.png'));
        this.languagetalk2 = createSprite(666, 90);
        this.languagetalk2.addAnimation('talk', loadAnimation('assets/dialogue/languagetext3.png'));
    }

    load() {
        super.load();
    }

    draw() {
        //place sprites
        super.draw();
        drawSprite(this.npc1);
        drawSprite(this.npc2);
        drawSprite(this.npc3);
        drawSprite(this.languagetalk);
        drawSprite(this.languagetalk1);
        drawSprite(this.languagetalk2);


        if (playerSprite.overlap(this.npc1)) {
            this.languagetalk.visible = true;
        } else {
            this.languagetalk.visible = false;
        }
        if (playerSprite.overlap(this.npc2)) {
            this.languagetalk1.visible = true;
        } else {
            this.languagetalk1.visible = false;
        }
        if (playerSprite.overlap(this.npc3)) {
            this.languagetalk2.visible = true;
        } else {
            this.languagetalk2.visible = false;
        }
    }
}

class swimmingScreen extends PNGRoom {

    preload() {
        //preloading the coral and its animations
        this.coral1 = createSprite(random(160, 1200), random(280, 560));
        this.coral1.addAnimation('okay', 'assets/coral1.png');
        this.coral1.addAnimation('broke', 'assets/coral1Broken.png');
        this.coral1a = createSprite(random(160, 1200), random(280, 560));
        this.coral1a.addAnimation('okay', 'assets/coral1.png');
        this.coral1a.addAnimation('broke', 'assets/coral1Broken.png');
        this.coral2 = createSprite(random(141, 690), random(91, 565));
        this.coral2.addAnimation('okay', 'assets/coral2.png');
        this.coral2.addAnimation('broke', 'assets/coral2Broken.png');
        this.coral2a = createSprite(random(141, 690), random(91, 565));
        this.coral2a.addAnimation('okay', 'assets/coral2.png');
        this.coral2a.addAnimation('broke', 'assets/coral2Broken.png');
        this.coral3 = createSprite(random(839, 1200), random(280, 680));
        this.coral3.addAnimation('okay', 'assets/coral3.png');
        this.coral3.addAnimation('broke', 'assets/coral3Broken.png');
        this.coral3a = createSprite(random(839, 1200), random(280, 680));
        this.coral3a.addAnimation('okay', 'assets/coral3.png');
        this.coral3a.addAnimation('broke', 'assets/coral3Broken.png');
        //preloading dialogue
        this.swimmingtalk = createSprite(1070, 620);
        this.swimmingtalk.addAnimation('talk', loadAnimation('assets/dialogue/SwimmingText.png'));
        //trigger preloading
          this.trigger = createSprite (1066,661);
       this.trigger.addAnimation ('triggered','assets/emptytrigger.png');
    }

    load() {
        super.load();

    }

    draw() {
        super.draw();
        //loading the corals and the dialogue box
        drawSprite(this.coral1);
        drawSprite(this.coral1a);
        drawSprite(this.coral2);
        drawSprite(this.coral2a);
        drawSprite(this.coral3);
        drawSprite(this.coral3a);
        drawSprite(this.swimmingtalk);
        drawSprite (this.trigger);
        //overlapping interactions
        if (this.coral1.overlap(playerSprite)) {
            this.coral1.changeAnimation('broke');
        }
        if (this.coral1a.overlap(playerSprite)) {
            this.coral1a.changeAnimation('broke');
        }
        if (this.coral2.overlap(playerSprite)) {
            this.coral2.changeAnimation('broke');
        }
        if (this.coral2a.overlap(playerSprite)) {
            this.coral2a.changeAnimation('broke');
        }
        if (this.coral3.overlap(playerSprite)) {
            this.coral3.changeAnimation('broke');
        }
        if (this.coral3a.overlap(playerSprite)) {
            this.coral3a.changeAnimation('broke');
        }
        if (playerSprite.overlap(this.trigger)) {
            this.swimmingtalk.visible = true;
        } else {
            this.swimmingtalk.visible = false;
        }
        //i was trying to change the sprite when i enter a new state but i cannot for the life of me, figure it out so it is ok. Perfection is not required all the time
        // playerSprite.changeAnimation('swimming');
        // moveSwimSprite();
    }
}


class veganScreen extends PNGRoom {

    preload() {
        //draw npcs
        this.npc1 = createSprite(662, 192);
        this.npc1.addAnimation('regular', loadAnimation('assets/NPCS/npc501.png', 'assets/NPCS/npc506.png'));
        this.npc2 = createSprite(1056, 322);
        this.npc2.addAnimation('regular', loadAnimation('assets/NPCS/npc601.png', 'assets/NPCS/npc606.png'));
        this.npc3 = createSprite(547, 443);
        this.npc3.addAnimation('regular', loadAnimation('assets/NPCS/npc201.png', 'assets/NPCS/npc206.png'));
        //draw dialogue boxes
        this.vegantalk = createSprite(666, 90);
        this.vegantalk.addAnimation('talk', loadAnimation('assets/dialogue/VeganText.png'));
    }

    load() {
        super.load();
    }

    draw() {
        //place sprites
        super.draw();
        drawSprite(this.npc1);
        drawSprite(this.npc2);
        drawSprite(this.npc3);
        drawSprite(this.vegantalk);


        if (playerSprite.overlap(this.npc1)) {
            this.vegantalk.visible = true;
        } else {
            this.vegantalk.visible = false;
        }
    }
}


class flowerScreen extends PNGRoom {

    preload() {
        //draw npcs
        this.npc1 = createSprite(662, 192);
        this.npc1.addAnimation('regular', loadAnimation('assets/NPCS/npc601.png', 'assets/NPCS/npc606.png'));
        this.npc2 = createSprite(1056, 322);
        this.npc2.addAnimation('regular', loadAnimation('assets/NPCS/npc101.png', 'assets/NPCS/npc106.png'));
        this.npc3 = createSprite(547, 443);
        this.npc3.addAnimation('regular', loadAnimation('assets/NPCS/npc501.png', 'assets/NPCS/npc506.png'));
        //draw dialogue boxes
        this.flowertalk = createSprite(666, 90);
        this.flowertalk.addAnimation('talk', loadAnimation('assets/dialogue/flowertext.png'));
    }

    load() {
        super.load();
    }

    draw() {
        //place sprites
        super.draw();
        drawSprite(this.npc1);
        drawSprite(this.npc2);
        drawSprite(this.npc3);
        drawSprite(this.flowertalk);


        if (playerSprite.overlap(this.npc1)) {
            this.flowertalk.visible = true;
        } else {
            this.flowertalk.visible = false;
        }
    }
}

class waterScreen extends PNGRoom {

    preload() {
        //draw npcs
        this.npc1 = createSprite(662, 192);
        this.npc1.addAnimation('regular', loadAnimation('assets/NPCS/npc201.png', 'assets/NPCS/npc206.png'));
        this.npc2 = createSprite(1056, 322);
        this.npc2.addAnimation('regular', loadAnimation('assets/NPCS/npc301.png', 'assets/NPCS/npc306.png'));
        this.npc3 = createSprite(547, 443);
        this.npc3.addAnimation('regular', loadAnimation('assets/NPCS/npc401.png', 'assets/NPCS/npc406.png'));
        //draw dialogue boxes
        this.watertalk = createSprite(666, 90);
        this.watertalk.addAnimation('talk', loadAnimation('assets/dialogue/WaterText.png'));
    }

    load() {
        super.load();
    }

    draw() {
        //place sprites
        super.draw();
        drawSprite(this.npc1);
        drawSprite(this.npc2);
        drawSprite(this.npc3);
        drawSprite(this.watertalk);


        if (playerSprite.overlap(this.npc1)) {
            this.watertalk.visible = true;
        } else {
            this.watertalk.visible = false;
        }
    }
}

class photoScreen extends PNGRoom {

    preload() {
        // preload dialogue that opens when enter screen

    }

    load() {

    }

    draw() {

    }
}



// class endingScreen extends PNGRoom {

//     preload() {

//     }

//     load() {

//     }

//     draw() {

//     }
// }