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

        let lastLevel = parseInt(localStorage.getItem('levelIdx'));
        lastLevel = lastLevel > this.levelManager.levels.length - 1 ? lastLevel - 1 : lastLevel;

        const storedLevelIdx = lastLevel;
        this.levelIdx = storedLevelIdx && storedLevelIdx > 0 ? storedLevelIdx : 1;

        this.tileResolver = undefined;
        this.levelManager.showSplash = false;

        this.paused = true;

        window.editor = this;
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
        this.levelIdx = levelIdx;
        const level = await this.levelManager.runLevel(this.levelIdx);
        this.tileResolver = new TileResolver(level.tileGrid);

        const origUpdate = this.timer.update;

        this.timer.update = (...args) => {
            origUpdate(...args);
            this.onUpdate && this.onUpdate();
        }

        this.addDebugLayer(level);

        this.paused && this.pause();        
    }

    restart() {
        this.playerEnv.playerController.resetMana();
        return this.startEditing(this.levelIdx);
    }

    onLoad() {
        return this.startEditing(this.levelIdx);
    }

    onLevelFinished() {
        this.restart();
    }

    onLevelFailed() {
        this.restart();
    }
}
