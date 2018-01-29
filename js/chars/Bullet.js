import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Killable, Physics, Solid } from '../Traits';

const BULLET = {
    imageURL: require('../../img/fireball.png'),
    frames: [
        {
            name: 'idle-1',
            rect: [0, 1261, 90, 90]
        },
        {
            name: 'idle-2',
            rect: [61 * 1 + 1, 0, 61, 65]
        }
    ],
    animations: [
        {
            name: 'idle',
            frameLen: 0.2,
            frames: [
                'idle-1',
                // 'idle-2'
            ]
        }
    ]
};

export function loadBullet() {
    return loadSpriteSheet(BULLET)
        .then(createBulletFactory);
}


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
        })
    }

    update(entity, deltaTime, level) {
        if(this.destroyed) {
            this.queue(() => {
                level.entities.delete(entity);
            })
        }
    }

    obstruct() {
        this.destroy();        
    }

    collides(us, them) {
        if (!them.killable || them === this.ownerEntity) {
            return;
        }

        them.killable.kill();

        this.destroy();
    }
}


function createBulletFactory(sprite) {
    const idleAnim = sprite.animations.get('idle');

    function routeAnim(bullet) {
        return idleAnim(bullet.lifetime);
    }

    function drawBullet(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    }

    return function createBullet(ownerEntity) {
        const bullet = new Entity('bullet');
        bullet.size.set(50, 25);
        bullet.offset.y = 50;

        bullet.addTrait(new Physics({applyGravity: false}));
        bullet.addTrait(new Solid());
        bullet.addTrait(new BehaviorBullet(ownerEntity));

        bullet.draw = drawBullet;

        return bullet;
    };
}
