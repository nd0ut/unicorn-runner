import { splashText } from '../Splash';
import { Striker } from '../Traits';
import { defineLevel } from './defineLevel';

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
        { name: 'portal', pos: [311.59956084799416, 240] },
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
