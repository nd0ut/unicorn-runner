import { splashText } from '../Splash';
import { Striker } from '../Traits';
import { defineLevel } from './defineLevel';
import { clamp } from '../math';

const spec = {
    name: 'warm up',
    spawn: [96, 64],
    background: {
        images: {
            sky: require('../../img/backgrounds/clouds.png'),
            back: require('../../img/backgrounds/mountains.png'),
            front: require('../../img/backgrounds/forest.png')
        },
        gradient: camPos => {
            return [
                ['#256bcc', 0],
                ['#2278c6', clamp(0.4 - camPos.y * 0.0001, 0, 0.8)],
                ['#00c7a4', 0.8]
            ];
        }
    },
    sounds: [
        {
            url: require('../../sounds/hooked-on-a-feeling.mp3'),
            name: 'music'
        }
    ],
    tileSprite: {
        imageURL: require('../../img/tiles/y5lxj.png'),
        tileW: 60,
        tileH: 60,
        frames: [
            {
                name: 'grass',
                rect: [60 * 0, 0, 60, 60]
            },
            {
                name: 'stone',
                rect: [60 * 1, 0, 60, 60]
            },
            {
                name: 'dirt',
                rect: [60 * 2, 0, 60, 60]
            },
            {
                name: 'default',
                rect: [60 * 3, 0, 60, 60]
            },

            {
                name: 'stone2',
                rect: [60 * 0, 60, 60, 60]
            },
            {
                name: 'wood',
                rect: [60 * 1, 60, 60, 60]
            },
            {
                name: 'sand',
                rect: [60 * 2, 60, 60, 60]
            }
        ]
    },
    tiles: [
        ['default', 2, 6],
        ['default', 3, 6],
        ['default', 4, 6],
        ['default', 5, 6],
        ['default', 6, 6],
        ['default', 7, 6],
        ['default', 8, 6],
        ['default', 9, 6],
        ['default', 10, 6],
        ['default', 11, 6],
        ['default', 12, 6],
        ['default', 13, 6],
        ['default', 14, 6],
        ['default', 15, 6],
        ['default', 16, 6],
        ['default', 17, 6],
        ['default', 18, 6],
        ['default', 19, 6],
        ['default', 26, 6],
        ['default', 27, 6],
        ['default', 28, 6],
        ['default', 29, 6],
        ['default', 30, 6],
        ['default', 31, 6],
        ['default', 32, 6],
        ['default', 38, 4],
        ['default', 39, 4],
        ['default', 40, 4],
        ['default', 41, 4],
        ['default', 42, 4],
        ['default', 43, 4],
        ['default', 44, 4],
        ['default', 45, 4],
        ['default', 46, 4],
        ['default', 47, 4],
        ['default', 51, 4],
        ['default', 52, 4],
        ['default', 53, 4],
        ['default', 55, 6],
        ['default', 56, 6],
        ['wood', 60, 6],
        ['default', 64, 8],
        ['default', 65, 8],
        ['default', 66, 8],
        ['default', 67, 8],
        ['default', 68, 8],
        ['default', 74, 5],
        ['default', 75, 5],
        ['default', 76, 5],
        ['default', 77, 5],
        ['default', 78, 5],
        ['default', 79, 5],
        ['default', 80, 5],
        ['default', 81, 5],
        ['default', 82, 5],
        ['default', 87, 8],
        ['default', 88, 8],
        ['default', 93, 6],
        ['default', 94, 6],
        ['default', 95, 6],
        ['default', 96, 6],
        ['default', 101, 6],
        ['default', 102, 6],
        ['default', 103, 6],
        ['default', 104, 6],
        ['default', 105, 6],
        ['default', 106, 6],
        ['default', 107, 6],
        ['default', 108, 6],
        ['default', 109, 6],
        ['default', 110, 6],
        ['default', 111, 6],
        ['default', 112, 6],
        ['default', 113, 6],
        ['default', 114, 6],
        ['default', 115, 6],
        ['default', 116, 6],
        ['default', 117, 6],
        ['default', 118, 6],
        ['default', 119, 6],
        ['default', 124, 6],
        ['default', 125, 6],
        ['default', 126, 6],
        ['default', 127, 6],
        ['default', 128, 6],
        ['default', 129, 6],
        ['default', 130, 6],
        ['default', 131, 6],
        ['default', 132, 6],
        ['default', 133, 6],
        ['default', 138, 4],
        ['default', 139, 4],
        ['default', 140, 4],
        ['default', 141, 4],
        ['default', 142, 4],
        ['default', 143, 4],
        ['default', 144, 4],
        ['default', 145, 4],
        ['default', 146, 4],
        ['default', 147, 4],
        ['default', 151, 4],
        ['default', 152, 4],
        ['default', 155, 6],
        ['default', 156, 6],
        ['wood', 160, 6],
        ['default', 164, 8],
        ['default', 165, 8],
        ['default', 166, 8],
        ['default', 167, 8],
        ['default', 168, 8],
        ['default', 173, 5],
        ['default', 174, 5],
        ['default', 175, 5],
        ['default', 176, 5],
        ['default', 177, 5],
        ['default', 178, 5],
        ['default', 179, 5],
        ['default', 180, 5],
        ['default', 181, 5],
        ['default', 182, 5],
        ['default', 187, 8],
        ['default', 188, 8],
        ['default', 194, 6],
        ['dirt', 194, 7],
        ['dirt', 194, 8],
        ['stone', 194, 9],
        ['default', 195, 6],
        ['dirt', 195, 7],
        ['dirt', 195, 8],
        ['stone', 195, 9],
        ['default', 196, 6],
        ['dirt', 196, 7],
        ['dirt', 196, 8],
        ['stone', 196, 9],
        ['default', 197, 6],
        ['dirt', 197, 7],
        ['dirt', 197, 8],
        ['stone', 197, 9],
        ['default', 198, 6],
        ['dirt', 198, 7],
        ['dirt', 198, 8],
        ['stone', 198, 9],
        ['default', 199, 6],
        ['dirt', 199, 7],
        ['dirt', 199, 8],
        ['stone', 199, 9],
        ['default', 200, 6],
        ['dirt', 200, 7],
        ['dirt', 200, 8],
        ['stone', 200, 9],
        ['default', 201, 6],
        ['dirt', 201, 7],
        ['dirt', 201, 8],
        ['stone', 201, 9],
        ['default', 202, 6],
        ['dirt', 202, 7],
        ['dirt', 202, 8],
        ['stone', 202, 9],
        ['default', 203, 6],
        ['dirt', 203, 7],
        ['dirt', 203, 8],
        ['stone', 203, 9],
        ['default', 204, 6],
        ['dirt', 204, 7],
        ['dirt', 204, 8],
        ['stone', 204, 9],
        ['default', 205, 6],
        ['dirt', 205, 7],
        ['dirt', 205, 8],
        ['stone', 205, 9],
        ['default', 206, 6],
        ['dirt', 206, 7],
        ['dirt', 206, 8],
        ['stone', 206, 9],
        ['default', 207, 6],
        ['dirt', 207, 7],
        ['dirt', 207, 8],
        ['stone', 207, 9],
        ['default', 208, 6],
        ['dirt', 208, 7],
        ['dirt', 208, 8],
        ['stone', 208, 9],
        ['default', 209, 6],
        ['dirt', 209, 7],
        ['dirt', 209, 8],
        ['stone', 209, 9],
        ['default', 210, 6],
        ['dirt', 210, 7],
        ['dirt', 210, 8],
        ['stone', 210, 9],
        ['default', 211, 6],
        ['dirt', 211, 7],
        ['dirt', 211, 8],
        ['stone', 211, 9],
        ['default', 212, 6],
        ['dirt', 212, 7],
        ['dirt', 212, 8],
        ['stone', 212, 9]
    ],
    entities: [
        { name: 'speedBooster', pos: [769.6654805148739, 299.5] },
        { name: 'rainbow', pos: [1314.8304345700217, 43.5] },
        { name: 'enemy', skinName: 'cactus', pos: [1796, 285.75] },
        { name: 'enemy', skinName: 'cactus', pos: [2580, 0] },
        { name: 'rainbow', pos: [3183.8893762925363, -147.088566603083] },
        { name: 'enemy', skinName: 'cactus', pos: [3968, 405.75] },
        { name: 'rainbow', pos: [4610, -7] },
        { name: 'enemy', skinName: 'cactus', pos: [4620, 0] },
        { name: 'rainbow', pos: [5604, 37] },
        { name: 'enemy', skinName: 'cactus', pos: [6519.332364340603, 285] },
        { name: 'speedBooster', pos: [6663.277780038607, 302.5] },
        { name: 'rainbow', pos: [7388, 0] },
        { name: 'enemy', skinName: 'cactus', pos: [7721.990176118361, 286] },
        { name: 'enemy', skinName: 'cactus', pos: [9995.156915549245, 408] }
    ]
};

export default defineLevel(spec, {
    onStart: (game, level) => {
        // level.sounds.get('music').playOnce();
    },
    afterUpdate: onAfterUpdate()
});

function onAfterUpdate() {
    let firstJumpReached = false;

    return (game, level) => {
        const player = game.playerEnv.playerController.player;
        const firstJumpX = 500;

        const nearFirstJump = Math.abs(player.pos.x - firstJumpX) < 10;
        if (!firstJumpReached && nearFirstJump) {
            firstJumpReached = true;
            splashText('press space to jump', { size: 50, timeout: 2000 });
        }
    };
}
