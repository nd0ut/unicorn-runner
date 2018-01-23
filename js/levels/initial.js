import { getRandomInt } from '../math';
import { AutoJump } from '../Traits';
import {createPlayerEnv} from './createPlayerEnv'

function getEntities() {
    const entities = Array.from(Array(300)).map((val, idx) => ({
        name: 'rainbow',
        pos: [idx * getRandomInt(100, 1000), 0]
    }));

    return entities;
}

function getRanges() {
    let h = 3;
    let mul = 1;
    let x = 0;

    const entities = Array.from(Array(300)).map(() => {
        mul = h === 3 ? 1 : mul;
        mul = h === 7 ? -1 : mul;
        const platformWidth = getRandomInt(6, 12);
        const range = [x, platformWidth, h, 1];
        h = h + mul;
        x = x + platformWidth + 1;
        return range;
    });

    return entities;
}

const levelConfig = {
    layers: [
        {
            tiles: [
                {
                    ranges: getRanges()
                }
            ]
        }
    ],
    entities: getEntities()
};

export async function initial(game) {
    const level = await game.loadLevel(levelConfig);

    const unicorn = game.charsFactory.unicorn();
    unicorn.addTrait(new AutoJump());
    unicorn.run.speed = 50000;

    const playerEnv = createPlayerEnv(unicorn);
    level.entities.add(playerEnv);

    game.timer.update = deltaTime => {
        level.update(deltaTime);
        game.camera.pos.x = Math.max(0, unicorn.pos.x - 100);
        level.comp.draw(game.context, game.camera);
    };

    const onPlay = () => {
        document.querySelector('.play-block').remove();
        game.levelsSequence.next();
    };

    document.querySelector('.play-btn').addEventListener('click', onPlay);
}
