import { Camera } from './camera/Camera';
import { CameraController } from './camera/CameraController';
import { loadEnemyBug } from './chars/EnemyBug';
import { loadUnicorn } from './chars/Unicorn';
import * as levels from './levels';
import { createLevelLoader } from './loadLevel';
import { loadManaPot } from './pickables/ManaPot';
import { loadPortal } from './pickables/Portal';
import { loadRainbow } from './pickables/Rainbow';
import { loadSpeedBooster } from './pickables/SpeedBooster';
import { createPlayerEnv } from './player/createPlayerEnv';
import { Timer } from './Timer';
import { loadBullet } from './weapon/Bullet';
import { splashText } from './Splash';
import { loadUfo } from './other/Ufo';

export class LevelManager {
    constructor(game) {
        this.game = game;

        this.levels = [
            levels.initial, 
            levels.first, 
            levels.second
        ];
        this.level = undefined;
        this.levelIdx = -1;

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
        const {level, startLevel} = await initLevel(this.game);
        this.level = level;

        if(level.name) {
            await splashText(level.name)
        }

        this.game.canvasSelector.classList.toggle('blur', false);    

        startLevel();      
    }

    update(deltaTime) {
        const distToFinish = this.level.distance - this.player.pos.x;

        if (distToFinish < this.finishDistance) {
           this.onFinish(distToFinish);
           return;
        } else {
            this.levelFinished = false;
            this.ufo = undefined;            
        }

        const death = this.player.killable.dead && !this.level.entities.has(this.player);
        const fall = this.player.pos.y > this.fallDistance && distToFinish > this.finishDistance;
        const levelFailed = death || fall;

        if (levelFailed) {      
            this.onFail();      
            this.levelFailed = true;            
        } else {
            this.levelFailed = false;            
        }
    }

    onFinish(distToFinish) {
        if(this.player.pos.y + this.player.size.y < -100) {
            this.nextLevel();
            return;
        }

        if(!this.levelFinished) {
            this.ufo = this.game.entityFactory.ufo({napEntity: this.player});
            this.level.entities.add(this.ufo);
            this.game.cameraController.focus.notice(this.ufo, 3000);

            this.levelFinished = true;        
        }
    }

    onFail() {
        if(this.levelFailed) {
            return
        }

        this.resetScore();
        this.restartLevel();
    }
}
