import { SpriteCirclularMovableObject } from "../GameObject.js";

export class DropItem extends SpriteCirclularMovableObject { //Base class for all items that are falling from the sky.
    
    constructor(x, direction, dropSpeed, color, catchableSize, sizeFactor, imageID) {
        super(x, 40, Math.random() * dropSpeed/2 * direction, dropSpeed + 0.3, color, 0);
        this.catchableSize = catchableSize;
        this.sizeFactor = sizeFactor;
        this.catchable = false;
        //this.maxSize = maxSize;
        this.image = document.getElementById(imageID); //Each item is represented by an image, see ImageInitializer.
    }

    draw(ctx) {
        //Catchable items start to shine.
        if(this.catchable) {
            ctx.fillStyle = this.color;
            ctx.filter = "blur(10px)";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
            ctx.filter ="none";
        }
        //Extension subclasses: Draw image.
    }

    update(ctx) {
        if(this.frozen) { //Apply frozen effect on an item.
            this.releaseCounter--; //Counter to lift frozen effect -> decremented with each update()-call.
            if(this.releaseCounter <= 0) {
                this.frozen = false;
            }
        }
        else {
             //Items increase in size and speed while falling.
            this.radius += this.vy * this.sizeFactor;
            this.vx *= 1.005;
            this.vy *= 1.004
        }
        if(this.radius >= this.catchableSize) this.catchable = true; //Become catchable at certain size.
        super.update(ctx); //Move item.
    }

    //Item has fully passed border (used for deleting items).
    itemBorderPassed(ctx) {
        return this.y > ctx.canvas.height;
    }
}

export class Star extends DropItem { //Basic star, needs to be collected to gain points.
    
    constructor(x, direction, itemSpeed) {
        super(x, direction, itemSpeed, "#fac95e", 10, 0.05, "starImage");
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(this.image, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
    }
}

export class AllStar extends DropItem { //Special item: All normal stars currently in the game are collected when caught. Does not apply to other special items, no point increase.

    constructor(x, direction, itemSpeed) {
        super(x, direction, itemSpeed, "#ce4750", 5, 0.03, "allStarImage");
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(this.image, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
    }
}

export class Snow extends DropItem { //Special item: //SOME EFFECT
    constructor(x, direction, itemSpeed) {
        super(x, direction, itemSpeed, "white", 5, 0.03, "snowImage");
    }

    update(ctx) {
        super.update(ctx);
    }

    draw(ctx) {
        super.draw(ctx);
       ctx.drawImage(this.image, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3.5);
    }
}
