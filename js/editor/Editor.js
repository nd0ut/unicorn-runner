import { Camera } from '../camera/Camera';
import { CameraController } from '../camera/CameraController';
import { CameraFocus } from '../camera/CameraFocus';
import { CameraShake } from '../camera/CameraShake';
import { loadEnemyBug } from '../chars/EnemyBug';
import { loadUnicorn } from '../chars/Unicorn';
import { LevelManager } from '../LevelManager';
import { first } from '../levels/first';
import { createLevelLoader } from '../loadLevel';
import { loadUfo } from '../other/Ufo';
import { loadManaPot } from '../pickables/ManaPot';
import { loadPortal } from '../pickables/Portal';
import { loadRainbow } from '../pickables/Rainbow';
import { loadSpeedBooster } from '../pickables/SpeedBooster';
import { createPlayerEnv } from '../player/createPlayerEnv';
import { Timer } from '../Timer';
import { loadBullet } from '../weapon/Bullet';
import { Interaction } from './Interaction';
import { Mouse } from './Mouse';
import { Picker } from './Picker';
import { TileResolver } from '../TileCreation';

export class Editor {
    constructor(canvasSelector) {
        this.canvasSelector = canvasSelector;
        this.context = canvasSelector.getContext('2d');

        this.camera = new Camera();
        this.timer = new Timer();
        this.paused = false;

        this.mouse = new Mouse(this);
        this.interaction = new Interaction(this);
        this.picker = new Picker(this);
        this.levelManager = new LevelManager(this);

        this.editLevelIdx = 1;
        this.level = undefined
        this.levelSpec = undefined
        this.tileResolver = undefined;

        this.start();
    }

    pause() {
        this.levelManager.level.frozen = true;
        this.paused = true;
    }

    resume() {
        this.levelManager.level.frozen = false;
        this.paused = false;
    }

    async start() {
        this.entityFactory = await loadEntities();
        this.loadLevel = await createLevelLoader(this.entityFactory);

        this.cameraController = new CameraController(this.camera, [CameraShake, CameraFocus]);
        this.playerEnv = createPlayerEnv(this);

        this.level = await this.levelManager.runLevel(this.editLevelIdx);
        this.tileResolver = new TileResolver(this.level.backgroundGrid);

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
