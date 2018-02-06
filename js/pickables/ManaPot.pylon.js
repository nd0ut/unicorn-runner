export const MANA_PYLON_SPRITE = {
    skinName: 'pylon',
    imageURL: require('../../img/pickables/mana_pylon.png'),
    frames: Array.from(new Array(10)).map((val, idx) => ({
        name: `idle-${idx + 1}`,
        rect: [45 * idx, 72, 45, 53]
    })),
    animations: [
        {
            name: 'idle',
            frameLen: 0.1,
            frames: [
                'idle-1',
                // 'idle-2',
                // 'idle-3',
                // 'idle-4',
                // 'idle-5',
                // 'idle-6',
                // 'idle-7',
                // 'idle-8',
                // 'idle-9',
                // 'idle-10',
                // 'idle-11',
                // 'idle-12',
                // 'idle-13',
                // 'idle-14',
                // 'idle-15',
            ]
        }
    ]
};
