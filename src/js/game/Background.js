import { SpriteSquareMovableObject, SpriteCirclularMovableObject } from "../GameObject.js";

export class TreeRow extends SpriteSquareMovableObject {

    static treeImages = ["src/images/trees-placeholder.png"];

    constructor(x, y, treeSpeed, imageNumber, lastRow) {
        let image;
        if(imageNumber < TreeRow.treeImages.length) image = TreeRow.treeImages[imageNumber];
        else image = treeImages[0];

        super(x, y, 1100, 300, 0, treeSpeed, image);
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

export class CirculatingSpriteMovableObject extends SpriteCirclularMovableObject {
    constructor(startX, startY, radius, circ, img) { 
        super(startX, startY, 0, 0, "transparent", radius, img);
        this.startX = startX;
        this.startY = startY;
        this.angle = 0;
        this.speed = 1; //circulation speed 
        this.circ = circ; //circulation radius
    }

    //https://stackoverflow.com/questions/17384663/canvas-move-object-in-circle
    update(ctx) {
        this.angle -= Math.acos((1 - Math.pow(this.speed / this.circ, 2) / 4)); 
        this.x = 1.0 * (this.startX + this.circ * Math.cos(this.angle)); 
        this.y = 1.5 * (this.startY + this.circ * Math.sin(this.angle));//Factor > 1: Ellipsis, stretched in y-direction
        super.update(ctx);
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.radius, this.radius);
    }
}


export class Moon extends CirculatingSpriteMovableObject {
    constructor(speed) {
        //super(300, 600, 200, -400, "src/images/moon-placeholder.png"); //without transform
        super(150, 270, 200, -250, "src/images/moon-placeholder.png");
        this.angle = -4.5;
        this.speed = speed * 1;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.radius/2, this.y + this.radius/2);
        ctx.rotate( - Math.PI/180 * 20);
        super.draw(ctx);
        ctx.restore();
    }

    moonDown() {
        return this.y > 300;
    }

    update(ctx) {
        super.update(ctx);
        //console.log(this.y); //Get moon down postion.
        //console.log(this.angle); //Find starting value for angle to get correct position.
    }

    goneDown(treePosition) {
        return this.y + this.radius + 200 > treePosition;
    }
 
}

export class Sun extends CirculatingSpriteMovableObject {
    constructor(speed) {
        super(420, 280, 250, 250, "src/images/sun-placeholder.png");
        this.angle = 1;
        this.speed = speed * 1;
    }

    update(ctx) {
        super.update(ctx);
        //console.log(this.angle);
        //console.log(this.y); //Find values for horizon change.
    }
}