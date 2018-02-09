import { Sound } from './Sound';

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
        const buffers = await Promise.all(
            sounds.map(sound => this.loadBuffer(sound.url))
        );
        const soundsMap = new Map();

        sounds.forEach((sound, idx) => {
            sound.buffer = buffers[idx];
            soundsMap.set(sound.name, new Sound(this, sound));
        });

        return soundsMap;
    }

    play(sound, { volume = 1, loop = false, rate = 1 } = {}) {
        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = sound.buffer;
        source.loop = loop !== undefined ? loop : false;
        source.playbackRate.value = rate !== undefined ? rate : 1;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        source.start(0);

        return { source, gainNode };
    }
}

export const SoundManager = new SingleSoundManager();
