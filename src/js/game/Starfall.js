import { GameObject } from "../GameObject.js";
import { GameTemplate} from "./GameTemplate.js";
import { Player } from "./Player.js";
import { Star, AllStar } from "./DropItems.js";
import { TreeRow, Sun, Moon } from "./Background.js";

export class Starfall extends GameTemplate {
    
    //TODO: 
    //Improve direction change
    //Modify levelUp stats
    //Finetune hitbox player
    //Add background
    //Add boosters
    //Reduce number of variables!

    start() {
        this.initBackground();
        this.baseStats();
        this.firstLevelStats();
        this.player = new Player(this.playerSpeed);
        this.gameOver = false;
        this.voluntaryExit = false;
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
    firstLevelStats() {
        this.level = 1;
        this.lostPenalty = this.baseLostPenalty;
        this.playerSpeed = this.baseSpeed;
        this.itemSpeed = this.baseSpeed / 4;
        this.reset();
    }

    //Reset current game progress.
    reset() {
        this.items = [];
        this.lost = 0;
        this.caught = 0;
        this.points = 0;
        this.pointsNeeded = this.basePointsNeeded * this.level;
    }

    //Modifies stats for next difficulty level.
    levelUp() {
        this.level++;
        this.playerSpeed *= 1.1;
        this.itemSpeed += 0.5;
        this.reset();
        //evtl modify starspawnmodifier/starspeed/lostPenalty
    }

    //Initializes background variables.
    initBackground() {
        this.updateCounter = 0;
        this.trees = [];
        this.treeSpeed = 0.5;
        this.numberOfTreeRows = 5;
        this.lastTreePosition = 250;
        this.treeCounter = 0; //Counts each created tree; used to keep track of which image to select for next row.
        this.initTrees(this.numberOfTreeRows);
        this.moon = new Moon(this.baseSpeed/3);
        this.sun = new Sun(this.baseSpeed/3);
    }

    //Initializes forest background by creating a given number of trees.
    initTrees(number) {
        //Front rows:
        let distance = 100; //Distance to next tree row.
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
        }
        else if(this.points >= this.pointsNeeded) {
            this.levelUp();
        }
        this.gameOverMessage();
    }

    updateBackground(ctx) {
        //if(this.moon != undefined) {
        this.moon.update(ctx);
        //    if(this.moon.goneDown(this.lastTreePosition)) {
        //        this.moon = undefined;
        //        this.sun = new Sun(this.baseSpeed/3);
        //    }
        //}
        //else {
        this.sun.update(ctx);
        //}
        this.updateTrees(ctx);
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

    //Drops new stars from the sky.
    dropItem(ctx) {
        // Add new item when 
        // 1) there is no item yet 
        // 2) the last added item has passed a certain percentage of the screen.
        if(this.items.length == 0 || this.items[this.items.length - 1].y >= ctx.canvas.height * this.starSpawnModifier) { 
            let positionStar;
            do {
                positionStar = Math.random() * ctx.canvas.width;
            } while(positionStar < ctx.canvas.width/4 || positionStar > ctx.canvas.width - ctx.canvas.width/4);
            let direction;
            if(positionStar <= ctx.canvas.width/2) direction = -1;
            else direction = 1;
            if(Math.random() > 0.95) {
                this.items.push(new AllStar(positionStar, direction, this.itemSpeed)); // 5% drop chance
            } else this.items.push(new Star(positionStar, direction, this.itemSpeed));
        }
    }

    updateItems(ctx) {
        for(let i = this.items.length - 1; i >= 0; i--) {
            this.items[i].update(ctx, this.itemSpeed);

            //Border
            //Count and delete lost stars.
            if(this.items[i].itemBorderPassed(ctx)) {
                this.lost++;
                this.deleteItem(i);
            }

            if(this.items[i].catchable) {
                //Count and delete caught stars.
                if(GameObject.circleCollision(this.player, this.items[i])) {
                    if(this.items[i] instanceof Star) {
                        this.caught++;
                        this.deleteItem(i);   
                    } else if (this.items[i] instanceof AllStar) {
                        this.deleteItem(i);
                        this.allStar = true;
                        break;
                    }
                }                 
            }
        }
        if(this.allStar) {
            for(let i = this.items.length - 1; i >= 0; i--) {
                if(this.items[i] instanceof Star) {
                    this.caught++;
                    this.deleteItem(i);
                }
            }
            this.allStar = false;
        }
    }

    deleteItem(index) {
        this.items.splice(index, 1);
    }

    gameOverMessage() {
        if(this.gameOver === true) {
            if(this.voluntaryExit) this.gameOverText = ["EXITED GAME"];
            else this.gameOverText = ["GAME OVER"];
    
            if(this.voluntaryExit) this.gameOverText.push("See you again soon!", "\n");
            else {
                if(this.level > 4) this.gameOverText.push("Well done!", "\n"); //Adjust messages
                else if(this.level > 6) this.gameOverText.push("Amazing job!", "\n");
                else this.gameOverText.push("You can do better ;)", "\n");
            }
            
            this.gameOverText.push("Level: " + this.level, "\n", "\n", "New Game: E")
        }
    }

    draw(ctx) {
        this.drawHorizonGradient(ctx);
        //if(this.moon != undefined) {
        this.moon.draw(ctx);
        //    console.log("moon");
        //} else {
        this.sun.draw(ctx);
        //}
        this.drawTrees(ctx);
        this.drawLevelAndPoints(ctx);
        this.drawItems(ctx);
        this.player.draw(ctx);
    }

    drawHorizonGradient(ctx) {
        this.darkBlueHorizon = ["#040120", "#06012a", "#1d1847", "#241c6a"];
        this.risingSunHorizon = ["#06012a", "#1d1847", "#241c6a", "#4012a2", "#5e1eac", "#8f34c1", "#bb378f", 
                                 "#e44273", "#e05f5f", "#dc603b", "#e68f48", "#dda63e", "#f7d200"];
        this.risingPositions = [];

        let gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        //if(this.sun === undefined) { 
            gradient.addColorStop(0, this.darkBlueHorizon[0]);
            gradient.addColorStop(.1, this.darkBlueHorizon[1]);
            gradient.addColorStop(.3, this.darkBlueHorizon[2]);
            gradient.addColorStop(.7, this.darkBlueHorizon[3]);
        //} else {
            
        //}
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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