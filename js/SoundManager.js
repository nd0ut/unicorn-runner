import { Sound } from "./Sound";

class SingleSoundManager {
    constructor() {
        this.context = new AudioContext();
    }

    loadBuffer(url) {
        return fetch(url)
            .then(resp => resp.arrayBuffer())
            .then(buf => this.context.decodeAudioData(buf));
    }

    async loadSounds(sounds) {
        const buffers = await Promise.all(sounds.map(sound => this.loadBuffer(sound.url)));
        const soundsMap = new Map();

        sounds.forEach((sound, idx) => {
            sound.buffer = buffers[idx]
            soundsMap.set(sound.name, new Sound(this, sound));
        });

        return soundsMap;
    }

    play(sound, options = {}) {
        const source = this.context.createBufferSource();
        source.buffer = sound.buffer;
        source.connect(this.context.destination);
        source.loop = options.loop !== undefined ? options.loop : false;
        source.playbackRate.value = options.rate !== undefined ? options.rate : 1;

        source.start(0);

        return source;
    }
}

export const SoundManager = new SingleSoundManager();
