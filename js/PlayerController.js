import { Trait } from './Entity';
import { Vec2 } from './math';

export class PlayerController extends Trait {
    constructor() {
        super('playerController');
        this.checkpoint = new Vec2(0, 0);
        this.player = null;

        this.totalScore = 0;
        this.score = 0;
        this.fireballs = 10;

        this.fireballsSelector = document.getElementById('current-fireballs');
        this.scoreSelector = document.getElementById('unicorn-score');

        this.updateUiCounts(this.fireballsSelector, this.fireballs);        
    }

    setPlayer(entity) {
        this.player = entity;

        this.player.picker.onPick = (picker, pickable) => {
            this.score += 50;
            this.updateUiCounts(this.scoreSelector, this.totalScore + this.score);
        };

        this.player.striker.onStrike = (bullet) => {
            if(bullet.name === 'bullet') {
                this.fireballs--;
            }
            this.updateUiCounts(this.fireballsSelector, this.fireballs);            
        };
    }

    updateUiCounts(selector, count) {
        setTimeout(() => {
            selector.innerHTML = count;
        }, 0);
    }

    canStrikeFireballs() {
        return this.fireballs > 0;
    }

    commitScore() {
        this.totalScore = this.score;
        this.resetScore();
    }

    resetScore() {
        this.score = 0;
        this.scoreSelector.innerHTML = this.totalScore + this.score;
    }

    resetDistance() {
        this.player.run.distance = 0;
    }

    update(entity, deltaTime, level) {
        if (
            !level.entities.has(this.player) ||
            this.player.pos.y > 1200
        ) {
            this.resetScore();
            this.resetDistance();

            this.player.resetLifetime();
            this.player.killable.revive();
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
        }
    }
}
