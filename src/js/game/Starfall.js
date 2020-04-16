import { GameObject, CircleMovableObject, PictureCircleMovableObject } from "../GameObject.js";
import { GameTemplate} from "./GameTemplate.js";

export class Starfall extends GameTemplate {
    
    start() {
        this.player = new Player(8);
        this.gameOver = false;
        this.points = 0;
        this.lives = 5;
        this.stars = [];
        this.starSpeed = 2;
        this.starSpawnModifier = 0.1; //Determines how long it takes for new stones to appear (percent of screen).
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
        this.dropStar(ctx);
        this.checkStars(ctx);
        this.gameOverMessage();
    }

    draw(ctx) {
        this.player.draw(ctx);
        this.displayLives(ctx);
        for(let i = 0; i < this.stars.length; i++) {
            this.stars[i].draw(ctx);
        }  
    }

    displayLives(ctx) {
        ctx.fillStyle = "#AEEDBD";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillText(this.lives, this.player.x + this.player.radius/2, this.player.y + this.player.radius);
    }

    dropStar(ctx) {
        // Add new stone when 
        // 1) there is no stone yet 
        // 2) the last added stone has passed a certain percentage of the screen.
        if(this.stars.length == 0 || this.stars[this.stars.length - 1].y >= ctx.canvas.height * this.starSpawnModifier) { 
            let positionStone;
            do {
                positionStone = Math.random() * ctx.canvas.width;
            } while(positionStone < 50 || positionStone > ctx.canvas.width - 100); //Ensure stone fully shown in screen (stone width = 50))
            this.stars.push(new Star(positionStone, this.starSpeed));
        }
    }

    deleteStar(index) {
        this.stars.splice(index, 1);
    }

    checkStars(ctx) {
        for(let i = this.stars.length - 1; i >= 0; i--) {
            this.stars[i].update(ctx);

            //Border
            //Inactive stones get deleted when out of screen.
            if(this.stars[i].starBorderPassed(ctx)) {
                this.deleteStar(i);
            }

            //Catch
            if(GameObject.circleCollision(this.player, this.stars[i])) {
                this.points += 1;
                this.deleteStar(i);                    
            }
        }
    }

    gameOverMessage() {
        if(this.gameOver === true) {
            if(this.lives * 1 === 0) {
                this.gameOverText = ["GAME OVER"];
            } 
            else {
                this.gameOverText = ["EXITED GAME"];
            }
            this.gameOverText.push("\n", "Score: " + this.points, "\n", "\n", "New Game: E")
        }
    }

    static get NAME() {
        return "Start game";
    }
}

export class SpriteMovableObject extends CircleMovableObject {

    constructor(x, y, vx, vy, radius, imgPath) {
        super(x, y, "red", vx, vy, radius);
        this.img = document.createElement("img");
        this.img.src = imgPath;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill(); 
        ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);

    }
}

export class Player extends SpriteMovableObject {
   
    constructor(speed) {
        super(100, 100, 0, 0, 30, "src/images/firefly-placeholder.png");
        this.speed = speed;
    }

    up(bool) {    
        this.vy = bool * -this.speed; 
    }

    down(bool) {
        this.vy = bool * this.speed;
    }

    left(bool) {    
        this.vx = bool * -this.speed; 
    }

    right(bool) {
        this.vx = bool * this.speed;
    }

    update(ctx) {

        if(this.vy === 0 && this.vx === 0) {
            return;
        }
        if(this.y < 0) { //Top
            this.y = 0;
        } 
        if(this.y + this.height > ctx.canvas.height) { //Bottom
            this.y = ctx.canvas.height - this.height;
        }
        if(this.x < 0) { //Left
            this.x = 0;
        } 
        if(this.x + this.width > ctx.canvas.width) { //Right
            this.x = ctx.canvas.width - this.width;
        }
        super.update();
    }
}

export class Star extends CircleMovableObject {
    
    constructor(x, starSpeed) {
        let direction;
        if(Math.random() <= 0.5) direction = 1;
        else direction = -1;
        super(x, -20, "#6bd26b", Math.random() * starSpeed/2 * direction, starSpeed, 20);
    }

    //Star has fully passed border (used for deleting stars).
    starBorderPassed(ctx) {
        return this.y > ctx.canvas.height;
    }
}

/*
export class TreeRow extends GameObject {
    constructor(x, y, width, height, imageSource) {
        super(x, y, window, height, "transparent");
        this.image = new Image();
        this.image.src = "./idea.jpeg";
    }
}
*/