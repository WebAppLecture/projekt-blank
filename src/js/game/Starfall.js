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
        //this.initBackground();
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
        this.caught = 0;
        this.lost = 0;
        this.lostPenalty = this.baseLostPenalty;
        this.points = 0;
        this.pointsNeeded = this.basePointsNeeded * this.level;
        this.playerSpeed = this.basePlayerSpeed;
        this.starSpeed = this.baseStarSpeed;
        this.reset();
    }

    //Reset current game progress.
    reset() {
        this.stars = [];
        this.lost = 0;
        this.caught = 0;
    }

    //Modifies stats for next difficulty level.
    levelUp() {
        this.reset();
        this.level++;
        this.playerSpeed *= 1.1;
        this.starSpeed += 0.5;
        this.pointsNeeded += this.basePointsNeeded;
        //evtl modify starspawnmodifier/starspeed/lostPenalty
    }

    //Initializes background variables.
    initBackground() {
        this.trees = [];
        this.treeSpeed = 1;
        this.createTrees(5);
        this.moon = new Moon(1);
        this.sun = new Sun();
    }

    //Initializes forest background by creating a given number of trees.
    createTrees(number) {
        let positionStart = 300;
        let positionCurrent = positionStart;
        for(let i = 0; i < number; i++) {
            this.trees.push(new TreeRow(positionCurrent, this.treeSpeed))
            console.log(this.trees.length);
            positionCurrent += positionStart * 0.1;
        }
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
        this.checkStars(ctx);
        this.gameOverMessage();
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
            this.stars.push(new Star(positionStar, this.dropStarRadius, this.starSpeed));
        }
    }

    checkStars(ctx) {
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
        //this.moon.draw(ctx);
        //this.sun.draw(ctx);
        //this.drawTreeLine(ctx);
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

    //PLACEHOLDER
    drawTreeLine(ctx) {
        let img = document.createElement("img");
        img.src = "src/images/trees-placeholder.png";
        ctx.drawImage(img, 0, ctx.canvas.height * 0.75, ctx.canvas.width, ctx.canvas.height * 0.5);
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
        let text = ["Points: " + Math.ceil(this.points), "", " Level: " + this.level];

        for(let  i = 0; i < text.length; i++) {
            let startY = text.length/2 + fontSize * 2;
            ctx.fillText(text[i], ctx.canvas.width * 0.90, startY + i * fontSize);
        }
    }

    drawBackground(ctx) {
        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].draw(ctx);
        }
    }

    static get NAME() {
        return "Start Game: E";
    }
}