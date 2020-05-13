import { SpriteCirclularMovableObject } from "../GameObject.js";

export class DropItem extends SpriteCirclularMovableObject {
    
    constructor(x, direction, dropSpeed, color, catchableSize, sizeFactor, imageID) {
        super(x, 40, Math.random() * dropSpeed/2 * direction, dropSpeed + 0.3, color, 0);
        this.catchableSize = catchableSize;
        this.sizeFactor = sizeFactor;
        this.increase = true;
        this.catchable = false;
        this.image = document.getElementById(imageID);
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
    
    constructor(x, direction, itemSpeed) {
        super(x, direction, itemSpeed, "#fac95e", 10, 0.05, "starImage");
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(this.image, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
    }
}

export class AllStar extends DropItem {

    constructor(x, direction, itemSpeed) {
        super(x, direction, itemSpeed, "#ce4750", 5, 0.03, "allStarImage");
    }

    draw(ctx) {
        super.draw(ctx);
        ctx.drawImage(this.image, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
    }
}

export class Magnet extends DropItem {
    constructor(x, direction, itemSpeed) {
        super(x, direction, itemSpeed, "white", 5, 0.03, "magnetImage");
        this.angle = 0;
    }

    update(ctx) {
        super.update(ctx);
        this.angle %= 360; //Ensure value between 0 and 360.
        this.angle += 5; 
    }

    draw(ctx) {
        super.draw(ctx);
        /*
        ctx.save(); //Supposed to rotate around its own axis, currently doesn't work.
        ctx.translate(this.x + this.radius / 2,this.y + this.radius / 2);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(this.img, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
        ctx.restore();
        */
       ctx.drawImage(this.image, this.x - this.radius * 1.55, this.y - this.radius * 1.55, this.radius * 3, this.radius * 3);
    }
}