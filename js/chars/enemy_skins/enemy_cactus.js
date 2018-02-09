export default {
    imageURL: require('../../../img/enemies/cactus.png'),
    skinName: 'cactus',
    frames: [
        {
            name: 'idle-1',
            rect: [61 * 0, -8, 61, 73]
        },
        {
            name: 'idle-2',
            rect: [61 * 1 + 1, -8, 61, 73]
        },
        {
            name: 'idle-3',
            rect: [61 * 2 + 1, -8, 61, 73]
        },
        {
            name: 'idle-4',
            rect: [61 * 3 + 1, -8, 61, 73]
        },
        {
            name: 'idle-5',
            rect: [61 * 4 + 4, -7, 61, 73]
        },
        {
            name: 'idle-6',
            rect: [61 * 5 + 9, -7, 61, 73]
        },

        {
            name: 'attack-1',
            rect: [197, 215, 61, 73]
        },
        {
            name: 'attack-2',
            rect: [110, 215, 75, 73]
        },
        {
            name: 'attack-3',
            rect: [14, 215, 75, 73]
        },

        {
            name: 'death-1',
            rect: [197 + 63 * 0, 216, 63, 73]
        },
        {
            name: 'death-2',
            rect: [197 + 63 * 1, 216, 63, 73]
        },
        {
            name: 'death-3',
            rect: [197 + 63 * 2, 216, 63, 73]
        },
        {
            name: 'death-4',
            rect: [197 + 63 * 3, 216, 63, 73]
        },
        {
            name: 'death-5',
            rect: [197 + 63 * 4, 216, 63, 73]
        },
        {
            name: 'death-6',
            rect: [197 + 63 * 5, 216, 63, 73]
        },
    ],
    animations: [
        {
            name: 'idle',
            frameLen: 0.2,
            frames: [
                'idle-1',
                'idle-2',
                'idle-3',
                'idle-4',
                'idle-5',
                'idle-6',
            ]
        },
        {
            name: 'attack',
            frameLen: 0.1,
            frames: [
                'attack-1',
                'attack-2',
                'attack-3',
            ]
        },

        {
            name: 'death',
            frameLen: 0.1,
            frames: [
                'death-1',
                'death-2',
                'death-3',
                'death-4',
                'death-5',
                'death-6',                
            ]
        }
    ]
}
