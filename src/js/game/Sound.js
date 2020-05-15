export class Sound { //Class for basic sound methods.

    constructor(audioPath) {
        this.sound = new Audio(audioPath);
    }

    //Play from the start, stop any previous sound, so there is no overlapping -> catching AllStar.
    play() {
        this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
    }

    //Play in a loop -> music.
    playContinuous() {
        this.sound.loop = true;
        this.sound.play();
    }

    //Stop playing, reset starting point.
    stop() {
        this.sound.pause();
        this.sound.currentTime = 0;
    }

    pause() {
        this.sound.pause();
    }
}