import {createPlayerEnv} from './createPlayerEnv'
import { splashText } from '../Splash';
import { Striker } from '../Traits';

const levelSpec = {
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
                        [
                            0, 1,
                            3, 4
                        ],
                        [
                            1, 19,
                            6, 1
                        ],
                    ]
                }
            ]
        }
    ],
    entities: [
        {
            name: "rainbow",
            pos: [408, 0]
        },
        {
            name: "enemyBug",
            pos: [780, 0]
        },
        {
            name: "rainbow",
            pos: [1608, 0]
        },
        {
            name: "enemyBug",
            pos: [1800, 0]
        },
        {
            name: "enemyBug",
            pos: [2580, 0]
        },
        {
            name: "rainbow",
            pos: [3288, 0]
        },
        {
            name: "enemyBug",
            pos: [3960, 0]
        },
        {
            name: "rainbow",
            pos: [4448, 0]
        },
        {
            name: "enemyBug",
            pos: [4620, 0]
        },
        {
            name: "rainbow",
            pos: [5588, 0]
        },
        {
            name: "rainbow",
            pos: [7388, 0]
        }
    ]
};


export async function first(game) {
    const level = await game.loadLevel(levelSpec);    
    const playerEnv = game.playerEnv;
    const unicorn = game.charsFactory.unicorn();
    playerEnv.playerController.setPlayer(unicorn);
    level.entities.add(playerEnv);
    level.entities.add(unicorn);

    function startLevel() {
        // level.sounds.get('music').playOnce();

        game.timer.update = deltaTime => {
            level.update(deltaTime);
            game.camera.pos.x = Math.max(0, unicorn.pos.x - 100);
            level.comp.draw(game.context, game.camera);
        };
    }

    return {
        level, startLevel
    };
}
