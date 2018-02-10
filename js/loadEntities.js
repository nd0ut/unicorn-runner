import { loadEnemy } from './chars/Enemy';
import { loadUnicorn } from './chars/Unicorn';
import { loadUfo } from './other/Ufo';
import { loadManaPot } from './pickables/ManaPot';
import { loadPortal } from './pickables/Portal';
import { loadRainbow } from './pickables/Rainbow';
import { loadSpeedBooster } from './pickables/SpeedBooster';
import { loadBullet } from './weapon/Bullet';
import { loadDoor } from './other/Door';

export function loadEntities() {
    const entityFactories = {};

    function addFactory(name) {
        return factory => (entityFactories[name] = factory);
    }

    return Promise.all([
        loadUnicorn().then(addFactory('unicorn')),
        loadEnemy().then(addFactory('enemy')),
        loadRainbow().then(addFactory('rainbow')),
        loadSpeedBooster().then(addFactory('speedBooster')),
        loadPortal().then(addFactory('portal')),
        loadBullet().then(addFactory('bullet')),
        loadManaPot().then(addFactory('manaPot')),
        loadUfo().then(addFactory('ufo')),
        loadDoor().then(addFactory('door'))
    ]).then(() => entityFactories);
}
