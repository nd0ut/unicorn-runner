import { Camera } from './camera/Camera';
import { CameraController } from './camera/CameraController';
import { CameraFocus } from './camera/CameraFocus';
import { CameraShake } from './camera/CameraShake';
import { LevelManager, LevelEvents } from './LevelManager';
import { loadEntities } from './loadEntities';
import { createLevelLoader } from './loadLevel';
import { createPlayerEnv } from './player/createPlayerEnv';
import { Timer } from './Timer';
import { splash } from './Splash';

export class Game {
    constructor(canvasSelector) {
        this.canvasSelector = canvasSelector;
        this.context = canvasSelector.getContext('2d');

        this.camera = new Camera();
        this.timer = new Timer();
        this.levelManager = new LevelManager(this);
        this.cameraController = new CameraController(this.camera, [CameraShake, CameraFocus]);
        this.playerEnv = createPlayerEnv(this);

        this.paused = false;

        this.levelManager.on(LevelEvents.FINISHED, this.onLevelFinished.bind(this));
        this.levelManager.on(LevelEvents.FAILED, this.onLevelFailed.bind(this));

        this.loadResources();
    }

    async loadResources() {
        this.entityFactory = await loadEntities();
        this.loadLevel = await createLevelLoader(this.entityFactory);

        this.timer.start();                
        this.onLoad();
    }

    async onLoad() {
        this.levelManager.runLevel();
    }

    onLevelFinished({isLastLevel}) {
        if(isLastLevel) {
            this.onGameOver();
        } else {
            this.levelManager.nextLevel();            
        }
    }

    onLevelFailed() {
        this.levelManager.restartLevel();        
    }

    async onGameOver() {
        this.pause();
        
        const pc = this.playerEnv.playerController;
        
        await splash('you win! <br> congratulations!', { size: 50, background: 'rgba(0,0,0,0.5)' });

        const html = `
            score: ${pc.totalScore} <br> 
            Deaths: ${pc.deaths}
        `;
        splash(html, { size: 50, background: 'rgba(0,0,0,0.5)', timeout: 100000 });

    }

    pause() {
        this.levelManager.level.frozen = true;
        this.paused = true;
    }

    resume() {
        this.levelManager.level.frozen = false;
        this.paused = false;
    }
}
