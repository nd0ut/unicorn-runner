import {Vec2} from './math';
import {ClipBox} from './ClipBox';

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right'),
};

export class Trait {
    constructor(name) {
        this.NAME = name;
        this.tasks = [];
        this.entity = undefined;
    }

    finalize() {
        this.tasks.forEach(task => task());
        this.tasks.length = 0;
    }

    setEntity(entity) {
        this.entity = entity;
    }

    queue(task) {
        this.tasks.push(task);
    }

    collides(us, them) {

    }

    obstruct() {

    }

    update() {

    }
}

export class Entity {
    constructor(name) {
        this.name = name;
        this.pos = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.offset = new Vec2(0, 0);
        this.bounds = new ClipBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        this.traits = [];
    }

    addTrait(trait) {
        trait.setEntity(this);
        
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    collides(candidate) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate);
        });
    }

    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }

    draw() {

    }

    voice() {

    }

    finalize() {
        this.traits.forEach(trait => {
            trait.finalize();
        });
    }

    resetLifetime() {
        this.lifetime = 0;
    }

    update(deltaTime, level) {
        this.voice && this.voice();
        
        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level);
        });

        this.lifetime += deltaTime;
    }
}
