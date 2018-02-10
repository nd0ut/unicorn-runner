import { Entity, Trait } from '../Entity';
import { Physics, Pickable, Solid, Soundable } from '../Traits';
import { loadSpriteSheet, loadSounds } from '../loaders';
import { defineGameObject } from '../defineGameObject';

const RAINBOW_SPRITE = {
    imageURL: require('../../img/pickables/rainbow.png'),
    size: [83, 93],
    offset: [0, 0],
    skinName: 'default',

    frames: [
        {
            name: 'spark-1',
            rect: [0, 0, 83, 93]
        },
        {
            name: 'spark-2',
            rect: [83, 0, 83, 93]
        },
        {
            name: 'spark-3',
            rect: [166, 0, 83, 93]
        },
        {
            name: 'spark-4',
            rect: [249, 0, 83, 93]
        },
        {
            name: 'spark-5',
            rect: [332, 0, 83, 93]
        },
        {
            name: 'spark-6',
            rect: [415, 0, 83, 93]
        }
    ],
    animations: [
        {
            name: 'spark',
            frameLen: 0.2,
            frames: ['spark-1', 'spark-2', 'spark-3', 'spark-4', 'spark-5', 'spark-6']
        }
    ]
};

const RAINBOW_SOUNDS = {
    sounds: [
        {
            url: require('../../sounds/picked.wav'),
            name: 'picked'
        }
    ]
};

class BehaviorRainbow extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.pickable.picked || !them.picker ) {
            return;
        }

        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;
    }
}

export const loadRainbow = defineGameObject('rainbow', {
    spriteSpecs: [RAINBOW_SPRITE],
    soundSpecs: [RAINBOW_SOUNDS],

    traits: ({ sounds }) => [
        new Physics({ applyGravity: false }),
        new Solid(),
        new Pickable({ onPick: () => sounds.get('picked').playOnce() }),
        new BehaviorRainbow()
    ],

    animations: sprite => {
        const sparkAnim = sprite.animations.get('spark');

        return rainbow => {
            return sparkAnim(rainbow.lifetime);
        };
    }
});
