import { Camera } from './Camera';
import { loadEnemyBug } from './chars/EnemyBug';
import { loadRainbow } from './chars/Rainbow';
import { loadUnicorn } from './chars/Unicorn';
import * as levels from './levels';
import { createPlayerEnv } from './levels/createPlayerEnv';
import { createLevelLoader } from './loadLevel';
import { Timer } from './Timer';
import { loadSpeedBooster } from './chars/SpeedBooster';

export class Game {
    constructor(context) {
        this.levelsSequence = [levels.initial, levels.first, levels.second];
        this.currentLevel = -1;

        this.context = context;
        this.camera = new Camera();
        this.timer = new Timer();
        this.levelSelector = document.getElementById('current-level');

        this.start();
    }

    async start() {
        this.timer.start();

        this.charsFactory = await loadChars();
        this.loadLevel = await createLevelLoader(this.charsFactory);
        this.unicorn = this.charsFactory.unicorn();
        this.playerEnv = createPlayerEnv(this.unicorn);

        this.nextLevel();
    }

    nextLevel() {
        this.playerEnv.playerController.commitScore();

        this.currentLevel = this.currentLevel + 1;
        this.levelSelector.innerHTML = this.currentLevel;

        const startLevel = this.levelsSequence[this.currentLevel];
        startLevel(this);
    }
}

function loadChars() {
    const entityFactories = {};

    function addFactory(name) {
        return factory => (entityFactories[name] = factory);
    }

    return Promise.all([
        loadUnicorn().then(addFactory('unicorn')),
        loadEnemyBug().then(addFactory('enemyBug')),
        loadRainbow().then(addFactory('rainbow')),
        loadSpeedBooster().then(addFactory('speedbooster')),
    ]).then(() => entityFactories);
}