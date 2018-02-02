import { Camera } from '../camera/Camera';
import { loadEnemyBug } from '../chars/EnemyBug';
import { loadUnicorn } from '../chars/Unicorn';
import { createLevelLoader } from '../loadLevel';
import { loadUfo } from '../other/Ufo';
import { loadManaPot } from '../pickables/ManaPot';
import { loadPortal } from '../pickables/Portal';
import { loadRainbow } from '../pickables/Rainbow';
import { loadSpeedBooster } from '../pickables/SpeedBooster';
import { Timer } from '../Timer';
import { loadBullet } from '../weapon/Bullet';
import { LevelManager } from './LevelManager';
import { MouseController } from './MouseController';
import { InteractionController } from './InteractionController';

export class Editor {
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

        this.mouse = new MouseController(this);

        this.levelManager = new LevelManager(this);
        this.levelManager.runLevel(0);

        this.interactionController = new InteractionController(this);

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
