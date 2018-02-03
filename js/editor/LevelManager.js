import * as levels from '../levels';
import { splashText } from '../Splash';

const LevelState = {
    IDLE: Symbol('IDLE'),

    FAILED: Symbol('FAILED'),
    FINISH_ANIMATION: Symbol('FINISH_ANIMATION'),
    FINISHED: Symbol('FINISHED')
};

export class LevelManager {
    constructor(editor) {
        this.editor = editor;

        this.levelState = LevelState.IDLE;
        this.initLevel = undefined;
        this.level = undefined;
        
        this.finishDistance = 500;
        this.fallDistance = 600;

        this.finishedHandler = undefined;
        this.failedHandler = undefined;
    }

    get playerController() {
        return this.editor.playerEnv.playerController;
    }

    get player() {
        return this.editor.playerEnv.playerController.player;
    }

    onLevelFinished(finishedHandler) {
        this.finishedHandler = finishedHandler
    }

    onLevelFailed(failedHandler) {
        this.failedHandler = failedHandler;
    }

    async restartLevel() {
        return this.runLevel(this.initLevel);
    }

    async runLevel(initLevel) {
        const { level, startLevel } = await initLevel(this.editor);

        this.initLevel = initLevel;
        this.level = level;

        startLevel();

        this.levelState = LevelState.IDLE;
    }

    update(deltaTime) {
        if (!this.level) {
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

        const animationEnd = this.player.pos.y + this.player.size.y < -100;

        if (animationEnd) {
            this.levelState = LevelState.FINISHED;
            this.onFinish();
            return;
        }

        if (this.levelState === LevelState.IDLE) {
            this.levelState = LevelState.FINISH_ANIMATION;

            this.ufo = this.editor.entityFactory.ufo({ napEntity: this.player });
            this.level.entities.add(this.ufo);
            this.editor.cameraController.focus.notice(this.ufo, 3000);
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

    onFinish() {
        this.onLevelFinished();
        this.nextLevel();
    }

    onFail() {
        this.onLevelFailed();
        this.restartLevel();
    }
}
