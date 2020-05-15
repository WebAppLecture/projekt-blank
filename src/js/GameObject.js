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

export class SpriteCirclularMovableObject extends MovableGameObject { //Movable object, represented by picture; shape: circle.

    constructor(x, y, vx, vy, color, radius) {
        super(x, y,  0, 0, color, vx, vy); 
        this.radius = radius;
    }

    draw(ctx, imagePath) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        
        ctx.drawImage(document.getElementById(imagePath), this.x, this.y, this.radius, this.radius);
    }
}

export class SpriteSquareMovableObject extends MovableGameObject { //Movable object, represented by picture; shape: rectangle.

    constructor(x, y, width, height, vx, vy) {
        super(x, y, "red", width, height, vx, vy); //Color to test
    }

    draw(ctx, imagePath) {
        /*
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
        */
        ctx.drawImage(document.getElementById(imagePath), this.x, this.y, this.width, this.height);
    }
}