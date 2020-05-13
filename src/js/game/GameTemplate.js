import { ImageInitializer } from "./ImageInitializer.js";

export class GameTemplate {

    constructor(mode) {
        this.imageLoader = new ImageInitializer();
        this.fillStyle = "white";
        this.applyMode(mode);
        this.start();
        this.bindControls();
        }

    applyMode(mode) {
        if(!mode) {
            return;
        }
        Object.keys(mode.parameters).forEach(key => {
            this[key] = mode.parameters[key];
        });
    }

    gameOverMessage() {
        this.message = ["GAME OVER", " ", "Restart: E"];
    }

    start() {}

    bindControls() {}

    tick(ctx) {
        if(this.gameOver) {
            this.messageScreen(ctx);
            return;
        }
        if(this.nextLevel) {
            this.messageScreen(ctx);
            return;
        }
        this.update(ctx);
        this.draw(ctx);
    }

    update() {}

    draw() {}

    messageScreen(ctx) {
        this.fullBorder();
        let fontSize = 30;
        ctx.fillStyle = this.fillStyle;
        ctx.font = fontSize + "px monospace";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";

        let startY = ctx.canvas.height/2 - this.message.length/2 * fontSize;
        this.message.forEach((line, i) => {
            ctx.fillText(line, ctx.canvas.width/2, startY + i * fontSize);
        }); 
    }

    input(type, active) {
        if(this.nextLevel && type === "confirm") {
            this.nextLevel = false;
            this.startNextLevel();  
            this.bindControls();   
        }
        if(type === "exit") {
            this.gameOverMessage();
            this.gameOver = true;
            this.voluntaryExit = true;
        }
        if(this.gameOver && type === "confirm") {
            this.start();   
            this.bindControls();  
        }
        if(this.inputBinding.hasOwnProperty(type)) {
            this.inputBinding[type](active);
        }
    }

    static get NAME() {
        return "No Name given";
    }

    static get MODES() {
        return [];
    }
}