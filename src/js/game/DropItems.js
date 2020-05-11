import { SpriteCirclularMovableObject } from "../GameObject.js";

export class DropItem extends SpriteCirclularMovableObject {
    
    constructor(x, direction, dropSpeed, color, img, catchableSize, sizeFactor) {
        super(x, 40, Math.random() * dropSpeed/2 * direction, dropSpeed + 0.3, color, 0, img);
        this.catchableSize = catchableSize;
        this.sizeFactor = sizeFactor;
        this.increase = true;
        this.catchable = false;
    }

    draw(ctx) {
        //Catchable items start to shine:
        if(this.catchable) {
            ctx.fillStyle = this.color;
            ctx.filter = "blur(10px)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.filter ="none";
        }
        //Add draw image individually for each class.
    }

    update(ctx) {
        if(this.increase) {
            this.radius += this.vy * this.sizeFactor;
            this.vx *= 1.005;
            this.vy *= 1.004
            if(this.radius >= this.catchableSize) this.catchable = true;
        } 
        super.update(ctx);
    }

    //Item has fully passed border (used for deleting items).
    itemBorderPassed(ctx) {
        return this.y > ctx.canvas.height;
    }
}

export class Star extends DropItem {
    
    constructor(x, direction, starSpeed) {
        super(x, direction, starSpeed, "#fac95e", "src/images/star.png",  10, 0.05);
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(this.img, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
    }
}

export class AllStar extends DropItem {

    constructor(x, direction, starSpeed) {
        super(x, direction, starSpeed, "#ce4750", "src/images/allstar.png",  5, 0.03);
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(this.img, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
    }
}