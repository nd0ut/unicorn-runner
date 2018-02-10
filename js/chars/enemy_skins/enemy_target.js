export default {
    imageURL: require('../../../img/enemies/targets.png'),
    skinName: 'target',
    size: [50, 75],
    offset: [25, 18],

    frames: [
        {
            name: 'idle-1',
            rect: [91 * 0, 0, 91, 104]
        },
        {
            name: 'idle-2',
            rect: [91 * 1, 0, 91, 104]
        },
        {
            name: 'idle-3',
            rect: [91 * 2, 0, 91, 104]
        },
        {
            name: 'idle-4',
            rect: [91 * 3, 0, 91, 104]
        },
        {
            name: 'idle-5',
            rect: [91 * 4, 0, 91, 104]
        },
        {
            name: 'idle-6',
            rect: [91 * 5, 0, 91, 104]
        },
        {
            name: 'idle-7',
            rect: [91 * 5, 104 * 1, 91, 104]
        },
        {
            name: 'idle-8',
            rect: [91 * 4, 104 * 1, 91, 104]
        },
        {
            name: 'idle-9',
            rect: [91 * 3, 104 * 1, 91, 104]
        },
        {
            name: 'idle-10',
            rect: [91 * 2, 104 * 1, 91, 104]
        },
        {
            name: 'idle-11',
            rect: [91 * 1, 104 * 1, 91, 104]
        },
        {
            name: 'idle-12',
            rect: [91 * 0, 104 * 1, 91, 104]
        },

        {
            name: 'death-1',
            rect: [91 * 5, 104 * 3, 91, 104]
        },
        {
            name: 'death-2',
            rect: [91 * 4, 104 * 3, 91, 104]
        },
        {
            name: 'death-3',
            rect: [91 * 3, 104 * 3, 91, 104]
        },
        {
            name: 'death-4',
            rect: [91 * 2, 104 * 3, 91, 104]
        },
        {
            name: 'death-5',
            rect: [91 * 1, 104 * 3, 95, 104]
        },
        {
            name: 'death-6',
            rect: [91 * 0, 104 * 3, 95, 104]
        }
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
                'idle-7',
                'idle-8',
                'idle-9',
                'idle-10',
                'idle-11',
                'idle-12'
            ]
        },
        {
            name: 'attack',
            frameLen: 0.1,
            frames: ['death-1', 'death-2', 'death-3', 'death-4', 'death-5', 'death-6']
        },

        {
            name: 'death',
            frameLen: 0.1,
            frames: ['death-1', 'death-2', 'death-3', 'death-4', 'death-5', 'death-6']
        }
    ]
};
