import { Entity } from '../Entity';
import { loadSpriteSheet } from '../loaders';
import { Jump, Killable, Physics, Picker, Run, Solid, AutoJump } from '../Traits';

const UNICORN = {
    imageURL: require('../../img/unicorn_ham.png'),
    frames: [
        {
            name: 'idle',
            rect: [172*23, 0, 172, 142]
        },
        {
            name: 'run-1',
            rect: [172*24, 0, 172, 142]
        },
        {
            name: 'run-2',
            rect: [172*25, 0, 172, 142]
        },
        {
            name: 'run-3',
            rect: [172*26, 0, 172, 142]
        },
        {
            name: 'run-4',
            rect: [172*27, 0, 172, 142]
        },
        {
            name: 'run-5',
            rect: [172*28, 0, 172, 142]
        },
        {
            name: 'run-6',
            rect: [172*29, 0, 172, 142]
        },
        {
            name: 'run-7',
            rect: [172*30, 0, 172, 142]
        },
        {
            name: 'run-8',
            rect: [172*31, 0, 172, 142]
        },
        {
            name: 'break',
            rect: [172*23, 0, 172, 142]
        },
        {
            name: 'jump-1',
            rect: [172*19, 0, 172, 142]
        },
        {
            name: 'jump-2',
            rect: [172*20, 0, 172, 142]
        },
        {
            name: 'jump-3',
            rect: [172*21, 0, 172, 142]
        },
        {
            name: 'jump-4',
            rect: [172*22, 0, 172, 142]
        },
        {
            name: 'fall-1',
            rect: [172*24, 0, 172, 142]
        },
        {
            name: 'fall-2',
            rect: [172*25, 0, 172, 142]
        },
        {
            name: 'death-1',
            rect: [172*8, 0, 172, 142]
        },
        {
            name: 'death-2',
            rect: [172*9, 0, 172, 142]
        },
        {
            name: 'death-3',
            rect: [172*10, 0, 172, 142]
        },
        {
            name: 'death-4',
            rect: [172*11, 0, 172, 142]
        },
        {
            name: 'death-5',
            rect: [172*12, 0, 172, 142]
        },
        {
            name: 'death-6',
            rect: [172*13, 0, 172, 142]
        },
        {
            name: 'death-7',
            rect: [172*8, 0, 172, 142]
        },
        {
            name: 'death-8',
            rect: [172*8, 0, 172, 142]
        },
        {
            name: 'death-9',
            rect: [172*8, 0, 172, 142]
        }
    ],

    animations: [
        {
            name: 'run',
            frameLen: 20,
            frames: ['run-1', 'run-2', 'run-3', 'run-4', 'run-5', 'run-6', 'run-7', 'run-8']
        },
        {
            name: 'jump',
            frameLen: 0.2,
            frames: ['jump-1', 'jump-2', 'jump-3', 'jump-4']
        },
        {
            name: 'fall',
            frameLen: 0.2,
            frames: ['fall-1', 'fall-2']
        },
        {
            name: 'death',
            frameLen: 0.2,
            frames: ['death-1', 'death-2', 'death-3', 'death-4', 'death-5', 'death-6', 'death-7', 'death-8', 'death-9']
        }
    ]
};

export function loadUnicorn() {
    return loadSpriteSheet(UNICORN).then(createUnicornFactory);
}

function createUnicornFactory(sprite) {
    const runAnim = sprite.animations.get('run');
    const jumpAnim = sprite.animations.get('jump');
    const fallAnim = sprite.animations.get('fall');
    const deathAnim = sprite.animations.get('death');

    function routeFrame(unicorn) {
        if (unicorn.killable.dead) {
            return deathAnim(unicorn.killable.deadTime);
        }

        if (unicorn.jump.jumpingUp) {
            return jumpAnim(unicorn.jump.engageTime);
        }

        if (unicorn.jump.fallingDown) {
            return fallAnim(unicorn.jump.engageTime);
        }

        if (unicorn.run.distance > 0) {
            return runAnim(unicorn.run.distance);
        }

        return 'idle';
    }

    function drawUnicorn(context) {
        sprite.draw(routeFrame(this), context, 0, 0, this.run.heading < 0);
    }

    return function createUnicorn() {
        const unicorn = new Entity();
        unicorn.size.set(120, 140);
        unicorn.offset.x = 20;

        unicorn.addTrait(new Physics());
        unicorn.addTrait(new Solid());
        unicorn.addTrait(new Run());
        unicorn.addTrait(new Jump());
        unicorn.addTrait(new Picker());
        unicorn.addTrait(new Killable());

        unicorn.killable.removeAfter = 1;

        unicorn.draw = drawUnicorn;

        return unicorn;
    };
}
