import { defineGameObject } from '../defineGameObject';
import { Trait } from '../Entity';
import { Physics, Solid } from '../Traits';

const UFO_SPRITE = {
    size: [240, 350],
    offset: [0, 0],
    skinName: 'default',

    imageURL: require('../../img/ufo.png'),
    frames: [
        {
            name: 'idle',
            rect: [0, 0, 240, 350]
        }
    ],
    animations: [
        {
            name: 'idle',
            frameLen: 0.1,
            frames: ['idle']
        }
    ]
};

class BehaviorUfo extends Trait {
    constructor(napEntity) {
        super('ufoBehavior');
        this.napEntity = napEntity;

        this.catched = false;
        this.spawned = false;
    }

    spawn() {
        this.entity.pos.x = this.napEntity.pos.x - 2000;
        this.spawned = true;
    }

    catch() {
        this.catched = true;

        this.napEntity.removeTrait('solid');
        this.napEntity.removeTrait('physics');
    }

    canCatch() {
        const ufoCenter = this.entity.pos.x + this.entity.size.x / 2;
        const napCenter = this.napEntity.pos.x + this.napEntity.size.x / 2;
        const canCatch = Math.abs(ufoCenter - napCenter) < 100;

        return canCatch;
    }

    abduct() {
        this.entity.vel.y -= 50;
        this.entity.vel.x = 300;

        this.napEntity.pos.y = this.entity.pos.y + this.entity.size.y - this.napEntity.size.y;
        this.napEntity.pos.x = this.entity.pos.x + this.entity.size.x / 6;
    }

    alignTarget() {
        this.entity.vel.x += 50;
        this.entity.pos.y = this.napEntity.pos.y + this.napEntity.size.y / 2 - this.entity.size.y;
    }

    update(entity, deltaTime, level) {
        if (!this.spawned && !level.frozen) {
            this.spawn();
        }

        if(!this.catched) {
            this.alignTarget();

            this.canCatch() && this.catch();
        }

        if (this.catched) {
            this.abduct();
        }
    }
}

export const loadUfo = defineGameObject('ufo', {
    spriteSpecs: [UFO_SPRITE],
    // drawBounds: true,

    traits: ({ napEntity }) => [
        new Physics({ applyGravity: false }),
        new BehaviorUfo(napEntity)
    ],
    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');

        return (entity) => {
            return idleAnim(entity.lifetime);
        };
    }
});
