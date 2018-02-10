import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Physics, Pickable, Solid } from '../Traits';
import { rand, Vec2 } from '../math';
import { defineGameObject } from '../defineGameObject';

const PORTAL = {
    skinName: 'default',
    size: [36, 72],
    offset: [0, 0],

    imageURL: require('../../img/pickables/portal.png'),
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
    constructor({ destintaion }) {
        super('behavior');
        this.destintaion = destintaion;
    }

    collides(us, them) {
        if (us.pickable.picked || !them.picker) {
            return;
        }

        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;

        const dest = this.destintaion || new Vec2(this.pos.x + rand.int(100, 1000), -100);
        them.pos.set(dest.x, dest.y);
    }
}

export const loadPortal = defineGameObject('portal', {
    spriteSpecs: [PORTAL],

    traits: ({ destintaion }) => [
        new Physics({ applyGravity: false }),
        new Solid(),
        new Pickable(),
        new BehaviorPortal({ destintaion })
    ],
    animations: sprite => {
        const portalAnim = sprite.animations.get('portal');

        return portal => {
            return portalAnim(portal.lifetime);
        };
    }
});
