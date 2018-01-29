import { Trait } from './Entity';
import { Vec2 } from './math';

export class PlayerController extends Trait {
    constructor() {
        super('playerController');
        this.checkpoint = new Vec2(0, 0);
        this.player = null;

        this.levelCompeteHandler = undefined;
        this.levelFailedHandler = undefined;

        this.totalScore = 0;
        this.score = 0;
        this.fireballs = 10;

        this.fireballsSelector = document.getElementById('current-fireballs');
        this.scoreSelector = document.getElementById('unicorn-score');

        this.updateUiCounts(this.fireballsSelector, this.fireballs);        
    }

    onLevelComplete(levelCompeteHandler) {
        this.levelCompeteHandler = levelCompeteHandler;
    }

    onLevelFail(levelFailedHandler) {
        this.levelFailedHandler = levelFailedHandler;
    }

    setPlayer(entity) {
        this.player = entity;

        this.player.picker.onPick = this.onPick.bind(this);
        this.player.striker.onStrike = this.onStrike.bind(this);
    }

    onPick(picker, pickable) {
        if(pickable.name === 'rainbow') {
            this.score += 50;
            this.updateUiCounts(this.scoreSelector, this.totalScore + this.score);
        }
    }

    onStrike(bullet) {
        if(bullet.name === 'bullet') {
            this.fireballs--;
        }
        this.updateUiCounts(this.fireballsSelector, this.fireballs);  
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

    async update(entity, deltaTime, level) {
        if(!this.player) {
            return;
        }

        if(this.player.pos.x > level.distance + 100 && this.player.pos.y > 500) {
            this.levelCompeteHandler && this.levelCompeteHandler();
            return;
        }

        const dead = this.player.killable.dead && !level.entities.has(this.player);
        const fall = this.player.pos.y > 1200;
        const levelFailed = fall || dead;

        if (levelFailed) {
            this.player = undefined;

            this.resetScore();

            this.levelFailedHandler && this.levelFailedHandler();            
        }
    }
}
