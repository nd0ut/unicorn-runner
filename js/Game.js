import { Camera } from './camera/Camera';
import { CameraController } from './camera/CameraController';
import { loadEnemyBug } from './chars/EnemyBug';
import { loadUnicorn } from './chars/Unicorn';
import { LevelManager } from './LevelManager';
import { createLevelLoader } from './loadLevel';
import { loadUfo } from './other/Ufo';
import { loadManaPot } from './pickables/ManaPot';
import { loadPortal } from './pickables/Portal';
import { loadRainbow } from './pickables/Rainbow';
import { loadSpeedBooster } from './pickables/SpeedBooster';
import { createPlayerEnv } from './player/createPlayerEnv';
import { Timer } from './Timer';
import { loadBullet } from './weapon/Bullet';

export class Game {
    constructor(canvasSelector) {
        this.canvasSelector = canvasSelector;
        this.context = canvasSelector.getContext('2d');

        this.camera = new Camera();
        this.timer = new Timer();

        this.start();
    }

    async start() {
        this.entityFactory = await loadEntities();
        this.loadLevel = await createLevelLoader(this.entityFactory);

        this.cameraController = new CameraController(this.camera);

        this.levelManager = new LevelManager(this);
        this.playerEnv = createPlayerEnv(this);

        this.levelManager.nextLevel();

        this.timer.start();
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
        loadUfo().then(addFactory('ufo'))
    ]).then(() => entityFactories);
}
