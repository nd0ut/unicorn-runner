import { rand } from '../math';
import { createPlayerEnv } from '../player/createPlayerEnv';
import { AutoJump } from '../Traits';

const N = 50;

function getEntities() {
    const choose = ['speedBooster'];
    // const choose = ['rainbow', 'speedBooster', 'portal'];
    // const choose = ['portal'];

    const entities = Array.from(Array(N)).map((val, idx) => ({
        name: choose[rand.int(0, choose.length - 1)],
        pos: [idx * rand.int(100, 2000) + 500, 100]
    }));

    return entities;
}

function getRanges() {
    let h = 5;
    let mul = 1;
    let x = 0;

    const ranges = Array.from(Array(N)).map(() => {
        mul = h === 0 ? 1 : mul;
        mul = h === 7 ? -1 : mul;

        const platformWidth = rand.int(6, 12);

        const range = [x, platformWidth, h, 1];
        h = h + mul;
        x = x + platformWidth + 1;

        return range;
    });

    return ranges;
}

const ranges = getRanges();
const entities = getEntities();

const spec = {
    layers: [
        {
            tiles: [
                {
                    ranges
                }
            ]
        }
    ],
    entities
};

async function init(game) {
    const level = await game.loadLevel(spec);

    const unicorn = game.entityFactory.unicorn();
    unicorn.addTrait(new AutoJump());

    const playerEnv = createPlayerEnv(game);

    level.entities.add(playerEnv);

    function checkFinish() {
        if (unicorn.pos.x > level.distance) {
            unicorn.pos.x = 64;
            unicorn.pos.y = 64;
        }
    }

    function startLevel() {
        playerEnv.playerController.setPlayer(unicorn);
        game.cameraController.focus.follow(unicorn);

        game.timer.update = (deltaTime, time) => {
            checkFinish();
            level.update(deltaTime);
            game.cameraController.update(deltaTime, time, level);
            level.comp.draw(game.context, game.camera);
        };

        const onPlayClick = () => {
            document.querySelector('.play-block').remove();
            game.levelManager.nextLevel();
        };

        document.querySelector('.play-btn').addEventListener('click', onPlayClick);
    }

    return {
        level, startLevel
    }
}

export const initial = {
    spec, init
}