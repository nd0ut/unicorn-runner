import { Camera } from './Camera';
import { loadEnemyBug } from './chars/EnemyBug';
import { loadRainbow } from './chars/Rainbow';
import { loadBullet } from './chars/Bullet';
import { loadUnicorn } from './chars/Unicorn';
import * as levels from './levels';
import { createPlayerEnv } from './levels/createPlayerEnv';
import { createLevelLoader } from './loadLevel';
import { Timer } from './Timer';
import { loadSpeedBooster } from './chars/SpeedBooster';
import { loadPortal } from './chars/Portal';
import { splashText } from './Splash';

export class GameManager {
    constructor(canvasSelector) {
        this.canvasSelector = canvasSelector;
        this.context = canvasSelector.getContext('2d');
        
        this.levels = [
            // levels.initial, 
            levels.first, 
            levels.second
        ];
        this.level = undefined;
        this.levelIdx = -1;

        this.camera = new Camera();
        this.timer = new Timer();

        this.levelSelector = document.getElementById('current-level');

        // TODO: dev
        this.canvasSelector.classList.toggle('blur', false);  
        document.querySelector('.play-block').remove();

        this.start();
    }

    async start() {
        this.timer.start();
        
        this.charsFactory = await loadChars();
        this.loadLevel = await createLevelLoader(this.charsFactory);
        this.playerEnv = createPlayerEnv(this);

        this.playerEnv.playerController.onLevelComplete(this.nextLevel.bind(this));
        this.playerEnv.playerController.onLevelFail(this.restartLevel.bind(this));

        this.nextLevel();
    }

    async restartLevel() {
        return this.runLevel(this.levelIdx);
    }

    async nextLevel() {
        this.levelIdx += 1;
        return this.runLevel(this.levelIdx);
    }

    async runLevel(levelIdx) {     
        // this.canvasSelector.classList.toggle('blur', true);

        this.playerEnv.playerController.commitScore();

        this.levelSelector.innerHTML = levelIdx;

        const initLevel = this.levels[levelIdx];
        const {level, startLevel} = await initLevel(this);
        this.level = level;

        if(level.name) {
            // await splashText(level.name)
        }
        
        // this.canvasSelector.classList.toggle('blur', false);    
                
        startLevel();      
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
        loadPortal().then(addFactory('portal')),
        loadBullet().then(addFactory('bullet'))
    ]).then(() => entityFactories);
}
