export const MANA_BUBBLES_SPRITE = {
    skinName: 'default',
    imageURL: require('../../img/mana-potions.png'),
    frames: [
        {
            name: 'idle-1',
            rect: [0, 300, 95, 60]
        },
        {
            name: 'idle-2',
            rect: [95 * 1, 300, 95, 60]
        },
        {
            name: 'idle-3',
            rect: [95 * 2, 300, 95, 60]
        },
        {
            name: 'idle-4',
            rect: [95 * 3, 300, 95, 60]
        },
        {
            name: 'idle-5',
            rect: [95 * 4, 300, 95, 60]
        },

        {
            name: 'idle-6',
            rect: [0, 400, 95, 60]
        },
        {
            name: 'idle-7',
            rect: [95 * 1, 400, 95, 60]
        },
        {
            name: 'idle-8',
            rect: [95 * 2, 400, 95, 60]
        },
        {
            name: 'idle-9',
            rect: [95 * 3, 400, 95, 60]
        },
        {
            name: 'idle-10',
            rect: [95 * 4, 400, 95, 60]
        },

        {
            name: 'idle-11',
            rect: [0, 500, 95, 60]
        },
        {
            name: 'idle-12',
            rect: [95 * 1, 500, 95, 60]
        },
        {
            name: 'idle-13',
            rect: [95 * 2, 500, 95, 60]
        },
        {
            name: 'idle-14',
            rect: [95 * 3, 500, 95, 60]
        },
        {
            name: 'idle-15',
            rect: [95 * 4, 500, 95, 60]
        },
    ],
    animations: [
        {
            name: 'idle',
            frameLen: 0.1,
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
                'idle-12',
                'idle-13',
                'idle-14',
                'idle-15',
            ]
        }
    ]
};