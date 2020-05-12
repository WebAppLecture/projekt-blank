import { GameObject } from "../GameObject.js";
import { GameTemplate} from "./GameTemplate.js";
import { Player } from "./Player.js";
import { Star, AllStar, Magnet } from "./DropItems.js";
import { Sound } from "./Sound.js";
import { TreeRow, Sun, Moon } from "./Background.js";


export class Starfall extends GameTemplate {
    
    //TODO: 
    //Improve controls
    //Finetune hitboxes
    //Add magnet, jewel, clock
    //Add background

    //Add level visual
    //Add lightening (?)
    //Add button sound
    //Add tutorial -> controls/dropItems
    //Modify level up messages
    //Clean up methods/classes

    start() {
        this.initSounds();
        this.baseStats();
        this.firstLevel();
        this.player = new Player(this.playerSpeed);
        this.gameOver = false;
        this.nextLevel = false;
        this.voluntaryExit = false;
    } 

    initSounds() {
        this.starSound = new Sound("src/sounds/star.mp3");
    }

    //Initializes base stats (final).
    baseStats() {
        this.baseSpeed = 6; 
        this.starSpawnModifier = 0.15;
        //this.starDriftFactor = 0; 
        this.basePointsNeeded = 10; //Points needed per level.
        this.baseLostPenalty = 0.5; //Percentage point deduction for lost stars.
    }

    //Set stats for first level.
    firstLevel() {
        this.level = 1;
        this.lostPenalty = this.baseLostPenalty;
        this.playerSpeed = this.baseSpeed;
        this.itemSpeed = this.baseSpeed / 4;
        this.initBackgroundStats();
        this.reset();
    }

    //Reset current game progress.
    reset() {
        this.items = [];
        this.lost = 0;
        this.caught = 0;
        this.points = 0;
        this.pointsNeeded = this.basePointsNeeded * this.level;
        this.player = new Player(this.playerSpeed);
        this.initBackground();
    }

    //Modifies stats for next difficulty level.
    levelUp() {
        this.nextLevel = true;
        this.nextLevelMessage();
    }

    startNextLevel() {
        this.updateGameStats();
        this.updateBackgroundStats();
        this.reset();
    }

    updateGameStats() {
        this.level++;
        this.playerSpeed *= 1.1;
        this.itemSpeed += 0.5;
    }

    updateBackgroundStats() {
        this.treeSpeed += 0.4;
        this.horizonSpeed *= 0.7;
    }

    //Initializes background variables.
    initBackgroundStats() {
        this.treeSpeed = 0.5;
        this.numberOfTreeRows = 5;
        this.lastTreePosition = 250;
        this.horizonSpeed = 1;
        this.sunHorizonFirstIndex = 0;

        this.darkBlueHorizon = ["#040120", "#06012a", "#1d1847", "#241c6a"];

        this.risingSunHorizon = ["#040120", "#06012a", "#1d1847", "#241c6a", 
                                 "#281996", "#3723d3", "#6450ff", "#8071f0",
                                 "#b55ce6", "#e65cd4", "#e44273", "#dc603b",
                                 "#e68f48", "#dda63e", "#f7d200"];

        this.calcRisingPositons();
    }

    initBackground() {
        this.trees = [];
        this.treeCounter = 0; //Counts each created tree; used to keep track of which image to select for next row.
        this.initTrees(this.numberOfTreeRows);
        this.moon = new Moon(this.horizonSpeed);
        //this.sun = new Sun(this.horizonSpeed * 1.1);
    }

    //Initializes forest background by creating a given number of trees.
    initTrees(number) {
        //Front rows:
        let distance = this.lastTreePosition / this.numberOfTreeRows * 2; //Distance to next tree row.
        let positionCurrent = this.lastTreePosition;
        for(let i = this.trees.length; i < number; i++) {
            let imageNumber = this.treeCounter % TreeRow.treeImages.length; //Select tree image based on available number of variations, then repeat.
            this.trees.push(new TreeRow(-5, positionCurrent, this.treeSpeed, imageNumber, false)); //Push initial.
            this.treeCounter++;
            positionCurrent += distance;
        }
        //Transparent back row:
        //this.newTree();
    }

