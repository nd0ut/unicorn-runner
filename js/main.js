import { Camera } from './Camera';
import { loadEnemyBug } from './chars/EnemyBug';
import { loadRainbow } from './chars/Rainbow';
import { loadUnicorn } from './chars/Unicorn';
import { Entity } from './Entity';
import { createLevelLoader } from './loadLevel';
import { PlayerController } from './PlayerController';
import { Timer } from './Timer';
import { Game} from './Game';

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

export function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

export async function main(canvas) {
    const context = canvas.getContext('2d');
    const game = new Game(context);
}
