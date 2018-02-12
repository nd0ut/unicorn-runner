import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Physics, Pickable, Solid } from '../Traits';
import { defineGameObject } from '../defineGameObject';

const SPEED_BOOSTER = {
    imageURL: require('../../img/pickables/horseshoe.png'),
    size: [45, 49],
    offset: [0, 0],
    skinName: 'default',

    frames: [
        {
            name: 'horseshoe-1',
            rect: [0, 0, 36, 49]
        },
        {
            name: 'horseshoe-2',
            rect: [37, 0, 38, 49]
        },
        {
            name: 'horseshoe-3',
            rect: [76, 0, 35, 49]
        },
        {
            name: 'horseshoe-4',
            rect: [112, 0, 37, 49]
        },
        {
            name: 'horseshoe-5',
            rect: [150, 0, 42, 49]
        },
        {
            name: 'horseshoe-6',
            rect: [193, 0, 43, 49]
        },
        {
            name: 'horseshoe-7',
            rect: [237, 0, 44, 49]
        },
        {
            name: 'horseshoe-8',
            rect: [282, 0, 45, 49]
        },
        {
            name: 'horseshoe-9',
            rect: [328, 0, 35, 49]
        },
        {
            name: 'horseshoe-10',
            rect: [368, 0, 40, 49]
        },
        {
            name: 'horseshoe-11',
            rect: [409, 0, 41, 49]
        },
        {
            name: 'horseshoe-12',
            rect: [451, 0, 45, 49]
        }
    ],
    animations: [
        {
            name: 'horseshoe',
            frameLen: 0.1,
            frames: [
                'horseshoe-1',
                'horseshoe-2',
                'horseshoe-3',
                'horseshoe-4',
                'horseshoe-5',
                'horseshoe-6',
                'horseshoe-7',
                'horseshoe-8',
                'horseshoe-9',
                'horseshoe-10',
                'horseshoe-11',
                'horseshoe-12'
            ]
        }
    ]
};

class BehaviorSpeedBooster extends Trait {
    constructor() {
        super('behavior');

        this.boost = 5000;
        this.boostTime = 5000;
    }

    restoreSpeed(them) {
        if (them.jump.jumpingUp || them.jump.fallingDown) {
            them.run.queue(() => this.restoreSpeed(them));
        } else {
            them.run.speed -= this.boost;
        }
    }

    collides(us, them) {
        if (us.pickable.picked || !them.picker) {
            return;
        }
        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;

        them.run.speed += this.boost;

        setTimeout(() => this.restoreSpeed.call(this, them), this.boostTime);
    }
}

export const loadSpeedBooster = defineGameObject('speedBooster', {
    spriteSpecs: [SPEED_BOOSTER],
    soundSpecs: [],

    traits: ({ sounds }) => [
        new Physics({ applyGravity: false }),
        new Solid(),
        new Pickable(),
        new BehaviorSpeedBooster()
    ],

    animations: sprite => {
        const boosterAnim = sprite.animations.get('horseshoe');

        return speedbooster => {
            return boosterAnim(speedbooster.lifetime);
        };
    }
});