    //Adds a new tree row.
    newTree() {
        let imageNumber = this.treeCounter % TreeRow.treeImages.length;
        this.trees.unshift(new TreeRow(-5, this.lastTreePosition, this.treeSpeed, imageNumber, true)); //Unshift additional.
        this.treeCounter++;
    }

    bindControls() {
        this.inputBinding = {
            "left": this.player.left.bind(this.player),
            "right": this.player.right.bind(this.player),
            "up": this.player.up.bind(this.player),
            "down": this.player.down.bind(this.player)
        };
    }

    update(ctx) {
        this.player.update(ctx);
        this.updateGame(ctx);
        this.updateBackground(ctx);
    }

    updateGame(ctx) {
        this.dropItem(ctx);
        this.updateItems(ctx);
        this.points = this.caught - this.lost * this.lostPenalty; //Calculate current points.
        if(this.points < 0) {
            this.gameOver = true; 
            this.gameOverMessage();
        }
        else if(this.points >= this.pointsNeeded) {
            this.levelUp();
        }
    }

    updateBackground(ctx) {
        if(this.moon !== undefined) {
            this.moon.update(ctx);
            if(this.moon.moonDown()) {
                this.switchSky();
            }
        } else {
            this.sun.update(ctx);
            if(this.sun.isUp()) {
                this.gameOver = true;
                this.gameOverMessage();
            }
            this.updateSunHorizonIndex();
        }
        this.updateTrees(ctx);
    }

    updateSunHorizonIndex() {
        for(let i = 1; i < this.risingPositions.length - 4; i++) {
            if(this.sun.y > this.risingPositions[i]) {
                this.sunHorizonFirstIndex = i - 1;
                //console.log(this.sunHorizonFirstIndex)
                break;
            }
        }
    }

    updateTrees(ctx) {
        for(let i = this.trees.length - 1; i >= 0; i--) {
            this.trees[i].update(ctx, i, this.playerSpeed);

            if(this.trees[i].treeBorderPassed(ctx)) {
                this.trees.splice(i, 1);
            }    
        }

        if(this.trees.length < this.numberOfTreeRows) {
            this.newTree();
        }
    }

    switchSky() {
        this.moon = undefined;
        this.sun = new Sun(this.horizonSpeed * 1.1);
    }

    //Drops new stars from the sky.
    dropItem(ctx) {
        // Add new item when 
        // 1) there is no item yet 
        // 2) the last added item has passed a certain percentage of the screen.
        if(this.items.length == 0 || this.items[this.items.length - 1].y >= ctx.canvas.height * this.starSpawnModifier) { 
            let positionItem;
            do {
                positionItem = Math.random() * ctx.canvas.width;
            } while(positionItem < ctx.canvas.width/4 || positionItem > ctx.canvas.width - ctx.canvas.width/4);
            let direction;
            if(positionItem <= ctx.canvas.width/2) direction = -1;
            else direction = 1;
            let randomSpawn = Math.random();
            if(randomSpawn > 0.9) {
                if(randomSpawn > 0.97) {
                    this.items.push(new Magnet(positionItem, direction, this.itemSpeed)) //3% drop chance
                } else {
                    this.items.push(new AllStar(positionItem, direction, this.itemSpeed)); // 7% drop chance
                }
            } else this.items.push(new Star(positionItem, direction, this.itemSpeed)); //default drop
        }
    }

    updateItems(ctx) {
        for(let i = this.items.length - 1; i >= 0; i--) {
            this.items[i].update(ctx);

            //Border
            //Count lost stars and delete all lost items.
            if(this.items[i].itemBorderPassed(ctx)) {
                if(this.items[i] instanceof Star) { //Only missed stars cause point loss; special items don't count.
                    this.lost++; 
                }
                this.deleteItem(i);
            }

            if(this.items[i].catchable) {
                //Count and delete caught stars.
                if(GameObject.circleCollision(this.player, this.items[i])) {
                    if(this.items[i] instanceof Star) {
                        this.deleteItem(i);   
                        this.caught++;
                    } else if (this.items[i] instanceof AllStar) {
                        this.deleteItem(i);   
                        this.allStar = true;
                        //this.starSound.play(); //favicon.ico not found??
                        break;
                    } 
                    else if (this.items[i] instanceof Magnet) {
                        this.deleteItem(i);   
                        this.magnet = true;
                    }
                }
            }
        }
        if(this.allStar) { 
            this.allStarEffect();
        }
        if(this.magnet) { 
            this.magnetEffect(); 
        }
    }

