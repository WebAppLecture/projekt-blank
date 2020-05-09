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

    start() {
        this.baseStats();
        this.firstLevelStats();
        this.initBackground();
        this.player = new Player(this.playerSpeed);
        this.gameOver = false;
    } 

    //Initializes base stats (final).
    baseStats() {
        this.dropStarRadius = 1; //Star size when entering screen.
        this.starIncreaseFactor = 0.06; //Percentage by which falling stars increase in size.
        this.maxStarRadius = 15; //Final star size: when this size is reached they can be caught by the firefly.
        this.baseStarSpeed = 1.5;
        this.starSpawnModifier = 0.15;
        //this.starDriftFactor = 0; 
        this.basePlayerSpeed = 6; 
        this.basePointsNeeded = 10; //Points needed per level.
        this.baseLostPenalty = 0.5; //Percentage point deduction for lost stars.
    }

    //Set stats for first level.
    firstLevelStats() {
        this.level = 1;
        this.lostPenalty = this.baseLostPenalty;
        this.playerSpeed = this.basePlayerSpeed;
        this.starSpeed = this.baseStarSpeed;
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
        this.sun = new Sun();
    }

    //Initializes forest background by creating a given number of trees.
    initTrees(number) {
        let positionStart = 200;
        let distance = 100; //Distance to next tree row.
        let positionCurrent = positionStart;
        for(let i = this.trees.length; i < number; i++) {
            let imageNumber = this.treeCounter % TreeRow.treeImages.length; //Select tree image based on available number of variations, then repeat.
            this.trees.push(new TreeRow(-5, positionCurrent, this.treeSpeed, imageNumber));
            this.treeCounter++;
            //console.log(this.trees.length);
            positionCurrent += distance;
        }
    }

    //Adds a new tree row.
    newTree() {
        let position = 200;
        let imageNumber = this.treeCounter % TreeRow.treeImages.length; //Select tree image based on available number of variations, then repeat.
        this.trees.unshift(new TreeRow(-5, position, this.treeSpeed, imageNumber));
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
        if(this.points === this.pointsNeeded) {
            this.levelUp();
        }
        if(this.points < 0) {
            this.gameOver = true; 
        }
        this.player.update(ctx);
        this.dropStar(ctx);
        this.updateStars(ctx);
        this.gameOverMessage();
        this.updateTrees(ctx);
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
            this.stars.push(new Star(positionStar, 0, this.dropStarRadius, this.starSpeed));
        }
    }

    updateStars(ctx) {
        for(let i = this.stars.length - 1; i >= 0; i--) {
            this.stars[i].update(ctx);

            if(this.stars[i].radius < this.maxStarRadius) {
                this.stars[i].radius += this.starSpeed * this.starIncreaseFactor;
            }

            //Border
            //Count and delete lost stars.
            if(this.stars[i].starBorderPassed(ctx)) {
                this.lost++;
                this.deleteStar(i);
            }

            if(this.stars[i].radius >= this.maxStarRadius) {
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
            if(this.points < 0) {
                this.gameOverText = ["GAME OVER"];
            } 
            else {
                this.gameOverText = ["EXITED GAME"];
            }
            this.gameOverText.push("\n", "Level: " + this.level, "\n", "\n", "New Game: E")
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
            //Catchable stars start to shine:
            if(this.stars[i].radius >= this.maxStarRadius) {
                ctx.fillStyle = "#fac95e";
                ctx.filter = "blur(10px)";
                ctx.beginPath();
                ctx.arc( this.stars[i].x, this.stars[i].y, this.stars[i].radius, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.fill();
                ctx.filter ="none";
            }
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