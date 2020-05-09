export class GameTemplate {

    constructor(mode) {
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
        this.gameOverText = ["GAME OVER", " ", "Restart: E"];
    }

    start() {}

    bindControls() {}

    tick(ctx) {
        if(this.gameOver) {
            this.gameOverScreen(ctx);
            return;
        }
        this.update(ctx);
        this.draw(ctx);
    }

    update() {}

    draw() {}

    gameOverScreen(ctx) {
        let fontSize = 30;
        ctx.fillStyle = this.fillStyle;
        ctx.font = fontSize + "px monospace";
        ctx.textAlign = "center";
        ctx.textBaseLine = "middle";

        let startY = ctx.canvas.height/2 - this.gameOverText.length/2 * fontSize;
        this.gameOverText.forEach((line, i) => {
            ctx.fillText(line, ctx.canvas.width/2, startY + i * fontSize);
        }); 
    }

    input(type, active) {
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