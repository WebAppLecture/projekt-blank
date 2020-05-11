import { SpriteMovableObject } from "../GameObject.js";

export class DropItem extends SpriteMovableObject {
    
    constructor(x, color, direction, dropSpeed, img, catchableSize, sizeFactor) {
        super(x, 40, color, Math.random() * dropSpeed/2 * direction, dropSpeed + 0.3, 0, img);
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
        ctx.drawImage(this.img, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
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
        super(x, "#fac95e", direction, starSpeed, "src/images/star.png",  10, 0.05);
    }

}

export class AllStar extends DropItem {

    constructor(x, direction, starSpeed) {
        super(x, "#ce4750", direction, starSpeed, "src/images/allstar.png",  5, 0.03);
        this.maxSize = 10;
    }
}