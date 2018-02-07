import { splashText } from '../Splash';
import { Striker } from '../Traits';
import { defineLevel } from './defineLevel';

const spec = {
    name: 'Level 1',
    background: {
        images: {
            sky: require('../../img/backgrounds/clouds.png'),
            back: require('../../img/backgrounds/mountains.png'),
            front: require('../../img/backgrounds/forest.png')
        },
        gradient: camPos => {
            const step = ['#ffffff', 0];
            const step2 = ['#ffffff', 1];
            return [step, step2];
        }
    },
    sounds: [
        {
            url: require('../../sounds/hooked-on-a-feeling.mp3'),
            name: 'music'
        }
    ],
    tileSprite: {
        imageURL: require('../../img/tiles/bf2.png'),
        tileW: 60,
        tileH: 60,
        frames: [
            {
                name: 'default',
                rect: [340, 375, 60, 60]
            },
            {
                name: 'left',
                rect: [252, 375, 60, 60]
            }
        ]
    },
    tiles: [
        [4, 6],
        [5, 6],
        [6, 6],
        [7, 6],
        [8, 6],
        [9, 6],
        [10, 6],
        [11, 6],
        [12, 6],
        [13, 6],
        [14, 6],
        [15, 6],
        [16, 6],
        [17, 6],
        [18, 6],
        [19, 6],
        [24, 6],
        [25, 6],
        [26, 6],
        [27, 6],
        [28, 6],
        [29, 6],
        [30, 6],
        [31, 6],
        [32, 6],
        [33, 6],
        [38, 4],
        [39, 4],
        [40, 4],
        [41, 4],
        [42, 4],
        [43, 4],
        [44, 4],
        [45, 4],
        [46, 4],
        [47, 4],
        [51, 4],
        [52, 4],
        [55, 6],
        [56, 6],
        [60, 6],
        [64, 8],
        [65, 8],
        [66, 8],
        [67, 8],
        [68, 8],
        [73, 5],
        [74, 5],
        [75, 5],
        [76, 5],
        [77, 5],
        [78, 5],
        [79, 5],
        [80, 5],
        [81, 5],
        [82, 5],
        [87, 8],
        [88, 8],
        [93, 6],
        [94, 6],
        [95, 6],
        [96, 6],
        [101, 6],
        [102, 6],
        [103, 6],
        [104, 6],
        [105, 6],
        [106, 6],
        [107, 6],
        [108, 6],
        [109, 6],
        [110, 6],
        [111, 6],
        [112, 6],
        [113, 6],
        [114, 6],
        [115, 6],
        [116, 6],
        [117, 6],
        [118, 6],
        [119, 6],
        [124, 6],
        [125, 6],
        [126, 6],
        [127, 6],
        [128, 6],
        [129, 6],
        [130, 6],
        [131, 6],
        [132, 6],
        [133, 6],
        [138, 4],
        [139, 4],
        [140, 4],
        [141, 4],
        [142, 4],
        [143, 4],
        [144, 4],
        [145, 4],
        [146, 4],
        [147, 4],
        [151, 4],
        [152, 4],
        [155, 6],
        [156, 6],
        [160, 6],
        [164, 8],
        [165, 8],
        [166, 8],
        [167, 8],
        [168, 8],
        [173, 5],
        [174, 5],
        [175, 5],
        [176, 5],
        [177, 5],
        [178, 5],
        [179, 5],
        [180, 5],
        [181, 5],
        [182, 5],
        [187, 8],
        [188, 8],
        [193, 6]
    ],
    entities: [
        { name: 'portal', pos: [92.5995608479941, 268] },
        { name: 'speedBooster', pos: [1082.665480514874, 245.5] },
        { name: 'manaPot', pos: [1608, 0] },
        { name: 'enemyBug', pos: [1800, 0] },
        { name: 'enemyBug', pos: [2580, 0] },
        { name: 'portal', pos: [3288, 0] },
        { name: 'enemyBug', pos: [3960, 0] },
        { name: 'rainbow', pos: [4448, 0] },
        { name: 'enemyBug', pos: [4620, 0] },
        { name: 'rainbow', pos: [5588, 0] },
        { name: 'rainbow', pos: [7388, 0] }
    ]
};

export default defineLevel(spec, {
    onStart: (game, level) => {
        // level.sounds.get('music').playOnce();
    }
});
