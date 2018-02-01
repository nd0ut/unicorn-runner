import { Trait } from '../Entity';
import { Vec2 } from '../math';
import {splashText} from '../Splash';
import {debounce} from '../util';

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
        this.levelCompeteHandler = debounce(levelCompeteHandler, 1000);
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

    async update(entity, deltaTime, level) {
        if(!this.player) {
            return;
        }

        const distToEnd = level.distance - this.player.pos.x;
        if (distToEnd > 0 && distToEnd < 500) {
            this.player.run.speed = 100000;

            if (distToEnd < 100) {
                this.player.jump.start();                
                this.levelCompeteHandler && this.levelCompeteHandler();
            }
            return;            
        }

        const dead = this.player.killable.dead && !level.entities.has(this.player);
        const fall = this.player.pos.y > 500;
        const levelFailed = fall || dead;

        if (levelFailed) {            
            // this.player = undefined;

            // this.resetScore();

            // this.levelFailedHandler && this.levelFailedHandler();            
        }
    }
}
