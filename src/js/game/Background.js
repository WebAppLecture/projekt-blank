import { MovingBackgroundObject, SpriteMovableObject } from "../GameObject.js";

export class TreeRow extends MovingBackgroundObject {

    static treeImages = ["src/images/trees-placeholder.png"];

    constructor(x, y, treeSpeed, imageNumber) {
        let image;
        if(imageNumber < TreeRow.treeImages.length) image = TreeRow.treeImages[imageNumber];
        else image = treeImages[0];

        super(x, y, 1100, 300, 0, treeSpeed, image);
        this.initialDrawWidth = 1100;
        this.initialDrawHeight = 350;
        this.drawWidth = this.initialDrawWidth;
        this.drawHeight = this.initialDrawHeight;
    }

    treeBorderPassed(ctx) {
        return this.y > ctx.canvas.height;
    }

    update(ctx, index, playerSpeed) {
        let changeX = this.initialDrawWidth * playerSpeed/6 * 0.001 * index ;
        let changeY = this.initialDrawHeight * playerSpeed/6 * 0.00025 * index;
        this.drawWidth += changeX; 
        this.drawHeight += changeY;
        this.x -= changeX / 2;
        super.update(ctx);
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.drawWidth,  this.drawHeight);
    }
}


export class Moon extends SpriteMovableObject {
    constructor(speed) {
        super(50, 180, 0, 0, 200, "src/images/moon-placeholder.png");
        this.speed = speed;
    }

    update(ctx) {
        let angle = Math.acos(1 - (ctx.height / ctx.width * 4) ^ 2 / 2);
        let radius = ctx.width / 4;
        this.x += radius * Math.sin(angle);
        this.y += radius * Math.cos(angle);
        super.update();
    }

    draw(ctx) {
        ctx.save();
        ctx.rotate(Math.PI/-180 * 20);
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