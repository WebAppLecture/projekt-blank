import { MovingBackgroundObject, SpriteMovableObject } from "../GameObject.js";

export class TreeRow extends MovingBackgroundObject {

    static treeImages = ["src/images/trees-placeholder.png"];

    constructor(x, y, treeSpeed, imageNumber, lastRow) {
        let image;
        if(imageNumber < TreeRow.treeImages.length) image = TreeRow.treeImages[imageNumber];
        else image = treeImages[0];

        super(x, y, "white", 1100, 300, 0, treeSpeed, image);
        this.initialDrawWidth = 1100;
        this.initialDrawHeight = 350;
        this.drawWidth = this.initialDrawWidth;
        this.drawHeight = this.initialDrawHeight;
        this.lastRow = lastRow;
        if(this.lastRow) this.transparency = 0.1;
    }

    treeBorderPassed(ctx) {
        return this.y > ctx.canvas.height;
    }

    update(ctx, index, speed) {
        let changeX = this.initialDrawWidth * speed/6 * 0.0015 * index ;
        let changeY = this.initialDrawHeight * speed/6 * 0.0005 * index;
        //if(!this.lastRow) {
            this.drawWidth += changeX; 
            this.drawHeight += changeY;
            this.x -= changeX / 2;
        //}
        //else if(this.transparency >= 1) this.lastRow = false; //If row fully visible its no longer the last row.
        //else this.transparency += changeY;
        super.update(ctx);
    }

    draw(ctx, lastRow) {
        if(lastRow) {
            ctx.save();
            ctx.globalAlpha = this.transparency; //TODO doesnt work
            ctx.drawImage(this.img, this.x, this.y, this.drawWidth,  this.drawHeight);
            ctx.restore();
        }
        else ctx.drawImage(this.img, this.x, this.y, this.drawWidth,  this.drawHeight);
    }
}

export class CirculatingSpriteMovableObject extends SpriteMovableObject {
    constructor(x, y, radius, circ, img) { 
        super(x, y, "transparent", 0, 0, radius, img);
        this.angle = 0;
        this.circ = circ; //circ = radius circulation
    }

    //https://stackoverflow.com/questions/17384663/canvas-move-object-in-circle
    update(ctx) {
        this.angle += Math.acos((1 - Math.pow(1 / this.circ, 2) / 2)); // TODO slow down
        this.vx = this.circ * Math.cos(this.angle); 
        this.vy = this.circ * Math.sin(this.angle);
        super.update(ctx);
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.radius, this.radius);
    }
}


export class Moon extends CirculatingSpriteMovableObject {
    constructor() {
        super(300, 250, 200, 17, "src/images/moon-placeholder.png");
    }

    draw(ctx) {
        ctx.save();
        ctx.rotate( - Math.PI/180 * 20);
        super.draw(ctx);
        ctx.restore();
    }

    update(ctx) {
        super.update(ctx);
        //console.log(this.x) //apprx. max position values: high: 250 low: 825 left: 5 right: 580
    }
 
}

export class Sun extends CirculatingSpriteMovableObject {
    constructor() {
        super(400, 600, 250, -17, "src/images/sun-placeholder.png");
    }

    update(ctx) {
        super.update(ctx);
        //console.log(this.x); //apprx. max position values: high: 25 low: 600 left: 120 right: 695
    }
}