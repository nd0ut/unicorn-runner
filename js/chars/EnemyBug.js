import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Killable, Physics, Solid } from '../Traits';

const ENEMY_BUG = {
    imageURL: require('../../img/cactus.png'),
    frames: [
        {
            name: 'idle-1',
            rect: [61*0, 0, 61, 65]
        },
        {
            name: 'idle-2',
            rect: [61*1+1, 0, 61, 65]
        },
        {
            name: 'idle-3',
            rect: [61*2+1, 0, 61, 65]
        },
        {
            name: 'idle-4',
            rect: [61*3+1, 0, 61, 65]
        },
        {
            name: 'idle-5',
            rect: [61*4+4, 1, 61, 65]
        },
        {
            name: 'idle-6',
            rect: [61*5+9, 1, 61, 65]
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
        }
    ]
};

export function loadEnemyBug() {
    return loadSpriteSheet(ENEMY_BUG)
    .then(createEnemyBugFactory);
}


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
        if(!this.inAttack || this.attackTime > this.attackDuration) {
            return;
        }

        this.attackTime = entity.lifetime - this.startAttackTime;
    }

    collides(us, them) {
        if (us.killable.dead) {
            return;
        }

        them.killable.kill();

        if(!this.inAttack) {
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


function createEnemyBugFactory(sprite) {
    const idleAnim = sprite.animations.get('idle');
    const attackAnim = sprite.animations.get('attack');

    function routeAnim(enemyBug) {
        if (enemyBug.behavior.inAttack) {
            return attackAnim(enemyBug.behavior.attackTime);
        }

        return idleAnim(enemyBug.lifetime);
    }

    function drawEnemyBug(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    }

    return function createEnemyBug() {
        const enemyBug = new Entity();
        enemyBug.size.set(58, 45);
        enemyBug.offset.y = 17;

        enemyBug.addTrait(new Physics());
        enemyBug.addTrait(new Solid());
        enemyBug.addTrait(new BehaviorEnemyBug());
        enemyBug.addTrait(new Killable());

        enemyBug.draw = drawEnemyBug;

        return enemyBug;
    };
}
