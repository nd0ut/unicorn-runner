import { Camera } from './Camera';
import { loadEnemyBug } from './chars/EnemyBug';
import { loadRainbow } from './chars/Rainbow';
import { loadUnicorn } from './chars/Unicorn';
import { Entity } from './Entity';
import { createLevelLoader } from './loadLevel';
import { PlayerController } from './PlayerController';
import { Timer } from './Timer';

function loadChars() {
    const entityFactories = {};

    function addFactory(name) {
        return factory => entityFactories[name] = factory;
    }


    return Promise.all([
        loadUnicorn().then(addFactory('unicorn')),
        loadEnemyBug().then(addFactory('enemyBug')),
        loadRainbow().then(addFactory('rainbow')),
    ])
    .then(() => entityFactories);
}

function createPlayerEnv(playerEntity) {
    const playerEnv = new Entity();
    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerControl.setPlayer(playerEntity);
    playerEnv.addTrait(playerControl);
    return playerEnv;
}

async function main(canvas) {
    const context = canvas.getContext('2d');
    const charsFactory = await loadChars();
    const loadLevel = await createLevelLoader(charsFactory);
    const level = await loadLevel(require('./levels/default').default);
    const camera = new Camera();
    const unicorn = charsFactory.unicorn();
    const playerEnv = createPlayerEnv(unicorn);

    level.entities.add(playerEnv);

    ['keydown', 'keyup'].forEach(eventName => {
        window.addEventListener(eventName, event => {
            if (event.code === 'Space') {
                const keyState = event.type === 'keydown' ? 1 : 0;

                if (keyState > 0) {
                    unicorn.jump.start();
                } else {
                    unicorn.jump.cancel();
                }
            } else {
                unicorn.jump.cancel();
            }
        });
    });

    const timer = new Timer(1/60);
    timer.update = function update(deltaTime) {
        level.update(deltaTime);
        camera.pos.x = Math.max(0, unicorn.pos.x - 100);
        level.comp.draw(context, camera);
    }

    timer.start();
}

const canvas = document.getElementById('screen');
main(canvas);
