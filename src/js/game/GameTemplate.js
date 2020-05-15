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

    stopGame() {}

    start() {}

    bindControls() {}

    tick(ctx) {
        if(this.gameOver) { 
            this.stopGame();
            this.messageScreen(ctx);
            return;
        }
        if(this.nextLevel) {
            this.nextLevelMessage();
            this.messageScreen(ctx);
            return;
        }
        this.update(ctx);
        this.draw(ctx);
    }

    update() {}

    draw() {}

    //Modified gameOverScreen to be applicable to all kinds of messages.
    messageScreen(ctx) {
        this.backgroundEngine.fullBorder();
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
        if(type === "confirm") {
            if(this.nextLevel) { //Start next level when user confirms.
                this.nextLevel = false;
                this.startNextLevel();  
                this.bindControls(); 
            }
            else if(this.gameOver) { //Display results when game over.
                this.start();   
                this.bindControls();    
            }
            this.music.stop();
        }
        else if(type === "quit") {
            if(!this.gameOver) { //First keydown: Stop game and display results.
                this.gameOver = true;
                this.voluntaryExit = true;
            }
            else if(active) { //Second keydown: Return to start screen.
                window.gameEngine.reset(); 
            }
            this.music.stop();
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