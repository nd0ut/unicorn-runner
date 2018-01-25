import { SoundManager } from './SoundManager';

export class Sound {
    constructor() {
        this.samples = new Map();
    }

    defineSample(sample) {
        this.samples.set(sample.name, sample);
    }

    playFrame(frame) {
        for (const [,sample] of this.samples) {
            if (frame.has(sample.name)) {
                const play = frame.get(sample.name);
                play();
            } else if(sample.forceStop) {
                SoundManager.stop(sample.buffer);
            }
        }
    }

    play(name, rate = 1) {
        const sample = this.samples.get(name);
        return {
            name,
            play: () =>
                SoundManager.play(sample.buffer, {
                    time: sample.delay || 0,
                    loop: sample.loop,
                    forceStop: sample.forceStop,
                    rate
                })
        };
    }
}
