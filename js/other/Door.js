import { Entity, Trait } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Physics, Pickable, Solid, Impassable } from '../Traits';
import { rand, Vec2 } from '../math';
import { defineGameObject } from '../defineGameObject';

const DOOR = {
    size: [120, 165],
    offset: [0, 0],

    skinName: 'default',

    imageURL: require('../../img/other/doors.png'),
    frames: [
        {
            name: 'idle',
            rect: [407, 41, 120, 165]
        },
        {
            name: 'open-1',
            rect: [407, 287, 120, 165]
        },
        {
            name: 'open-2',
            rect: [407, 535, 120, 165]
        },
        {
            name: 'open-3',
            rect: [407, 700, 120, 165]
        }
    ],
    animations: [
        {
            name: 'open',
            frameLen: 0.1,
            frames: ['open-1', 'open-2', 'open-3']
        }
    ]
};

class BehaviorDoor extends Trait {
    constructor() {
        super('behavior');

        this.opened = false;
        this.openedTime = 0;
        this.openDuration = 0.3;
    }

    open() {
        this.queue(() => {
            this.opened = true;
            this.entity.impassable.deactivate();
        });
    }

    close() {
        this.queue(() => {
            this.opened = false;
            this.entity.impassable.activate();
        });
    }

    update(entity, deltaTime, level) {
        if(this.opened && this.openedTime < this.openDuration) {
            this.openedTime += deltaTime;
        }
    }

    collides(us, them, side) {
        if(!this.opened) {
            them.obstruct(them, side);
        }
    }
}

export const loadDoor = defineGameObject('door', {
    spriteSpecs: [DOOR],

    traits: () => [
        new Impassable(),
        new BehaviorDoor()
    ],
    animations: sprite => {
        const openAnim = sprite.animations.get('open');

        return door => {
            if (door.behavior.opened) {
                return openAnim(door.behavior.openedTime);
            }

            return 'idle';
        };
    }
});
