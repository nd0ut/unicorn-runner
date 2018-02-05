import { Camera } from './camera/Camera';
import { CameraController } from './camera/CameraController';
import { CameraFocus } from './camera/CameraFocus';
import { CameraShake } from './camera/CameraShake';
import { LevelManager, LevelEvents } from './LevelManager';
import { loadEntities } from './loadEntities';
import { createLevelLoader } from './loadLevel';
import { createPlayerEnv } from './player/createPlayerEnv';
import { Timer } from './Timer';

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
        this.levelManager.nextLevel();
    }

    onLevelFinished() {
        this.levelManager.nextLevel();
    }

    onLevelFailed() {
        this.levelManager.restartLevel();        
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
