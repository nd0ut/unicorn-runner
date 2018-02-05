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
import { createDebugLayer } from '../layers';
import { Game } from '../Game';

export class Editor extends Game {
    constructor(canvasSelector) {
        super(canvasSelector);

        this.mouse = new Mouse(this);
        this.interaction = new Interaction(this);
        this.picker = new Picker(this);
        this.selection = new Selection(this);

        this.levelIdx = 1;
        this.tileResolver = undefined;
        this.levelManager.showSplash = false;
    }

    get level() {
        return this.levelManager.level;
    }

    get levelSpec() {
        const { spec } = this.levelManager.levels[this.levelIdx];
        return spec;
    }

    addDebugLayer(level) {
        const debugLayer = createDebugLayer(this);
        level.comp.addLayer(debugLayer);
    }

    async startEditing(levelIdx) {
        const level = await this.levelManager.runLevel(this.levelIdx);
        this.tileResolver = new TileResolver(level.backgroundGrid);

        const origUpdate = this.timer.update;

        this.timer.update = (...args) => {
            origUpdate(...args);
            this.onUpdate && this.onUpdate();
        }

        this.addDebugLayer(level);
    }

    async restart() {
        this.startEditing(this.levelIdx);
    }

    async onLoad() {
        await this.startEditing(this.levelIdx);
        this.pause();
    }

    onLevelFinished() {
        this.restart();
    }

    onLevelFailed() {
        this.restart();
    }
}
