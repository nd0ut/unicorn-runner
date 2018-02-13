import { Sound } from './Sound';

class SingleSoundContext {
    constructor() {
        this.context = new AudioContext();
    }

    loadBuffer(url) {
        return fetch(url)
            .then(resp => resp.arrayBuffer())
            .then(buf => this.context.decodeAudioData(buf));
    }

    async loadSounds(sounds) {
        const soundsMap = new Map();

        const buffers = await Promise.all(
            sounds.map(sound => this.loadBuffer(sound.url))
        );

        sounds.forEach((sound, idx) => {
            const buf = buffers[idx];
            soundsMap.set(sound.name, new Sound(sound.name, buf, this.createSource.bind(this)));
        });

        return soundsMap;
    }

    createSource(buf, { volume = 1, loop = false, rate = 1 } = {}) {
        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = buf;
        source.loop = loop !== undefined ? loop : false;
        source.playbackRate.value = rate !== undefined ? rate : 1;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        return { source, gainNode };
    }
}

export const SoundContext = new SingleSoundContext();
