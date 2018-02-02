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
import { LevelManager } from './LevelManager';

export class GameManager {
    constructor(canvasSelector) {
        this.canvasSelector = canvasSelector;
        this.context = canvasSelector.getContext('2d');

        this.camera = new Camera();
        this.cameraController = new CameraController(this.camera, this.context);
        this.timer = new Timer();

        this.start();
    }

    async start() {
        this.timer.start();
        
        this.entityFactory = await loadEntities();
        this.loadLevel = await createLevelLoader(this.entityFactory);
        this.playerEnv = createPlayerEnv(this);
        this.levelManager = new LevelManager(this);
            
        this.levelManager.nextLevel();
    }
}

function loadEntities() {
    const entityFactories = {};

    function addFactory(name) {
        return factory => (entityFactories[name] = factory);
    }

    return Promise.all([
        loadUnicorn().then(addFactory('unicorn')),
        loadEnemyBug().then(addFactory('enemyBug')),
        loadRainbow().then(addFactory('rainbow')),
        loadSpeedBooster().then(addFactory('speedbooster')),
        loadPortal().then(addFactory('portal')),
        loadBullet().then(addFactory('bullet')),
        loadManaPot().then(addFactory('manaPot')),
        loadUfo().then(addFactory('ufo')),
    ]).then(() => entityFactories);
}
