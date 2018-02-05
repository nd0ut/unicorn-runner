import {Compositor} from './Compositor';
import {EntityCollider} from './EntityCollider';
import {TileCollider} from './TileCreation';
import { SoundManager } from './SoundManager';

export class Level {
    constructor(name) {
        this.name = name;

        this.gravity = 1500;
        this.totalTime = 0;
        this.distance = 0;
        this.freeze = false;

        this.comp = new Compositor();
        this.entities = new Set();
        this.namedEntities = new Map();

        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = undefined;

        this.collisionGrid = undefined;
        this.backgroundGrid = undefined;
    }

    setCollisionGrid(matrix) {
        this.collisionGrid = matrix;
        this.tileCollider = new TileCollider(matrix);
    }

    setBackgroundGrid(matrix) {
        this.backgroundGrid = matrix;
    }

    setDistance(distance) {
        this.distance = distance;
    }

    update(deltaTime) {
        if(this.frozen) {
            return;
        }

        this.entities.forEach(entity => {
            entity.update(deltaTime, this);
        });

        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        });

        this.entities.forEach(entity => {
            entity.finalize();
        });

        this.totalTime += deltaTime;
    }
}
