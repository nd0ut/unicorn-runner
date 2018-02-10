import { defineGameObject } from '../defineGameObject';
import { Trait } from '../Entity';
import { Physics, Solid } from '../Traits';

const FIREBALL_SPRITE = {
    skinName: 'default',
    imageURL: require('../../img/weapon/fireball.png'),
    size: [55, 25],
    offset: [0, 35],

    frames: [
        {
            name: 'idle-1',
            rect: [0, 1182, 97, 97]
        },
        {
            name: 'idle-2',
            rect: [97 * 1 + 1, 1182, 97, 97]
        },
        {
            name: 'idle-3',
            rect: [97 * 2 + 1, 1182, 97, 97]
        },
        {
            name: 'idle-4',
            rect: [97 * 3 + 1, 1182, 97, 97]
        },
        {
            name: 'idle-5',
            rect: [97 * 4 + 1, 1182, 97, 97]
        },
        {
            name: 'idle-6',
            rect: [97 * 5 + 1, 1182, 97, 97]
        },
        {
            name: 'idle-7',
            rect: [97 * 6 + 1, 1182, 97, 97]
        }
    ],
    animations: [
        {
            name: 'idle',
            frameLen: 0.1,
            frames: [
                // 'idle-1',
                // 'idle-2',
                // 'idle-3',
                'idle-4',
                'idle-5',
                'idle-6',
                'idle-7'
            ]
        }
    ]
};

class BehaviorBullet extends Trait {
    constructor(ownerEntity) {
        super('bulletBehavior');

        this.ownerEntity = ownerEntity;
        this.destroyed = false;
        this.removeAfter = 0.3;
    }

    destroy() {
        this.queue(() => {
            this.destroyed = true;
        });
    }

    update(entity, deltaTime, level) {
        if (this.destroyed) {
            this.queue(() => {
                level.entities.delete(entity);
            });
        }
    }

    obstruct() {
        this.destroy();
    }

    collides(us, them) {
        if (!them.killable || them.killable.dead || them === this.ownerEntity) {
            return;
        }

        them.killable.kill();
    }
}

export const loadBullet = defineGameObject('bullet', {
    spriteSpecs: [FIREBALL_SPRITE],
    // drawBounds: true,

    traits: ({ ownerEntity }) => [
        new Physics({ applyGravity: false }),
        new Solid(),
        new BehaviorBullet(ownerEntity)
    ],
    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');

        return portal => {
            return idleAnim(portal.lifetime);
        };
    }
});
