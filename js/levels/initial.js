import { getRandomInt } from '../math';
import { AutoJump } from '../Traits';
import { createPlayerEnv } from './createPlayerEnv';

const N = 100;

function getEntities() {
    const choose = ['rainbow', 'speedbooster'];

    const entities = Array.from(Array(N)).map((val, idx) => ({
        name: choose[getRandomInt(0, choose.length - 1)],
        pos: [idx * getRandomInt(100, 2000) + 500, 100]
    }));

    return entities;
}

function getRanges() {
    let h = 5;
    let mul = 1;
    let x = 0;

    const ranges = Array.from(Array(N)).map(() => {
        mul = h === 3 ? 1 : mul;
        mul = h === 7 ? -1 : mul;

        const platformWidth = getRandomInt(6, 12);

        const range = [x, platformWidth, h, 1];
        h = h + mul;
        x = x + platformWidth + 1;

        return range;
    });

    return ranges;
}

const ranges = getRanges();
const entities = getEntities();

const levelConfig = {
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

export async function initial(game) {
    const level = await game.loadLevel(levelConfig);

    const unicorn = game.charsFactory.unicorn();
    unicorn.addTrait(new AutoJump());

    const playerEnv = createPlayerEnv(unicorn);
    level.entities.add(playerEnv);

    game.timer.update = deltaTime => {
        level.update(deltaTime);
        game.camera.pos.x = Math.max(0, unicorn.pos.x - 100);
        level.comp.draw(game.context, game.camera);
    };

    const onPlay = () => {
        document.querySelector('.play-block').remove();
        game.nextLevel();
    };

    document.querySelector('.play-btn').addEventListener('click', onPlay);
}
