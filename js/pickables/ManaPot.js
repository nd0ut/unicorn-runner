import { defineGameObject } from '../defineGameObject';
import { Trait } from '../Entity';
import { Physics, Pickable, Solid } from '../Traits';
import { MANA_BUBBLES_SPRITE } from './ManaPot.bubbles';
import { MANA_PYLON_SPRITE } from './ManaPot.pylon';

const SOUNDS = {
    sounds: [
        {
            url: require('../../sounds/picked.wav'),
            name: 'picked'
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
    spriteSpecs: [MANA_BUBBLES_SPRITE, MANA_PYLON_SPRITE],
    soundSpecs: [SOUNDS],

    size: [70, 70],
    offset: [15, 0],
    // drawBounds: true,

    traits: ({sounds}) => [
        new Physics(),
        new Solid(),
        new Pickable({ onPick: () => sounds.get('picked').playOnce() }),
        new Behavior()
    ],

    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');

        return entity => {
            return idleAnim(entity.lifetime);
        };
    }
});