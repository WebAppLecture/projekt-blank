import { GameObject } from "../GameObject.js";
import { GameTemplate} from "./GameTemplate.js";
import { Player } from "./Player.js";
import { Star } from "./DropItems.js";
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
        this.baseStats();
        this.firstLevelStats();
        this.initBackground();
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
        this.starSpeed = this.baseSpeed / 4;
        this.reset();
    }

    //Reset current game progress.
    reset() {
        this.stars = [];
        this.lost = 0;
        this.caught = 0;
        this.points = 0;
        this.pointsNeeded = this.basePointsNeeded * this.level;
    }

    //Modifies stats for next difficulty level.
    levelUp() {
        this.level++;
        this.playerSpeed *= 1.1;
        this.starSpeed += 0.5;
        this.reset();
        //evtl modify starspawnmodifier/starspeed/lostPenalty
    }

    //Initializes background variables.
    initBackground() {
        this.trees = [];
        this.treeSpeed = 0.5;
        this.numberOfTreeRows = 5;
        this.treeCounter = 0; //Counts each created tree; used to keep track of which image to select for next row.
        this.initTrees(this.numberOfTreeRows);
        this.moon = new Moon(1);
        this.sun = new Sun(1);
    }

    //Initializes forest background by creating a given number of trees.
    initTrees(number) {
        let positionStart = 200;
        //Front rows:
        let distance = 100; //Distance to next tree row.
        let positionCurrent = positionStart;
        for(let i = this.trees.length; i < number; i++) {
            let imageNumber = this.treeCounter % TreeRow.treeImages.length; //Select tree image based on available number of variations, then repeat.
            this.trees.push(new TreeRow(-5, positionCurrent, this.treeSpeed, imageNumber, false));
            this.treeCounter++;
            positionCurrent += distance;
        }
        //Transparent back row:
        //this.newTree();
    }

    //Adds a new tree row.
    newTree() {
        let position = 200;
        let imageNumber = this.treeCounter % TreeRow.treeImages.length; //Select tree image based on available number of variations, then repeat.
        this.trees.unshift(new TreeRow(-5, position, this.treeSpeed, imageNumber, true));
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
        this.points = this.caught - this.lost * this.lostPenalty; //Calculate current points.
        if(this.points < 0) {
            this.gameOver = true; 
        }
        this.player.update(ctx);
        this.dropStar(ctx);
        this.updateStars(ctx);
        this.gameOverMessage();
        this.updateTrees(ctx);
        if(this.points === this.pointsNeeded) {
            this.levelUp();
        }
    }

    updateTrees(ctx) {
        for(let i = this.trees.length - 1; i >= 0; i--) {
            this.trees[i].update(ctx, i, this.playerSpeed);

            if(this.trees[i].treeBorderPassed(ctx)) {
                this.trees.splice(i, 1);
                //console.log(i);
            }    
        }

        if(this.trees.length < this.numberOfTreeRows) {
            this.newTree();
        }
    }

    //Drops new stars from the sky.
    dropStar(ctx) {
        // Add new star when 
        // 1) there is no star yet 
        // 2) the last added star has passed a certain percentage of the screen.
        if(this.stars.length == 0 || this.stars[this.stars.length - 1].y >= ctx.canvas.height * this.starSpawnModifier) { 
            let positionStar;
            do {
                positionStar = Math.random() * ctx.canvas.width;
            } while(positionStar < ctx.canvas.width/4 || positionStar > ctx.canvas.width - ctx.canvas.width/4);
            let direction;
            if(positionStar <= ctx.canvas.width/2) direction = -1;
            else direction = 1;
            this.stars.push(new Star(positionStar, direction, this.starSpeed));
        }
    }

    updateStars(ctx) {
        for(let i = this.stars.length - 1; i >= 0; i--) {
            this.stars[i].update(ctx, this.starSpeed);

            //Border
            //Count and delete lost stars.
            if(this.stars[i].starBorderPassed(ctx)) {
                this.lost++;
                this.deleteStar(i);
            }

            if(this.stars[i].catchable) {
                //Count and delete caught stars.
                if(GameObject.circleCollision(this.player, this.stars[i])) {
                    this.caught++;
                    this.deleteStar(i);   
                }                 
            }
        }
    }

    deleteStar(index) {
        this.stars.splice(index, 1);
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
        this.moon.draw(ctx);
        this.sun.draw(ctx);
        this.drawTrees(ctx);
        this.drawLevelAndPoints(ctx);
        this.drawStars(ctx);
        this.player.draw(ctx);
    }

    drawHorizonGradient(ctx) {
        let gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); 
        gradient.addColorStop(0, "#040120");
        gradient.addColorStop(.1, "#06012a");
        gradient.addColorStop(.3, "#1d1847");
        gradient.addColorStop(.7, "#241c6a");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    drawTrees(ctx) {
        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].draw(ctx);
        }
    }

    drawStars(ctx) {
        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i].draw(ctx);
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
        return "Start Game: E";
    }
}