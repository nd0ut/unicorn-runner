import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Physics, Pickable, Solid } from '../Traits';
import { defineGameObject } from '../defineGameObject';

const MANA_POT = {
    imageURL: require('../../img/mana-potions.png'),
    frames: [
        {
            name: 'idle-1',
            rect: [0, 300, 95, 60]
        },
        {
            name: 'idle-2',
            rect: [95 * 1, 300, 95, 60]
        },
        {
            name: 'idle-3',
            rect: [95 * 2, 300, 95, 60]
        },
        {
            name: 'idle-4',
            rect: [95 * 3, 300, 95, 60]
        },
        {
            name: 'idle-5',
            rect: [95 * 4, 300, 95, 60]
        },

        {
            name: 'idle-6',
            rect: [0, 400, 95, 60]
        },
        {
            name: 'idle-7',
            rect: [95 * 1, 400, 95, 60]
        },
        {
            name: 'idle-8',
            rect: [95 * 2, 400, 95, 60]
        },
        {
            name: 'idle-9',
            rect: [95 * 3, 400, 95, 60]
        },
        {
            name: 'idle-10',
            rect: [95 * 4, 400, 95, 60]
        },

        {
            name: 'idle-11',
            rect: [0, 500, 95, 60]
        },
        {
            name: 'idle-12',
            rect: [95 * 1, 500, 95, 60]
        },
        {
            name: 'idle-13',
            rect: [95 * 2, 500, 95, 60]
        },
        {
            name: 'idle-14',
            rect: [95 * 3, 500, 95, 60]
        },
        {
            name: 'idle-15',
            rect: [95 * 4, 500, 95, 60]
        },
    ],
    animations: [
        {
            name: 'idle',
            frameLen: 0.1,
            frames: [
                'idle-1',
                'idle-2',
                'idle-3',
                'idle-4',
                'idle-5',
                'idle-6',
                'idle-7',
                'idle-8',
                'idle-9',
                'idle-10',
                'idle-11',
                'idle-12',
                'idle-13',
                'idle-14',
                'idle-15',
            ]
        }
    ]
};

class Behavior extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.pickable.picked || !them.picker) {
            return;
        }
        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;
    }
}

export const loadManaPot = defineGameObject('manaPot', {
    spriteSpecs: [MANA_POT],
    soundSpecs: [],

    size: [70, 70],
    offset: [15, 0],
    // drawBounds: true,

    traits: () => [
        new Physics(),
        new Solid(),
        new Pickable(),
        new Behavior()
    ],

    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');
        
        return entity => {
            return idleAnim(entity.lifetime);
        };
    }
});