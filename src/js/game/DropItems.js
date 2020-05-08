import { SpriteMovableObject } from "../GameObject.js";

export class Star extends SpriteMovableObject {
    
    constructor(x, y, radius, starSpeed) {
        let direction;
        if(Math.random() <= 0.5) direction = 1;
        else direction = -1;
        super(x, y, Math.random() * starSpeed/2 * direction, starSpeed, radius, "src/images/star.png");
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x - this.radius * 1.55, this.y - this.radius *1.55, this.radius * 3, this.radius * 3);
    }

    //Star has fully passed border (used for deleting stars).
    starBorderPassed(ctx) {
        return this.y > ctx.canvas.height;
    }
}