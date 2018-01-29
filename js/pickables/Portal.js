import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Physics, Pickable, Solid } from '../Traits';
import { getRandomInt } from '../math';
import { defineGameObject } from '../defineGameObject';

const PORTAL = {
    skinName: 'default',
    
    imageURL: require('../../img/portals.png'),
    frames: [
        {
            name: 'portal-1',
            rect: [36 * 0, 0, 36, 72]
        },
        {
            name: 'portal-2',
            rect: [36 * 1, 0, 36, 72]
        },
        {
            name: 'portal-3',
            rect: [36 * 2, 0, 36, 72]
        },
        {
            name: 'portal-4',
            rect: [36 * 3, 0, 36, 72]
        },
        {
            name: 'portal-5',
            rect: [36 * 4, 0, 36, 72]
        },
        {
            name: 'portal-6',
            rect: [36 * 5, 0, 36, 72]
        }
    ],
    animations: [
        {
            name: 'portal',
            frameLen: 0.1,
            frames: [
                'portal-1',
                'portal-2',
                'portal-3',
                'portal-4',
                'portal-5',
                'portal-6'
            ]
        }
    ]
};

class BehaviorPortal extends Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.pickable.picked || !them.run) {
            return;
        }

        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;

        them.pos.x += getRandomInt(100, 1000);
        them.pos.y = 0;
    }
}

export const loadPortal = defineGameObject('portal', {
    specs: [PORTAL],
    size: [36, 72],
    offset: [0, 0],

    traits: () => [
        new Physics(),
        new Solid(),
        new Pickable(),
        new BehaviorPortal()
    ],
    animations: sprite => {
        const portalAnim = sprite.animations.get('portal');

        return portal => {
            return portalAnim(portal.lifetime);
        };
    }
});
