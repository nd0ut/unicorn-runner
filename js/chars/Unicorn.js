import { defineGameObject } from '../defineGameObject';
import { Entity } from '../Entity';
import { Jump, Killable, Physics, Picker, Run, Solid, Striker } from '../Traits';

const UNICORN_SPRITE = {
    imageURL: require('../../img/unicorn.png'),
    skinName: 'default',
    size: [90, 100],
    offset: [45, 40],
    frames: [
        {
            name: 'idle',
            rect: [172 * 23, 0, 172, 142]
        },
        {
            name: 'run-1',
            rect: [172 * 24, 0, 172, 142]
        },
        {
            name: 'run-2',
            rect: [172 * 25, 0, 172, 142]
        },
        {
            name: 'run-3',
            rect: [172 * 26, 0, 172, 142]
        },
        {
            name: 'run-4',
            rect: [172 * 27, 0, 172, 142]
        },
        {
            name: 'run-5',
            rect: [172 * 28, 0, 172, 142]
        },
        {
            name: 'run-6',
            rect: [172 * 29, 0, 172, 142]
        },
        {
            name: 'run-7',
            rect: [172 * 30, 0, 172, 142]
        },
        {
            name: 'run-8',
            rect: [172 * 31, 0, 172, 142]
        },
        {
            name: 'break',
            rect: [172 * 23, 0, 172, 142]
        },
        {
            name: 'jump-1',
            rect: [172 * 19, 0, 172, 142]
        },
        {
            name: 'jump-2',
            rect: [172 * 20, 0, 172, 142]
        },
        {
            name: 'jump-3',
            rect: [172 * 21, 0, 172, 142]
        },
        {
            name: 'jump-4',
            rect: [172 * 22, 0, 172, 142]
        },
        {
            name: 'fall-1',
            rect: [172 * 25, 0, 172, 142]
        },
        {
            name: 'fall-2',
            rect: [172 * 26, 0, 172, 142]
        },
        {
            name: 'death-1',
            rect: [172 * 8, 0, 172, 142]
        },
        {
            name: 'death-2',
            rect: [172 * 9, 0, 172, 142]
        },
        {
            name: 'death-3',
            rect: [172 * 10, 0, 172, 142]
        },
        {
            name: 'death-4',
            rect: [172 * 11, 0, 172, 142]
        },
        {
            name: 'death-5',
            rect: [172 * 12, 0, 172, 142]
        },
        {
            name: 'death-6',
            rect: [172 * 13, 0, 172, 142]
        },
        {
            name: 'death-7',
            rect: [172 * 8, 0, 172, 142]
        },
        {
            name: 'death-8',
            rect: [172 * 8, 0, 172, 142]
        },
        {
            name: 'death-9',
            rect: [172 * 8, 0, 172, 142]
        },

        {
            name: 'cast-1',
            rect: [172 * 0, 0, 172, 142]
        },
        {
            name: 'cast-2',
            rect: [172 * 1, 0, 172, 142]
        },
        {
            name: 'cast-3',
            rect: [172 * 2, 0, 172, 142]
        },
        {
            name: 'cast-4',
            rect: [172 * 3, 0, 172, 142]
        },
        {
            name: 'cast-5',
            rect: [172 * 4, 0, 172, 142]
        },
        {
            name: 'cast-6',
            rect: [172 * 5, 0, 172, 142]
        }
    ],

    animations: [
        {
            name: 'run',
            frameLen: 20,
            frames: [
                'run-1',
                'run-2',
                'run-3',
                'run-4',
                'run-5',
                'run-6',
                'run-7',
                'run-8'
            ]
        },
        {
            name: 'jump',
            frameLen: 0.2,
            frames: ['jump-1', 'jump-2', 'jump-3', 'jump-4']
        },
        {
            name: 'fall',
            frameLen: 0.2,
            frames: ['fall-1', 'fall-2']
        },
        {
            name: 'cast',
            frameLen: 0.1,
            frames: [
                // 'cast-1',
                // 'cast-2',
                // 'cast-3',
                'cast-4'
                // 'cast-5',
                // 'cast-6',
            ]
        },
        {
            name: 'death',
            frameLen: 0.2,
            frames: [
                'death-1',
                'death-2',
                'death-3',
                'death-4',
                'death-5',
                'death-6',
                'death-7',
                'death-8',
                'death-9'
            ]
        }
    ]
};

const UNICORN_SOUNDS = {
    sounds: [
        {
            url: require('../../sounds/clip-clop.wav'),
            name: 'clip-clop',
            loop: true
        },
        {
            url: require('../../sounds/horse-die.wav'),
            name: 'die'
        },
        {
            url: require('../../sounds/jump.wav'),
            name: 'jump'
        },
        {
            url: require('../../sounds/land.wav'),
            name: 'land'
        }
    ]
};

function animations(sprite) {
    const runAnim = sprite.animations.get('run');
    const jumpAnim = sprite.animations.get('jump');
    const fallAnim = sprite.animations.get('fall');
    const deathAnim = sprite.animations.get('death');
    const castAnim = sprite.animations.get('cast');

    return unicorn => {
        if (unicorn.killable.dead) {
            return deathAnim(unicorn.killable.deadTime);
        }

        if (unicorn.striker.isStriking()) {
            // return castAnim(unicorn.striker.strikeTime);
            return castAnim(unicorn.lifetime);
        }

        if (unicorn.jump.jumpingUp) {
            return jumpAnim(unicorn.jump.engageTime);
        }

        if (unicorn.run.lastSpeed < 1000) {
            return 'idle';
        }

        if (unicorn.jump.fallingDown) {
            return fallAnim(unicorn.jump.engageTime);
        }

        if (unicorn.run.distance > 0) {
            return runAnim(unicorn.run.distance);
        }

        return 'idle';
    };
}

function sounds(sounds) {
    const runSound = sounds.get('clip-clop');
    const dieSound = sounds.get('die');

    return unicorn => {
        if (unicorn.killable.dead) {
            dieSound.playing();
            return;
        }

        if (unicorn.jump.jumpingUp) {
            return;
        }

        if (unicorn.jump.fallingDown) {
            return;
        }

        if (unicorn.run.distance > 0) {
            runSound.playing({ rate: unicorn.run.realSpeed / 10000, volume: 0.05 });
            return;
        }
    };
}

export const loadUnicorn = defineGameObject('unicorn', {
    spriteSpecs: [UNICORN_SPRITE],
    soundSpecs: [UNICORN_SOUNDS],

    // drawBounds: true,

    afterCreate: entity => {
        entity.killable.removeAfter = 1;
    },

    traits: () => [
        new Physics(),
        new Solid(),
        new Run({speed: 15000}),
        new Jump(),
        new Picker(),
        new Killable(),
        new Striker()
    ],
    animations,
    sounds
});
