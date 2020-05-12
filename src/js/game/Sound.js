export class Sound {

    constructor(audioPath) {
        this.sound = new Audio("src/sounds/star.mp3");
    }

    play() {
        this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
    }

    stop() {
        this.sound.pause();
        this.sound.currentTime = 0;
    }

    pause() {
        this.sound.pause();
    }
}