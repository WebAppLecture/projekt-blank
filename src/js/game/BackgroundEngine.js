import { TreeRow, Sun, Moon } from "./BackgroundObjects.js";

export class BackgroundEngine {

    constructor(imageInitializer, playerSpeed) {
        this.imageInitializer = imageInitializer;
        this.initBackgroundStats();
        this.playerSpeed = playerSpeed;
    }

    //Initializes background variables.
    initBackgroundStats() {
        this.treeSpeed = 0.5;
        this.numberOfTreeRows = 5;
        this.lastTreePosition = 250; 
        this.horizonSpeed = 1; //Movement speed modifier for sun and moon.
        this.risingSunIndex = 0; //Starting index for changing horizon color gradient.

        //Color stops for default sky.
        this.darkBlueHorizon = ["#040120", "#06012a", "#1d1847", "#241c6a"];

        //Color stops for horizon change.
        this.risingSunColors = ["#040120", "#06012a", "#1d1847", "#241c6a", 
                                 "#281996", "#3723d3", "#6450ff", "#8071f0",
                                 "#dd5ce6", "#e25099", "#e44273", 
                                 "#ff3a08", "#fb6501", "#f89500", "#ffb84e"];

        this.finalBlueSky = ["#014c82", "#1776ba", "#1f9df8", "#84c8f8"];

        this.calcRisingPositons();
    }

    initBackground() {
        this.trees = [];
        this.treeCounter = 0; //Counts each created tree; used to keep track of which image to select for next row.
        this.initTrees(this.numberOfTreeRows);
        this.moon = new Moon(this.horizonSpeed);
        this.opacity1 = 1; //First gradient 
        this.opacity2 = 0; //Second gradient
    }

    //Initializes forest background by creating a given number of trees.
    initTrees(number) {
        //Front rows:
        let distance = this.lastTreePosition / this.numberOfTreeRows * 2; //Distance to next tree row.
        let positionCurrent = this.lastTreePosition;
        for(let i = this.trees.length; i < number; i++) {
            let imageNumber = this.treeCounter % this.imageInitializer.numberTreeImages; //Select tree image based on available number of variations, then repeat.
            this.trees.push(new TreeRow(-5, positionCurrent, this.treeSpeed, imageNumber, false, this.imageInitializer.numberTreeImages)); //Push initial.
            this.treeCounter++;
            positionCurrent += distance;
        }
        //Transparent back row:
        //this.newTree();
    }

    //Adds a new tree row.
    newTree() {
        let imageNumber = this.treeCounter % this.imageInitializer.numberTreeImages;
        this.trees.unshift(new TreeRow(-5, this.lastTreePosition, this.treeSpeed, imageNumber, true, this.imageInitializer.numberTreeImages)); //Unshift additional.
        this.treeCounter++;
    }

    updateBackground(ctx) {
        if(this.moon !== undefined) { //Update moon while moon exists,
            this.moon.update(ctx);
            if(this.moon.moonDown()) { //when moon gone down,
                this.switchSky(); //delete moon, create sun
                this.sun.update();  //and update sun.
            }
        } else {
            this.sun.update(ctx); //When no moon, sun is moving -> update sun.
            if(this.sun.isUp()) {
                return true; //Returns true if sun is up -> picked up in Starfall, leads to game over.
            }
        }
        this.updateTrees(ctx); 
    }

    //Moves trees, deletes trees that are not visible anymore, creates new tree in the back row when first is gone.
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

    //Deletes moon, creates sun.
    switchSky() {
        this.moon = undefined;
        this.sun = new Sun(this.horizonSpeed * 1.1);
    }

    //Sets border fully visible.
    fullBorder() {
        document.getElementById("progress").style.marginTop = "-103vh";
    }

    //Sets border fully invisible.
    resetProgressBar() {
        document.getElementById("progress").style.marginTop = "-24vh";
    }

    //Show glowing border according to level progress (shows percentage of bar relative to points accumulated to complete the level).
    updateProgressBar() {
        let revealRange = 103 - 24; //See css comment (progressBox). 
        let revealPercent = this.points / this.pointsNeeded; //Current percent of points needed.
        this.baseProgressMargin = -24; //Margin value: Progress box hides bar.
        this.progressMargin = this.baseProgressMargin - revealPercent * revealRange; //New margin value
        document.getElementById("progress").style.marginTop = this.progressMargin + "vh"; //Reveal percent of glowing border as level progress indicator.
    }

    //Called at level up. Speeds up background movement just like player/drop items.
    updateBackgroundStats() {
        this.treeSpeed += 0.4;
        this.horizonSpeed *= 0.8;
    }

