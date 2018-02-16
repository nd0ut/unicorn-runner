import { Trait } from '../Entity';
import { LevelEvents } from '../LevelManager';
import { Vec2 } from '../math';
import { splash } from '../Splash';

export class PlayerController extends Trait {
    constructor(game) {
        super('playerController');
        this.game = game;
        this.checkpoint = new Vec2(0, 0);
        this.player = undefined;

        this.game.levelManager.on(LevelEvents.FINISHED, this.onLevelFinished.bind(this));
        this.game.levelManager.on(LevelEvents.FAILED, this.onLevelFailed.bind(this));

        this.totalScore = 0;
        this.score = 0;
        this.mana = 0;
        this.kills = 0;
        this.deaths = 0;

        this.fireballsSelector = document.getElementById('current-fireballs');
        this.scoreSelector = document.getElementById('unicorn-score');

        this.updateUiCounts(this.fireballsSelector, this.mana);
    }

    setPlayer(entity) {
        this.player = entity;

        this.player.picker.on('pick', this.onPick.bind(this));
        this.player.striker.on('strike', this.onStrike.bind(this));
        this.player.killer.on('kill', this.onKill.bind(this));
        this.player.killable.on('dead', this.onDead.bind(this));
    }

    onPick(picker, pickable) {
        if (pickable.name === 'rainbow') {
            this.score += 50;
            this.updateUiCounts(this.scoreSelector, this.totalScore + this.score);
        }
        if (pickable.name === 'manaPot') {
            this.mana += 1;
            this.updateUiCounts(this.fireballsSelector, this.mana);
        }
    }

    onStrike(bullet) {
        if (bullet.name === 'bullet') {
            this.mana--;
        }
        this.updateUiCounts(this.fireballsSelector, this.mana);
    }

    onKill() {
        this.kills++;
    }

    onDead() {
        this.deaths++;
    }

    updateUiCounts(selector, count) {
        setTimeout(() => {
            selector.innerHTML = Math.ceil(count);
        }, 0);
    }

    canStrikeFireballs() {
        const alive = this.player && !this.player.killable.dead;
        const haveMana = this.mana > 0;

        if (!haveMana) {
            splash('no mana', {
                timeout: 1000,
                size: 30
            });
        }

        return alive && haveMana;
    }

    canBoost() {
        const alive = this.player && !this.player.killable.dead;
        const haveMana = this.mana > 0;

        if (alive && this.mana === 0) {
            splash('no mana', {
                timeout: 1000,
                size: 30
            });
        }

        return alive && haveMana;
    }

    commitScore() {
        this.totalScore += this.score;
        this.resetScore();
    }

    resetScore() {
        this.score = 0;
        this.updateUiCounts(this.scoreSelector, this.totalScore + this.score);
    }

    resetMana() {
        this.mana = 0;
        this.updateUiCounts(this.fireballsSelector, this.mana);
    }

    update(entity, deltaTime, level) {
        if (!this.player) {
            return;
        }

        if (!this.player.killable.dead && !level.entities.has(this.player)) {
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
            return;
        }

        if (this.player.run.boosted) {
            this.mana -= deltaTime;

            if (this.mana <= 0) {
                this.player.run.cancelBoost();
                this.mana = 0;
            }

            if (this.player.jump.inAir) {
                this.player.run.cancelBoost();
            }

            this.updateUiCounts(this.fireballsSelector, this.mana);
        }
    }

    onLevelFinished({ isLastLevel }) {
        this.commitScore();
        this.resetMana();
    }

    onLevelFailed() {
        this.resetScore();
        this.resetMana();
    }
}
