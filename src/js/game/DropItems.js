import { SpriteMovableObject } from "../GameObject.js";

export class Star extends SpriteMovableObject {
    
    constructor(x, direction, starSpeed) {
        super(x, 40, Math.random() * starSpeed/2 * direction, starSpeed + 0.3, 0, "src/images/star.png");
        this.catchableSize = 10;
        this.maxSize = 23;
        this.sizeFactor = 0.05;
        this.increase = true;
        this.catchable = false;
    }

    draw(ctx) {
        //Catchable stars start to shine:
        if(this.catchable) {
            ctx.fillStyle = "#fac95e";
            ctx.filter = "blur(10px)";
            ctx.beginPath();
            ctx.arc( this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.filter ="none";
        }
        //if(this.radius < this.maxSize) {
            ctx.drawImage(this.img, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
        //}
        //else {
        //    ctx.drawImage(this.img, this.x - this.maxSize * 1.55, this.y - this.maxSize * 1.55, this.maxSize * 3, this.maxSize * 3);
        //}
    }

    update(ctx) {
        //if(this.radius >= this.maxSize) this.increase = false;
        if(this.increase) {
            this.radius += this.vy * this.sizeFactor;
            this.vx *= 1.005;
            this.vy *= 1.004
            if(this.radius >= this.catchableSize) this.catchable = true;
        } 
        else {
            //this.vx *= 1.05;
            //this.vy *= 1.05;
            //this.radius -= this.vy * this.sizeFactor;
        }
        super.update(ctx);
    }

    //Star has fully passed border (used for deleting stars).
    starBorderPassed(ctx) {
        return this.y > ctx.canvas.height;
    }
}