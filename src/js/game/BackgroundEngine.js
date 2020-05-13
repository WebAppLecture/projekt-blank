/*

//Currently still in Starfall.js

import { TreeRow, Sun, Moon } from "./Background.js";

export class BackgroundEngine {

    
    constructor() {
        //Variables
    }

    //Initializes background variables.
    initBackgroundStats() {
        this.treeSpeed = 0.5;
        this.numberOfTreeRows = 5;
        this.lastTreePosition = 250;
        this.horizonSpeed = 1;
        this.sunHorizonFirstIndex = 0;

        this.darkBlueHorizon = ["#040120", "#06012a", "#1d1847", "#241c6a"];

        this.risingSunHorizon = ["#040120", "#06012a", "#1d1847", "#241c6a", 
                                 "#281996", "#3723d3", "#6450ff", "#8071f0",
                                 "#b55ce6", "#e65cd4", "#e44273", "#dc603b",
                                 "#e68f48", "#dda63e", "#f7d200"];

        this.calcRisingPositons();
    }

    initBackground() {
        this.trees = [];
        this.treeCounter = 0; //Counts each created tree; used to keep track of which image to select for next row.
        this.initTrees(this.numberOfTreeRows);
        this.moon = new Moon(this.horizonSpeed);
        //this.sun = new Sun(this.horizonSpeed * 1.1);
    }

    //Initializes forest background by creating a given number of trees.
    initTrees(number) {
        //Front rows:
        let distance = this.lastTreePosition / this.numberOfTreeRows * 2; //Distance to next tree row.
        let positionCurrent = this.lastTreePosition;
        for(let i = this.trees.length; i < number; i++) {
            let imageNumber = this.treeCounter % this.imageLoader.numberTreeImages; //Select tree image based on available number of variations, then repeat.
            this.trees.push(new TreeRow(-5, positionCurrent, this.treeSpeed, imageNumber, false, this.imageLoader.numberTreeImages)); //Push initial.
            this.treeCounter++;
            positionCurrent += distance;
        }
        //Transparent back row:
        //this.newTree();
    }

    //Adds a new tree row.
    newTree() {
        let imageNumber = this.treeCounter % this.imageLoader.numberTreeImages;
        this.trees.unshift(new TreeRow(-5, this.lastTreePosition, this.treeSpeed, imageNumber, true, this.imageLoader.numberTreeImages)); //Unshift additional.
        this.treeCounter++;
    }

    updateBackground(ctx) {
        if(this.moon !== undefined) {
            this.moon.update(ctx);
            if(this.moon.moonDown()) {
                this.switchSky();
            }
        } else {
            this.sun.update(ctx);
            if(this.sun.isUp()) {
                this.gameOver = true;
                this.gameOverMessage();
            }
            this.updateSunHorizonIndex();
        }
        this.updateTrees(ctx);
    }

    updateSunHorizonIndex() {
        for(let i = 1; i < this.risingPositions.length - 4; i++) {
            if(this.sun.y > this.risingPositions[i]) {
                this.sunHorizonFirstIndex = i - 1;
                //console.log(this.sunHorizonFirstIndex)
                break;
            }
        }
    }

    updateTrees(ctx) {
        for(let i = this.trees.length - 1; i >= 0; i--) {
            this.trees[i].update(ctx, i, this.playerSpeed);

            if(this.trees[i].treeBorderPassed(ctx)) {
                this.trees.splice(i, 1);
            }    
        }

        if(this.trees.length < this.numberOfTreeRows) {
            this.newTree();
        }
    }

    switchSky() {
        this.moon = undefined;
        this.sun = new Sun(this.horizonSpeed * 1.1);
    }

    fullBorder() {
        document.getElementById("progress").style.marginTop = "-110vh";
    }

    resetProgressBar() {
        document.getElementById("progress").style.marginTop = "-24vh";
    }

    updateProgressBar() {
        let fullRange = 110 - 24; //See css comment (progressBox).
        let revealPercent = this.points / this.pointsNeeded; //Current percent of points needed.
        this.baseProgressMargin = -24; //Margin value: Progress box hides bar.
        this.progressMargin = this.baseProgressMargin - revealPercent * fullRange; //New margin value
        document.getElementById("progress").style.marginTop = "" + this.progressMargin + "vh"; //Reveal percent of glowing border as level progress indicator.
    }

    updateBackgroundStats() {
        this.treeSpeed += 0.4;
        this.horizonSpeed *= 0.7;
    }

    drawBackground(ctx) {
        this.drawHorizonGradient(ctx);
        if(this.moon !== undefined) {
            this.moon.draw(ctx);
        } else {
            this.sun.draw(ctx);
        }
        this.drawTrees(ctx);
        this.drawLevel(ctx);
    }

    //TODO: Finetune intervals.
    drawHorizonGradient(ctx) {
        let gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        let interval = 0.6 / 3;
        if(this.moon !== undefined) { 
            gradient.addColorStop(0.0, this.darkBlueHorizon[0]);
            gradient.addColorStop(interval, this.darkBlueHorizon[1]);
            gradient.addColorStop(interval * 2, this.darkBlueHorizon[2]);
            gradient.addColorStop(interval * 3, this.darkBlueHorizon[3]);
        } else {
            gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
            if(this.sunHorizonFirstIndex > 6) {
                let stops = 3 + (this.sunHorizonFirstIndex - 6);
                interval = 0.5 / stops;
                //console.log(stops);
            }

            gradient.addColorStop(0.0, this.risingSunHorizon[this.sunHorizonFirstIndex]);

            let percent = 0.2;
            let i = 1;
            while(percent <= 0.7) {
                //console.log(this.sunHorizonFirstIndex + i);
                gradient.addColorStop(percent, this.risingSunHorizon[this.sunHorizonFirstIndex + i]);
                percent += interval;
                i++;
            }
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    calcRisingPositons() {
        this.risingPositions = []
        let max = 70;
        let min = 500;
        let interval = (min - max) / this.risingSunHorizon.length;
        let nextPosition = min - interval;
        do {
            this.risingPositions.push(nextPosition);
            nextPosition -= interval * 1;
        } while (nextPosition >= max)
    }

    drawTrees(ctx) {
        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].draw(ctx);
        }
    }
}
*/