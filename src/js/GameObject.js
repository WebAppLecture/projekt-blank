export class GameObject {

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection 
     */
    static rectangleCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y;
    }

    static circleCollision(c1, c2) {
        let dx = c1.x - c2.x;
        let dy = c1.y - c2.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        return distance < c1.radius + c2.radius;
    }
}

export class StrokedObject extends GameObject {

    constructor(x, y, width, height, color, lineWidth) {
        super(x, y, width, height, color);
        this.lineWidth = lineWidth;
    }

    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeRect(
            this.x + this.lineWidth/2, 
            this.y + this.lineWidth/2, 
            this.width - this.lineWidth, 
            this.height - this.lineWidth);
    }
}

export class MovableGameObject extends GameObject {

    constructor(x, y, width, height, color, vx, vy) {
        super(x, y, width, height, color)
        this.vx = vx;
        this.vy = vy;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

export class CircleMovableObject extends MovableGameObject {

    constructor(x, y, color, vx, vy, radius) {
        super(x, y, 0, 0, color, vx, vy);
        this.radius = radius;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 10;
    }
}

export class SpriteMovableObject extends CircleMovableObject {

    constructor(x, y, vx, vy, radius, imgPath) {
        super(x, y, "white", vx, vy, radius);
        this.img = document.createElement("img");
        this.img.src = imgPath;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        
        ctx.drawImage(this.img, this.x, this.y, this.radius, this.radius);
    }
}

export class MovingBackgroundObject extends MovableGameObject {

    constructor(x, y, width, height, vx, vy, imgPath) {
        super(x, y, "red", width, height, vx, vy);
        this.img = document.createElement("img");
        this.img.src = imgPath;
    }

    draw(ctx) {
        /*
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        */
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
}