    allStarEffect() {
        for(let i = this.items.length - 1; i >= 0; i--) {
            if(this.items[i] instanceof Star) {
                this.caught++;
                this.deleteItem(i);
            }
        }
        this.allStar = false;
    }

    magnetEffect() {
        //Add magnet effect.
        this.magnet = false;
    }

    deleteItem(index) {
        this.items.splice(index, 1);
    }

    nextLevelMessage() {
        if(this.nextLevel === true) { 
            if(this.level <= 3) this.message = ["Well done!"];
            else if(this.level <= 5) this.message = ["Great job!"];
            else if(this.level >= 6) this.message = ["Amazing flying skills!"];
            this.message.push(" ", " ", "Ready for level " + (this.level + 1) + "?", " ", "Next Level: Enter");
        }
    }

    gameOverMessage() {
        if(this.gameOver === true) {
            if(this.voluntaryExit) this.message = ["EXITED GAME"];
            else this.message = ["GAME OVER"];
    
            if(this.voluntaryExit) this.message.push("See you again soon!", "\n");
            else {
                if(this.level > 4) this.message.push("Well done!", "\n"); //Adjust messages
                else if(this.level > 6) this.message.push("Great job!", "\n");
                else this.message.push("You can do better ;)", "\n");
            }
            
            this.message.push("Level: " + this.level, "\n", "\n", "New Game: Enter")
        }
    }

    draw(ctx) {
        this.drawHorizonGradient(ctx);
        if(this.moon !== undefined) {
            this.moon.draw(ctx);
        } else {
            this.sun.draw(ctx);
        }
        this.drawTrees(ctx);
        this.drawLevelAndPoints(ctx);
        this.drawItems(ctx);
        this.player.draw(ctx);
    }

    //TODO: Finetune intervals.
    drawHorizonGradient(ctx) {
        let gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        let interval = 0.6 / 3;
        if(this.moon !== undefined) { 
            gradient.addColorStop(0.0, this.darkBlueHorizon[0]);
            gradient.addColorStop(interval, this.darkBlueHorizon[1]);
            gradient.addColorStop(interval * 2, this.darkBlueHorizon[2]);
            gradient.addColorStop(interval * 3, this.darkBlueHorizon[3]);
        } else {
            gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            if(this.sunHorizonFirstIndex > 6) {
                let stops = 3 + (this.sunHorizonFirstIndex - 6);
                interval = 0.5 / stops;
                //console.log(stops);
            }

            gradient.addColorStop(0.0, this.risingSunHorizon[this.sunHorizonFirstIndex]);

            let percent = 0.2;
            let i = 1;
            while(percent <= 0.7) {
                //console.log(this.sunHorizonFirstIndex + i);
                gradient.addColorStop(percent, this.risingSunHorizon[this.sunHorizonFirstIndex + i]);
                percent += interval;
                i++;
            }
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    calcRisingPositons() {
        this.risingPositions = []
        let max = 70;
        let min = 500;
        let interval = (min - max) / this.risingSunHorizon.length;
        let nextPosition = min - interval;
        do {
            this.risingPositions.push(nextPosition);
            nextPosition -= interval * 1;
        } while (nextPosition >= max)
    }

    drawTrees(ctx) {
        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].draw(ctx);
        }
    }

    drawItems(ctx) {
        for(let i = 0; i < this.items.length; i++) {
            this.items[i].draw(ctx);
        }  
    }

    drawLevelAndPoints(ctx) {
        let fontSize = 30;
        ctx.fillStyle = this.fillStyle;
        ctx.font = fontSize + "px monospace";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        let text = ["Points: " + this.points, "", " Level: " + this.level]; //round ceil/floor or count lost stars and deduct full points

        for(let  i = 0; i < text.length; i++) {
            let startY = text.length/2 + fontSize * 2;
            ctx.fillText(text[i], ctx.canvas.width * 0.90, startY + i * fontSize);
        }
    }

    static get NAME() {
        return "Start Game: Enter";
    }
}