export class Sound {
    constructor(soundManager, sound) {
        this.soundManager = soundManager;

        this.name = sound.name;
        this.buffer = sound.buffer;

        this.isPlaying = false;
        this.timeoutId = null;
        this.source = null;
    }

    playOnce() {
        this.soundManager.play(this);
    }

    startPlaying() {
        this.source = this.soundManager.play(this, { loop: true })
        this.isPlaying = true;
    }

    stopPlaying() {
        this.source.stop();
        this.isPlaying = false;
    }

    playing(rate = 1) {
        if(!this.isPlaying) {
            this.startPlaying();
        }

        this.source.playbackRate.value = rate;

        if(this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(this.stopPlaying.bind(this), 100);
    }
}
