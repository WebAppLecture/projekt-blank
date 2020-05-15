import { GameObject } from "../GameObject.js";
import { GameTemplate} from "./GameTemplate.js";
import { Player } from "./Player.js";
import { Star, AllStar, Snow } from "./DropItems.js";
import { Sound } from "./Sound.js";
import { ImageInitializer } from "./ImageInitializer.js";
import { BackgroundEngine } from "./BackgroundEngine.js";

export class Starfall extends GameTemplate {
    
    //TODO: 
    //Improve controls
    //Finetune hitboxes
    //Add magnet, jewel, clock
    //Add background images
    //Add white/grey progress bar

    //Update horizon colors
    //Add lightening (?)
    //Add button sound
    //Add tutorial -> controls/dropItems
    //Modify level up messages

    start() {
        this.imageInitializer = new ImageInitializer(); //Load all images for the game.
        this.backgroundEngine = new BackgroundEngine(this.imageInitializer); //Create background.
        this.initSounds(); //Initialize sounds.
        this.baseStats();
        this.firstLevel(); //Set stats for the first level.
        this.player = new Player(this.playerSpeed); 
        this.gameOver = false;
        this.nextLevel = false; //Used to display screen for next level.
        this.voluntaryExit = false; //Used to differentiate messages for player lost/left the game.
    } 

    //Passes game stats to background to enable speed control and progress indication.
    passGameStatsToBackgroundEngine() {
        this.backgroundEngine.playerSpeed = this.playerSpeed;
        this.backgroundEngine.points = this.points;
        this.backgroundEngine.pointsNeeded = this.pointsNeeded;
    }

    initSounds() {
        this.music = new Sound("src/sounds/music.mp3");
        this.starSound = new Sound("src/sounds/star.mp3");
    }

    //Initializes base stats (final).
    baseStats() {
        this.baseSpeed = 6; 
        this.starSpawnModifier = 0.15;
        this.basePointsNeeded = 10; //Points needed per level.
        this.baseLostPenalty = 0.5; //Percentage point deduction for each lost star.
    }

    //Set stats for first level.
    firstLevel() {
        this.level = 1;
        this.lostPenalty = this.baseLostPenalty;
        this.playerSpeed = this.baseSpeed;
        this.itemSpeed = this.baseSpeed / 4;
        this.reset();
    }

    //Reset current game progress.
    reset() {
        this.items = [];
        this.lost = -3; //Set to -3 to give player a "buffer" at the beginning of each level. Otherwise missing the first star results in immediate game over.
        this.caught = 0;
        this.points = 0;
        this.pointsNeeded = this.basePointsNeeded * this.level;
        this.player = new Player(this.playerSpeed); //Reset player to start at the same position each level.
        this.passGameStatsToBackgroundEngine(); //Pass updated stats to background.
        this.backgroundEngine.initBackground(); //Create background.
        this.backgroundEngine.resetProgressBar(); //Reset progress indicator.
    }

    //Modifies stats for next difficulty level.
    levelUp() {
        this.nextLevel = true;
    }

    //Called when user confirms the next level: Updates game difficulty, background and resets game state.
    startNextLevel() {
        this.updateGameStats();
        this.backgroundEngine.updateBackgroundStats();
        this.reset();
    }

    //Increase game speed for each level.
    updateGameStats() {
        this.level++;
        this.playerSpeed *= 1.1;
        this.itemSpeed += 0.5;
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
        this.passGameStatsToBackgroundEngine();
        let sunIsUp = this.backgroundEngine.updateBackground(ctx); //When sun has reached its "highest" point, game over applies bec. stars are not visible during daylight. 
        if(sunIsUp) {
            this.gameOver = true;
            this.gameOverMessage();
        }
        this.backgroundEngine.updateProgressBar();
    }

    updateGame(ctx) {
        this.dropItem(ctx);
        this.updateItems(ctx);
        if(this.lost >= 0) this.points = this.caught - this.lost * this.lostPenalty; //Calculate current points.
        else this.points = this.caught;
        if(this.points < 0) { 
            this.gameOver = true; 
            this.gameOverMessage();
        }
        else if(this.points >= this.pointsNeeded) {
            this.levelUp();
        }
    }

    //Drops new items from the sky.
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
                    this.items.push(new Snow(positionItem, direction, this.itemSpeed)) //3% drop chance
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
                if(this.items[i] instanceof Star) { //Only missed normal stars cause point loss; special items don't count.
                    this.lost++; 
                }
                this.deleteItem(i);
            }

            if(this.items[i].catchable) {
                //Count and delete caught stars.
                if(GameObject.circleCollision(this.player, this.items[i])) {
                    if(this.items[i] instanceof Star) {
                        this.deleteItem(i);   
                        this.caught++; //Normal stars give points.
                    } else if (this.items[i] instanceof AllStar) {
                        this.deleteItem(i);   
                        this.allStar = true;
                        this.starSound.play(); //Console error: favicon.ico not found?? 
                        break;
                    } 
                    else if (this.items[i] instanceof Snow) {
                        this.deleteItem(i);   
                        this.snow = true;
                    }
                }
                //Delete stars that have surpassed maxSize.
                if(this.items[i].size >= this.items[i].maxSize) {
                    this.deleteItem(i);
                }
            }
        }
        //If special item caught, apply special effects.
        if(this.allStar) { 
            this.allStarEffect();
        }
        if(this.snow) { 
            this.snowEffect(); 
        }
    }

    //All normal stars are "caught" and added to point tally. Does not apply to other special items.
    allStarEffect() {
        for(let i = this.items.length - 1; i >= 0; i--) {
            if(this.items[i] instanceof Star) {
                this.caught++;
                this.deleteItem(i);
            }
        }
        this.allStar = false;
    }

    //TODO
    snowEffect() {
        for(let i = 0; i < this.items.length; i++) {
            if(this.items[i] instanceof Star && this.items[i].catchable && !this.items[i].frozen) { //Only applies to catchable, not already affected normal stars.
                this.items[i].frozen = true;
                this.items[i].releaseCounter = 100; //Update cycles until effect lifted.
                this.vy *= 0.8;
            }
        }
        this.snow = false;
    }

    deleteItem(index) {
        this.items.splice(index, 1);
    }

    //Message shown between level stages.
    nextLevelMessage() {
        if(this.nextLevel === true) { 
            if(this.level <= 3) this.message = ["Well done!"];
            else if(this.level <= 6) this.message = ["Great job!"];
            else if(this.level >= 8) this.message = ["Master catcher!"];
            this.message.push(" ", " ", "Ready for level " + (this.level + 1) + "?", " ", "Next Level: Enter");
        }
    }

    //Message shown at game over or when player exited game.
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
        this.backgroundEngine.drawBackground(ctx);
        this.drawItems(ctx);
        this.player.draw(ctx);
        this.drawLevel(ctx);
    }

    drawItems(ctx) {
        for(let i = 0; i < this.items.length; i++) {
            this.items[i].draw(ctx);
        }  
    }

    //Level indicator in the top right corner.
    drawLevel(ctx) {
        let fontSize = 30;
        ctx.fillStyle = this.fillStyle;
        ctx.font = fontSize + "px monospace";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";
        let text = [" Level: " + this.level]; 

        for(let  i = 0; i < text.length; i++) {
            let startY = text.length/2 + fontSize * 2;
            ctx.fillText(text[i], ctx.canvas.width * 0.90, startY + i * fontSize);
        }
    }

    static get NAME() {
        return "Start Game: Enter";
    }
}