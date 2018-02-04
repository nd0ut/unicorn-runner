import { Camera } from '../camera/Camera';
import { CameraController } from '../camera/CameraController';
import { CameraFocus } from '../camera/CameraFocus';
import { CameraShake } from '../camera/CameraShake';
import { LevelManager } from '../LevelManager';
import { createLevelLoader } from '../loadLevel';
import { createPlayerEnv } from '../player/createPlayerEnv';
import { TileResolver } from '../TileCreation';
import { Timer } from '../Timer';
import { Interaction } from './Interaction';
import { loadEntities } from '../loadEntities';
import { Mouse } from './Mouse';
import { Picker } from './Picker';
import { Selection } from './Selection';

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
        this.selection = new Selection(this);

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

        this.pause();

        this.timer.start();
    }
}