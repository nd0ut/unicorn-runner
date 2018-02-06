import { SoundManager, BufferLoader } from './SoundManager';
import { SpriteSheet } from './SpriteSheet';
import { Sound } from './Sound';

export function createAnim(frames, frameLen) {
    return function resolveFrame(distance) {
        const frameIndex = Math.floor(distance / frameLen) % frames.length;
        const frameName = frames[frameIndex];
        return frameName;
    };
}

export function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

export function loadImages(urlMap) {
    const names = Object.keys(urlMap);
    const urls = Object.values(urlMap);

    return Promise.all(urls.map(url => loadImage(url))).then(images =>
        images.reduce((result, image, idx) => {
            result[names[idx]] = image;
            return result;
        }, {})
    );
}

export function loadSpriteSheet(sheetSpec) {
    return Promise.resolve(sheetSpec)
        .then(sheetSpec =>
            Promise.all([sheetSpec, loadImage(sheetSpec.imageURL)])
        )
        .then(([sheetSpec, image]) => {
            const sprites = new SpriteSheet(
                sheetSpec.skinName,
                image,
                sheetSpec.tileW,
                sheetSpec.tileH
            );

            if (sheetSpec.frames) {
                sheetSpec.frames.forEach(frameSpec => {
                    sprites.define(frameSpec.name, ...frameSpec.rect);
                });
            }

            if (sheetSpec.animations) {
                sheetSpec.animations.forEach(animSpec => {
                    const animation = createAnim(
                        animSpec.frames,
                        animSpec.frameLen
                    );
                    sprites.defineAnim(animSpec.name, animation);
                });
            }

            return sprites;
        });
}

export function loadSounds(soundSpec) {
    return Promise.resolve(soundSpec)
        .then(soundSpec =>
            Promise.all([soundSpec, SoundManager.loadSounds(soundSpec.sounds)])
        )
        .then(([soundSpec, sounds]) => {
            return Object.assign(sounds, {
                skinName: soundSpec.skinName || 'default'
            })
        });
}
