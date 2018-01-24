import {createPlayerEnv} from './createPlayerEnv'
import { splashText } from '../Splash';

const levelSpec = {
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
                        [
                            24, 10,
                            6, 1
                        ],
                        [
                            38, 10,
                            4, 1
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
    const unicorn = game.unicorn;
    const playerEnv = game.playerEnv;
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

    game.timer.update = deltaTime => {
        level.update(deltaTime);
        game.camera.pos.x = Math.max(0, unicorn.pos.x - 100);
        level.comp.draw(game.context, game.camera);
         
        if (unicorn.pos.x > level.distance) {
            splashText('Level 2');
            game.nextLevel();
        }
    };
}
