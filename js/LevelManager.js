import * as levels from './levels';
import { splashText } from './Splash';

const LevelState = {
    IDLE: Symbol('IDLE'),

    FAILED: Symbol('FAILED'),
    FINISH_ANIMATION: Symbol('FINISH_ANIMATION'),
    FINISHED: Symbol('FINISHED')
};

export class LevelManager {
    constructor(game) {
        this.game = game;

        const showInitialLevel = false;

        this.levels = [levels.initial, levels.first, levels.second];
        this.levelIdx = -1;
        this.levelState = LevelState.IDLE;

        if (!showInitialLevel) {
            document.querySelector('.play-block').remove();
            this.levelIdx += 1;
        }

        this.level = undefined;

        this.finishDistance = 500;
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

    async runLevel(levelIdx) {
        this.game.canvasSelector.classList.toggle('blur', true);

        this.playerController.commitScore();

        this.levelSelector.innerHTML = levelIdx;

        const initLevel = this.levels[levelIdx];
        const { level, startLevel } = await initLevel(this.game);
        this.level = level;

        if (level.name) {
            await splashText(level.name);
        }

        this.game.canvasSelector.classList.toggle('blur', false);

        startLevel();

        this.levelState = LevelState.IDLE;
    }

    update(deltaTime) {
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

        const animationEnd = this.player.pos.y + this.player.size.y < -100;

        if (animationEnd) {
            this.levelState = LevelState.FINISHED;
            this.nextLevel();
            return;
        }

        if (this.levelState === LevelState.IDLE) {
            this.levelState = LevelState.FINISH_ANIMATION;

            this.ufo = this.game.entityFactory.ufo({ napEntity: this.player });
            this.level.entities.add(this.ufo);
            this.game.cameraController.focus.notice(this.ufo, 3000);
        }
    }

    checkFailed() {
        const death = this.player.killable.dead && !this.level.entities.has(this.player);
        const fall = this.player.pos.y > this.fallDistance;
        const levelFailed = death || fall;

        if (levelFailed) {
            this.onFail();
            this.levelState = LevelState.FAILED;
        }
    }

    onFail() {
        this.playerController.resetScore();
        this.restartLevel();
    }
}
