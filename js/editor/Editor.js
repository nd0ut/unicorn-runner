import { Camera } from '../camera/Camera';
import { CameraController } from '../camera/CameraController';
import { CameraFocus } from '../camera/CameraFocus';
import { CameraShake } from '../camera/CameraShake';
import { loadEnemyBug } from '../chars/EnemyBug';
import { loadUnicorn } from '../chars/Unicorn';
import { LevelManager } from './LevelManager';
import { createLevelLoader } from '../loadLevel';
import { loadUfo } from '../other/Ufo';
import { loadManaPot } from '../pickables/ManaPot';
import { loadPortal } from '../pickables/Portal';
import { loadRainbow } from '../pickables/Rainbow';
import { loadSpeedBooster } from '../pickables/SpeedBooster';
import { createPlayerEnv } from '../player/createPlayerEnv';
import { Timer } from '../Timer';
import { loadBullet } from '../weapon/Bullet';
import { createEditorLevelLoader } from './createEditorLevelLoader';
import { EditorLevelManager } from './EditorLevelManager';
import { InteractionController } from './InteractionController';
import { MouseController } from './MouseController';
import { first } from '../levels/first';

export class Editor {
    constructor(canvasSelector) {
        this.canvasSelector = canvasSelector;
        this.context = canvasSelector.getContext('2d');

        this.camera = new Camera();
        this.timer = new Timer();

        this.mouse = new MouseController(this);
        this.interactionController = new InteractionController(this);
        
        this.levels = [
            first
        ];
        this.editLevelIdx = 0;
        this.editMode = true;

        this.startEditor();
        this.timer.start();
        
        window.editor = this;
    }

    async startPlayer() {
        this.entityFactory = await loadEntities();
        this.loadLevel = await createLevelLoader(this.entityFactory);

        this.cameraController = new CameraController(this.camera, [CameraShake, CameraFocus]);

        this.levelManager = new LevelManager(this);
        this.playerEnv = createPlayerEnv(this);

        this.level = this.levels[this.editLevelIdx];
        this.levelManager.runLevel(this.level.load);

        this.editMode = false;
    }

    async startEditor() {
        this.timer.update = () => {};
        this.entityFactory = await loadEntities();
        this.loadLevel = await createEditorLevelLoader(this.entityFactory);


        this.editorLevelManager = new EditorLevelManager(this);
        
        this.level = this.levels[this.editLevelIdx];        
        this.editorLevelManager.runLevel(this.level.spec);

        this.editMode = true;
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
