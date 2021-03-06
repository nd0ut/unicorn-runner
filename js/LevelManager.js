import levels from './levels';
import { splash } from './Splash';
import { EventEmitter } from './util';

const LevelState = {
    IDLE: Symbol('IDLE'),

    FAILED: Symbol('FAILED'),
    FINISH_ANIMATION: Symbol('FINISH_ANIMATION'),
    FINISHED: Symbol('FINISHED')
};

export const LevelEvents = {
    FAILED: Symbol('FAILED'),
    FINISHED: Symbol('FINISHED')
};

@EventEmitter.decorator
export class LevelManager {
    constructor(game) {
        this.game = game;

        const loadLastLevel = false;
        const showDemoLevel = true;

        let currentLevel = showDemoLevel ? 0 : 1;

        if (loadLastLevel) {
            const lastLevel = localStorage.getItem('levelIdx')
                ? parseInt(localStorage.getItem('levelIdx'))
                : undefined;

            currentLevel = lastLevel || currentLevel;
        }

        this.levels = levels;
        this.levelIdx = currentLevel;
        this.levelState = LevelState.IDLE;

        this.level = undefined;
        this.stopLevel = undefined;

        this.showSplash = true;
        this.finishDistance = 1500;
        this.fallDistance = 600;

        this.levelSelector = document.getElementById('current-level');
    }

    get playerController() {
        return this.game.playerEnv.playerController;
    }

    get player() {
        return this.game.playerEnv.playerController.player;
    }

    async restartLevel() {
        return this.runLevel(this.levelIdx);
    }

    async nextLevel() {
        this.levelIdx += 1;
        return this.runLevel(this.levelIdx);
    }

    async runLevel(levelIdx = this.levelIdx) {
        this.stopLevel && this.stopLevel();
        localStorage.setItem('levelIdx', levelIdx);

        this.game.canvasSelector.classList.toggle('black', true);

        this.levelIdx = levelIdx;

        this.levelSelector.innerHTML = levelIdx;

        const { init } = this.levels[levelIdx];
        const { level, startLevel, stopLevel } = await init(this.game);

        this.level = level;
        this.stopLevel = stopLevel;

        if (this.showSplash && level.name) {
            await splash(level.name);
        }
        this.game.canvasSelector.classList.toggle('black', false);

        startLevel();

        this.levelState = LevelState.IDLE;

        return level;
    }

    update(deltaTime) {
        if (!this.level) {
            return;
        }

        if (this.level.frozen) {
            return;
        }

        if (this.levelState === LevelState.FINISHED) {
            return;
        }

        if ([LevelState.FINISH_ANIMATION, LevelState.IDLE].includes(this.levelState)) {
            this.checkFinished();
        }

        if (this.levelState === LevelState.IDLE) {
            this.checkFailed();
        }
    }

    checkFinished() {
        const distToFinish = this.level.distance - this.player.pos.x;

        if (distToFinish > this.finishDistance) {
            return;
        }

        const animationEnd = this.player.pos.y + this.player.size.y < -500;

        if (animationEnd) {
            this.levelState = LevelState.FINISHED;
            this.onFinish();
            return;
        }

        if (this.levelState === LevelState.IDLE) {
            this.levelState = LevelState.FINISH_ANIMATION;

            this.ufo = this.game.entityFactory.ufo({ napEntity: this.player });
            this.level.entities.add(this.ufo);
            this.game.cameraController.focus.notice(this.ufo, 10000);
        }
    }

    checkFailed() {
        const death = this.player.killable.dead && !this.level.entities.has(this.player);
        const fall = this.player.pos.y > this.fallDistance;
        const levelFailed = death || fall;

        if (fall) {
            this.player.killable.kill();
        }

        if (levelFailed) {
            this.onFail();
            this.levelState = LevelState.FAILED;
        }
    }

    onFinish() {
        const isLastLevel = this.levelIdx === this.levels.length - 1;

        this.emit(LevelEvents.FINISHED, { isLastLevel });
    }

    onFail() {
        this.emit(LevelEvents.FAILED);
    }
}
