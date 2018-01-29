import {createPlayerEnv} from './createPlayerEnv'
import { splashText } from '../Splash';

const levelSpec = {
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
                        [
                            24, 10,
                            6, 1
                        ],
                        [
                            38, 10,
                            4, 1
                        ],
                        [
                            51, 2,
                            4, 1
                        ],
                        [
                            55, 2,
                            6, 1
                        ],
                        [
                            60, 1,
                            6, 1
                        ],
                        [
                            64, 5,
                            8, 1
                        ],
                        [
                            73, 10,
                            5, 1
                        ],
                        [
                            87, 2,
                            8, 1
                        ],
                        [
                            93, 4,
                            6, 1
                        ],
                        [
                            101, 19,
                            6, 1
                        ],
                        [
                            124, 10,
                            6, 1
                        ],
                        [
                            138, 10,
                            4, 1
                        ],
                        [
                            151, 2,
                            4, 1
                        ],
                        [
                            155, 2,
                            6, 1
                        ],
                        [
                            160, 1,
                            6, 1
                        ],
                        [
                            164, 5,
                            8, 1
                        ],
                        [
                            173, 10,
                            5, 1
                        ],
                        [
                            187, 2,
                            8, 1
                        ],
                        [
                            193, 1,
                            6, 1
                        ]
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
    const unicorn = playerEnv.playerController.player;
    level.entities.add(playerEnv);

    ['keydown', 'keyup'].forEach(eventName => {
        window.addEventListener(eventName, e => {
            if (e.code === 'Space') {
                const keyState = e.type === 'keydown' ? 1 : 0;

                if (keyState > 0) {
                    unicorn.jump.start();
                } else {
                    unicorn.jump.cancel();
                }
            } else if(e.code === 'KeyF') {
                const fireball = game.charsFactory.bullet(unicorn);
                fireball.pos.x = unicorn.pos.x + 50;
                fireball.pos.y = unicorn.pos.y + 30;
                fireball.vel.x = 1000;
                level.entities.add(fireball);
            } 
            else {
                unicorn.jump.cancel();
            }
        });
    });

    // level.sounds.get('music').playOnce();

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
