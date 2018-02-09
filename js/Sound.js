export class Sound {
    constructor(soundManager, sound) {
        this.soundManager = soundManager;

        this.name = sound.name;
        this.buffer = sound.buffer;

        this.isPlaying = false;
        this.timeoutId = undefined;
        this.source = undefined;
        this.gainNode = undefined;
    }

    playOnce() {
        const { gainNode, source } = this.soundManager.play(this);
        this.gainNode = gainNode;
        this.source = source;
        this.isPlaying = true;
    }

    playLoop() {
        const { gainNode, source } = this.soundManager.play(this, { loop: true });
        this.gainNode = gainNode;
        this.source = source;
        this.isPlaying = true;
    }

    startPlaying(options) {
        const { gainNode, source } = this.soundManager.play(this, options);
        this.gainNode = gainNode;
        this.source = source;
        this.isPlaying = true;
    }

    stop() {
        this.source.stop();
        this.isPlaying = false;
    }

    playing({ rate = 1, volume = 1 } = {}) {
        if (!this.isPlaying) {
            this.startPlaying({ loop: true, rate, volume });
        }

        this.source.playbackRate.value = rate;
        this.gainNode.gain.value = volume;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(this.stop.bind(this), 100);
    }
}
