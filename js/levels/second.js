const levelSpec = {
    name: 'Level 2',
    layers: [
        {
            tiles: [
                {
                    ranges: [
                        // [
                        //     0, 1,
                        //     3, 4
                        // ],
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


export async function second(game) {
    const level = await game.loadLevel(levelSpec);
    const playerEnv = game.playerEnv;
    // const unicorn = game.entityFactory.unicorn();
    const unicorn = playerEnv.playerController.player;
    // playerEnv.playerController.setPlayer(unicorn);
    level.entities.add(playerEnv);
    level.entities.add(unicorn);

    function startLevel() {
        unicorn.pos.x = -1000;
        unicorn.pos.y = -200;
        // unicorn.vel.x = 2000

        game.cameraController.focus.follow(unicorn);

        game.timer.update = (deltaTime, time) => {
            level.update(deltaTime);
            game.cameraController.update(deltaTime, time);
            level.comp.draw(game.context, game.camera);
        };
    }

    return {
        level, startLevel
    }
}
