import { MovingBackgroundObject, SpriteMovableObject } from "../GameObject.js";

export class TreeRow extends MovingBackgroundObject {
    /*
    constructor(y, treeSpeed) {
        super(-5, y, 1100, 300, 0, treeSpeed, "src/images/trees-placeholder.png");
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, ctx.canvas.height - 300, this.width, this.height);
    }
    */
}


export class Moon extends SpriteMovableObject {
    constructor(speed) {
        super(50, 180, 0, 0, 200, "src/images/moon-placeholder.png");
        this.speed = speed;
    }

    draw(ctx) {
        ctx.save();
        ctx.rotate(Math.PI/-180 * 10);
        ctx.drawImage(this.img, this.x, this.y, this.radius, this.radius);
        ctx.restore();
     }
 
}

export class Sun extends SpriteMovableObject {
    constructor(speed) {
        super(800, 140, 0, 0, 250, "src/images/sun-placeholder.png");
        this.speed = speed;
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.radius, this.radius);
     } 
}