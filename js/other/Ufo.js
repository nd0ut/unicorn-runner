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
        this.catchTime = 0;

        this.spawned = false;
    }

    spawn() {
        this.entity.pos.x = this.napEntity.pos.x - 1500;
        this.spawned = true;
    }

    catch(deltaTime) {
        this.catched = true;
        this.catchTime = deltaTime;
        
        this.napEntity.removeTrait('solid');
        this.napEntity.removeTrait('physics');
    }

    canCatch() {
        const ufoCenter = this.entity.bounds.left + this.entity.bounds.width / 2;
        const napCenter = this.napEntity.bounds.left + this.napEntity.bounds.width / 2;
        const canCatch = ufoCenter - napCenter > 0;
        return canCatch;
    }

    abduct() {
        const ufoCenterX = this.entity.bounds.left + this.entity.bounds.width / 2;

        this.entity.vel.y -= 50;
        
        if(this.entity.vel.x > 100) {
            this.entity.vel.x -= 100;
        }

        this.napEntity.pos.x = ufoCenterX - this.napEntity.bounds.width / 2;
        this.napEntity.pos.y = this.entity.bounds.bottom - this.napEntity.bounds.height;
    }

    alignTarget() {
        this.entity.vel.x += 100;
        this.entity.bounds.bottom =
            this.napEntity.bounds.top + this.napEntity.bounds.height / 2;
    }

    update(entity, deltaTime, level) {
        if (!this.spawned && !level.frozen) {
            this.spawn();
        }

        if (!this.catched) {
            this.alignTarget();

            this.canCatch() && this.catch(deltaTime);
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

        return entity => {
            return idleAnim(entity.lifetime);
        };
    }
});
