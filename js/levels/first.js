import { splashText } from '../Splash';
import { Striker } from '../Traits';

const spec = {
    name: 'Level 1',
    sounds: [
        {
            url: require('../../sounds/hooked-on-a-feeling.mp3'),
            name: 'music'
        }
    ],
    layers: [
        {
            tiles: [
                {
                    ranges: [
                        // [0, 0],
                        [1, 19, 6, 1],
                        [24, 10, 6, 1],
                        [38, 10, 4, 1],
                        [51, 2, 4, 1],
                        [55, 2, 6, 1],
                        [60, 1, 6, 1],
                        [64, 5, 8, 1],
                        [73, 10, 5, 1],
                        [87, 2, 8, 1],
                        [93, 4, 6, 1],
                        [101, 19, 6, 1],
                        [124, 10, 6, 1],
                        [138, 10, 4, 1],
                        [151, 2, 4, 1],
                        [155, 2, 6, 1],
                        [160, 1, 6, 1],
                        [164, 5, 8, 1],
                        [173, 10, 5, 1],
                        [187, 2, 8, 1],
                        [193, 1, 6, 1]
                    ]
                }
            ]
        }
    ],
    entities: [
            {
                name: 'rainbow',
                pos: [408, 0]
            },
            {
                name: 'speedBooster',
                pos: [780, 0]
            },
            {
                name: 'manaPot',
                pos: [1608, 0]
            },
            {
                name: 'enemyBug',
                pos: [1800, 0]
            },
            {
                name: 'enemyBug',
                pos: [2580, 0]
            },
            {
                name: 'portal',
                pos: [3288, 0]
            },
            {
                name: 'enemyBug',
                pos: [3960, 0]
            },
            {
                name: 'rainbow',
                pos: [4448, 0]
            },
            {
                name: 'enemyBug',
                pos: [4620, 0]
            },
            {
                name: 'rainbow',
                pos: [5588, 0]
            },
            {
                name: 'rainbow',
                id: 'boss',
                pos: [7388, 0]
            }
    ]
};

async function init(game) {
    const level = await game.loadLevel(spec);
    const playerEnv = game.playerEnv;
    const unicorn = game.entityFactory.unicorn();
    level.entities.add(playerEnv);

    function startLevel() {
        playerEnv.playerController.setPlayer(unicorn);
        game.cameraController.focus.follow(unicorn);

        // level.sounds.get('music').playOnce();

        game.timer.update = (deltaTime, time) => {
            level.update(deltaTime);
            game.levelManager.update(deltaTime, time, level);
            game.cameraController.update(deltaTime, time, level);
            level.comp.draw(game.context, game.camera);
        };
    }

    return {
        level, startLevel
    };
}

export const first = {
    spec,
    init
}
