import { SpriteCirclularMovableObject } from "../GameObject.js";

export class Player extends SpriteCirclularMovableObject {
   
    constructor(speed) {
        super(550, 600, 0, 0, "white", 30);
        this.speed = speed;
        this.image = document.getElementById("fireflyImage");
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

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2.5, this.radius * 2.5);
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