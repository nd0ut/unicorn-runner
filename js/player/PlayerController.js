import { Trait, Sides } from '../Entity';
import { Vec2 } from '../math';
import {splashText} from '../Splash';
import {debounce} from '../util';

export class PlayerController extends Trait {
    constructor(game) {
        super('playerController');
        this.game = game;
        this.checkpoint = new Vec2(0, 0);
        this.player = undefined;

        this.levelCompleteHandler = undefined;

        this.totalScore = 0;
        this.score = 0;
        this.fireballs = 10;

        this.fireballsSelector = document.getElementById('current-fireballs');
        this.scoreSelector = document.getElementById('unicorn-score');

        this.updateUiCounts(this.fireballsSelector, this.fireballs);        
    }

    onLevelComplete(levelCompleteHandler) {
        this.levelCompleteHandler = levelCompleteHandler
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
        if (pickable.name === 'manaPot') {
            this.fireballs += 50;
            this.updateUiCounts(this.fireballsSelector, this.fireballs);
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
        const alive = this.player && !this.player.killable.dead;
        const haveBalls = this.fireballs > 0;

        if(alive && this.fireballs === 0) {
            splashText('not enough balls!', 1000, 70, 'red')
        }

        return alive && haveBalls;
    }

    commitScore() {
        this.totalScore = this.score;
        this.resetScore();
    }

    resetScore() {
        this.score = 0;
        this.scoreSelector.innerHTML = this.totalScore + this.score;
    }

    update(entity, deltaTime, level) {
        if(!this.player) {
            return;
        }
        
        if(!this.player.killable.dead && !level.entities.has(this.player)) {
            level.entities.add(this.player);
            return;
        }
    }
}