    //Draw sun/moon depending on which is up and tree rows.
    drawBackground(ctx) {
        this.drawHorizonGradient(ctx);
        if(this.moon !== undefined) {
            this.moon.draw(ctx);
        } else {
            this.sun.draw(ctx);
        }
        this.drawTrees(ctx);
    }

    //Draw sky. Constant dark blue while moon up, changing sunrise colors when sun is moving up.
    drawHorizonGradient(ctx) {
        let gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        let gradient2 = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);

        let blend;
        let blendFactor = 1 / 150 * this.horizonSpeed; //Adjust blend speed for each level.
        let interval = 0.6 / 3; //Interval for 4 gradient stops (3 bec. first is at 0.0)
        
        //Update color/position index.
        if(this.sun !== undefined && this.risingSunIndex < this.risingPositions.length) {
            this.updateSunHorizonIndex(); 
        }

        //Always same colors for moon and start sky.
        if(this.moon !== undefined || this.sunHorizonFirstIndex === 0) { 
            gradient.addColorStop(0.0, this.darkBlueHorizon[0]);
            gradient.addColorStop(interval, this.darkBlueHorizon[1]);
            gradient.addColorStop(interval * 2, this.darkBlueHorizon[2]);
            gradient.addColorStop(interval * 3, this.darkBlueHorizon[3]);

        //Sun sky changes with sun position.
        } else {
            let startIndex;
            let stops = 4; //Min stops

            if(this.risingSunIndex > 3) { 
                if(this.risingSunIndex > 7) stops = 7; //Max stops
                else stops = this.risingSunIndex; //Increase gradually
            }

            if(this.risingSunIndex < this.risingSunColors.length - 8) {
                startIndex = this.risingSunIndex; //Update start index
            } else {
                startIndex = this.risingSunColors.length - 8; //Get the last 8 colors.
                if(this.risingSunIndex > this.risingSunColors.length - 4) blend = true;
            }

            //Create gradient.
            let gradientStop = 0.0;
            let slicePercent = 0.7 / this.calculateNumberHorizonSlices(stops);
            let i = 0;
            while(gradientStop <= 0.7 - slicePercent && startIndex + i < this.risingSunColors.length) {
                if(this.stops === 4) gradientStop += interval;
                else gradientStop += i * slicePercent;
                gradient.addColorStop(gradientStop, this.risingSunColors[startIndex + i]); 
                i++;
            }
        }

        //Create blue sky and update opacity,
        //draw blending gradients.
        if(blend) {
            gradient2.addColorStop(0.0, this.finalBlueSky[0]);
            gradient2.addColorStop(0.1, this.finalBlueSky[1]);
            gradient2.addColorStop(0.3, this.finalBlueSky[2]);
            gradient2.addColorStop(0.5, this.finalBlueSky[3]);

            //Draw first gradient: Changing color horizon.
            ctx.save();
            ctx.globalAlpha = this.opacity1;
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();

            //Draw second gradient: Blue sky.
            ctx.save();
            ctx.globalAlpha = this.opacity2;
            ctx.fillStyle = gradient2;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.restore();
            console.log(this.opacity2);

            this.opacity1 -= blendFactor;
            this.opacity2 += blendFactor;  

            if(this.opacity2 >= 1) {
                blend = false;
                gradient = gradient2;
            }
        }

        //Simple gradient.
        if(!blend) {
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }        
    }

    //Used for proportional horizon slices, number of slices determined by number of stops.
    calculateNumberHorizonSlices(stops) {
        let sum = 1;
        for(let i = 2; i <= stops; i++) {
            sum += i;
        }
        return sum;
    }

    //Updates the starting color for horizon according to sun's position.
    updateSunHorizonIndex() {
        for(let i = 1; i < this.risingPositions.length - 1; i++) {
            if(this.sun.y > this.risingPositions[i]) {
                this.risingSunIndex = i - 1;
                return;
            }
        }
    }  

    //Calculate array of positions for determining when to change colors of the horizon.
    calcRisingPositons() {
        this.risingPositions = []
        let max = 120; //Per my decision: "Highest" point should be at 70 + buffer 50 for gradient
        let min = 500;
        let interval = (min - max) / this.risingSunColors.length - 1;
        let nextPosition = min - interval;
        while(nextPosition >= max) {
            this.risingPositions.push(nextPosition);
            nextPosition -= interval * 1;
        } 
    }

    //Draws trees.
    drawTrees(ctx) {
        for(let i = 0; i < this.trees.length; i++) {
            this.trees[i].draw(ctx);
        }
    }
}