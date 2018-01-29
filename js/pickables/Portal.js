import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Physics, Pickable, Solid } from '../Traits';
import { getRandomInt } from '../math';

const PORTAL = {
    imageURL: require('../../img/portals.png'),
    frames: [
        {
            name: 'portal-1',
            rect: [36*0, 0, 36, 72]
        },
        {
            name: 'portal-2',
            rect: [36*1, 0, 36, 72]
        },
        {
            name: 'portal-3',
            rect: [36*2, 0, 36, 72]
        },
        {
            name: 'portal-4',
            rect: [36*3, 0, 36, 72]
        },
        {
            name: 'portal-5',
            rect: [36*4, 0, 36, 72]
        },
        {
            name: 'portal-6',
            rect: [36*5, 0, 36, 72]
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

export function loadPortal() {
    return loadSpriteSheet(PORTAL).then(createPortalFactory);
}

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

        them.pos.x += getRandomInt(-1000, 1000);
        them.pos.y = 0;
    }
}

function createPortalFactory(sprite) {
    const portalAnim = sprite.animations.get('portal');

    function routeAnim(portal) {
        return portalAnim(portal.lifetime);
    }

    function drawPortal(context) {
        sprite.draw(routeAnim(this), context, 0, 0, this.vel.x < 0);
    }

    return function createPortal() {
        const portal = new Entity('portal');
        portal.size.set(36, 72);

        portal.addTrait(new Physics());
        portal.addTrait(new Solid());
        portal.addTrait(new Pickable());
        portal.addTrait(new BehaviorPortal());

        portal.draw = drawPortal;

        return portal;
    };
}
