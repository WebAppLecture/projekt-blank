export class Sound { //Class for basic sound methods.

    constructor(audioPath) {
        this.sound = new Audio(audioPath);
        this.isOn = false;
    }

    //Play from the start, stop any previous sound, so there is no overlapping -> catching AllStar.
    play() {
        this.sound.pause();
        this.sound.currentTime = 0;
        this.sound.play();
    }

    //Play in a loop -> music.
    playMusic() {
        this.sound.loop = true;
        this.sound.play();
        this.isOn = true;
    }

    //Stop playing, reset starting point.
    stop() {
        this.pause();
        this.sound.currentTime = 0;
    }

    pause() {
        this.sound.pause();
        this.isOn = false;
    }

    continue() {
        this.sound.play();
        this.isOn = true;
    }

    finishPlaying() {
        if(this.sound.currentTime == 0) this.stop();
        return true;
    }
}