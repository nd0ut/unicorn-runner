import { Camera } from './camera/Camera';
import { CameraController } from './camera/CameraController';
import { CameraFocus } from './camera/CameraFocus';
import { CameraShake } from './camera/CameraShake';
import { LevelManager } from './LevelManager';
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

        this.start();
    }

    async start() {
        this.entityFactory = await loadEntities();
        this.loadLevel = await createLevelLoader(this.entityFactory);

        this.playerEnv = createPlayerEnv(this);

        this.levelManager.nextLevel();

        this.timer.start();
    }
}