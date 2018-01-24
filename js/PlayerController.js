import { Trait } from './Entity';
import { Vec2 } from './math';

export class PlayerController extends Trait {
    constructor() {
        super('playerController');
        this.checkpoint = new Vec2(0, 0);
        this.player = null;

        this.totalScore = 0;
        this.score = 0;
        this.scoreSelector = document.getElementById('unicorn-score');
    }

    setPlayer(entity) {
        this.player = entity;

        this.player.picker.onPick = () => {
            this.score += 50;

            setTimeout(() => {
                this.scoreSelector.innerHTML = this.totalScore + this.score;
            }, 0);
        };
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
