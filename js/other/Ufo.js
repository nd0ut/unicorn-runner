import { defineGameObject } from '../defineGameObject';
import { Trait } from '../Entity';
import { Physics, Solid } from '../Traits';

const UFO_SPRITE = {
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
            frames: [
                'idle',
            ]
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

    update(entity, deltaTime) {
        if(!this.spawned) {
            this.entity.pos.x = this.napEntity.pos.x - 1000;
            this.entity.pos.y = this.napEntity.pos.y + this.napEntity.size.y / 2 - entity.size.y;    
            this.spawned = true;
        }

        if(Math.abs(entity.pos.x - this.napEntity.pos.x) < 50) {
            this.catched = true;
        }

        if(this.catched) {
            entity.vel.y -= 10;
            this.napEntity.vel.y -= 40;

            this.napEntity.vel.x = 1000
            entity.vel.x = 1000;
        } else {
            entity.vel.x += 50;            
        }
    }
}

export const loadUfo = defineGameObject('ufo', {
    spriteSpecs: [UFO_SPRITE],
    size: [240, 350],
    offset: [0, 0],
    // drawBounds: true,

    traits: ({ napEntity }) => [
        new Physics({applyGravity: false}),
        new BehaviorUfo(napEntity)
    ],
    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');

        return (entity) => {
            return idleAnim(entity.lifetime);
        };
    }
});
