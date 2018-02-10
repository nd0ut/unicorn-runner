import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Killable, Physics, Solid, Stackable } from '../Traits';
import { defineGameObject } from '../defineGameObject';
import ENEMY_CACTUS from './enemy_skins/enemy_cactus';
import ENEMY_TARGET from './enemy_skins/enemy_target';

class BehaviorEnemy extends Trait {
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
        if (!them.killable || us.killable.dead || us.name === them.name) {
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

export const loadEnemy = defineGameObject('enemy', {
    spriteSpecs: [ENEMY_CACTUS, ENEMY_TARGET],
    // drawBounds: true,

    afterCreate: entity => {
        entity.killable.removeAfter = 0.6;
    },

    traits: ({ ownerEntity }) => [
        new Physics(),
        new Solid(),
        new Killable(),
        new Stackable(),
        new BehaviorEnemy()
    ],
    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');
        const attackAnim = sprite.animations.get('attack');
        const deathAnim = sprite.animations.get('death');

        return enemy => {
            if (enemy.behavior.inAttack) {
                return attackAnim(enemy.behavior.attackTime);
            }

            if (enemy.killable.dead) {
                return deathAnim(enemy.killable.deadTime);
            }

            return idleAnim(enemy.lifetime);
        };
    }
});
