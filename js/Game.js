import { Camera } from './Camera';
import { loadEnemyBug } from './chars/EnemyBug';
import { loadRainbow } from './chars/Rainbow';
import { loadUnicorn } from './chars/Unicorn';
import { Entity } from './Entity';
import { createLevelLoader } from './loadLevel';
import { PlayerController } from './PlayerController';
import { Timer } from './Timer';
import { AutoJump } from './Traits';
import * as levels from './levels';

export class Game {
    constructor(context) {
        this.levelsSequence = (function*(klass) {
            yield levels.initial(klass);
            yield levels.first(klass);
        })(this);

        this.context = context;
        this.camera = new Camera();
        this.timer = new Timer();

        this.start();
    }

    async start() {
        this.timer.start();

        this.charsFactory = await loadChars();
        this.loadLevel = await createLevelLoader(this.charsFactory);

        this.levelsSequence.next();
    }

    next() {
        const nextLevel = this.levelsSequence.next().value;
        nextLevel();
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
        loadRainbow().then(addFactory('rainbow'))
    ]).then(() => entityFactories);
}
