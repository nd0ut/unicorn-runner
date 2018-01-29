import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Killable, Physics, Solid } from '../Traits';
import { defineGameObject } from '../defineGameObject';

const ENEMY_BUG = {
    imageURL: require('../../img/cactus.png'),
    frames: [
        {
            name: 'idle-1',
            rect: [61 * 0, -8, 61, 73]
        },
        {
            name: 'idle-2',
            rect: [61 * 1 + 1, -8, 61, 73]
        },
        {
            name: 'idle-3',
            rect: [61 * 2 + 1, -8, 61, 73]
        },
        {
            name: 'idle-4',
            rect: [61 * 3 + 1, -8, 61, 73]
        },
        {
            name: 'idle-5',
            rect: [61 * 4 + 4, -7, 61, 73]
        },
        {
            name: 'idle-6',
            rect: [61 * 5 + 9, -7, 61, 73]
        },

        {
            name: 'attack-1',
            rect: [197, 215, 61, 73]
        },
        {
            name: 'attack-2',
            rect: [110, 215, 75, 73]
        },
        {
            name: 'attack-3',
            rect: [14, 215, 75, 73]
        },

        {
            name: 'death-1',
            rect: [197 + 63 * 0, 216, 63, 73]
        },
        {
            name: 'death-2',
            rect: [197 + 63 * 1, 216, 63, 73]
        },
        {
            name: 'death-3',
            rect: [197 + 63 * 2, 216, 63, 73]
        },
        {
            name: 'death-4',
            rect: [197 + 63 * 3, 216, 63, 73]
        },
        {
            name: 'death-5',
            rect: [197 + 63 * 4, 216, 63, 73]
        },
        {
            name: 'death-6',
            rect: [197 + 63 * 5, 216, 63, 73]
        },
    ],
    animations: [
        {
            name: 'idle',
            frameLen: 0.2,
            frames: [
                'idle-1',
                'idle-2',
                'idle-3',
                'idle-4',
                'idle-5',
                'idle-6',
            ]
        },
        {
            name: 'attack',
            frameLen: 0.1,
            frames: [
                'attack-1',
                'attack-2',
                'attack-3',
            ]
        },

        {
            name: 'death',
            frameLen: 0.1,
            frames: [
                'death-1',
                'death-2',
                'death-3',
                'death-4',
                'death-5',
                'death-6',                
            ]
        }
    ]
};

class BehaviorEnemyBug extends Trait {
    constructor() {
        super('behavior');

        this.attackDuration = 0.25;
        this.cancelAttackAfter = 2;
        this.inAttack = false;
        this.startAttackTime = 0;
        this.attackTime = 0;
    }

    update(entity, deltaTime, level) {
        if (entity.killable.dead) {
            entity.vel.x += 1000;
            return;
        }

        if (!this.inAttack || this.attackTime > this.attackDuration) {
            return;
        }

        this.attackTime = entity.lifetime - this.startAttackTime;
    }

    collides(us, them) {
        if (!them.killable || us.killable.dead) {
            return;
        }

        them.killable.kill();

        if (!this.inAttack) {
            this.inAttack = true;
            this.startAttackTime = us.lifetime;
            setTimeout(() => {
                this.inAttack = false;
                this.attackTime = 0;
                this.startAttackTime = 0;
            }, this.cancelAttackAfter * 1000);
        }
    }
}

export const loadEnemyBug = defineGameObject('enemyBug', {
    spriteSpecs: [ENEMY_BUG],
    size: [50, 51],
    offset: [5, 21],
    // drawBounds: true,

    afterCreate: entity => {
        entity.killable.removeAfter = 0.6;
    },

    traits: ({ ownerEntity }) => [
        new Physics(),
        new Solid(),
        new Killable(),
        new BehaviorEnemyBug()
    ],
    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');
        const attackAnim = sprite.animations.get('attack');
        const deathAnim = sprite.animations.get('death');

        return (enemyBug) => {
            if (enemyBug.behavior.inAttack) {
                return attackAnim(enemyBug.behavior.attackTime);
            }

            if (enemyBug.killable.dead) {
                return deathAnim(enemyBug.killable.deadTime);
            }

            return idleAnim(enemyBug.lifetime);
        };
    }
});