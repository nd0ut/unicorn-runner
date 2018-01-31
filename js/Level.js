import {Compositor} from './Compositor';
import {EntityCollider} from './EntityCollider';
import {TileCollider} from './TileCreation';
import { SoundManager } from './SoundManager';

export class Level {
    constructor(name = undefined) {
        this.name = name;

        this.gravity = 1500;
        this.totalTime = 0;
        this.distance = 0;

        this.comp = new Compositor();
        this.entities = new Set();
        this.namedEntities = new Map();

        this.entityCollider = new EntityCollider(this.entities);
        this.tileCollider = null;
    }

    setName(name) {
        this.name = name;
    }

    setCollisionGrid(matrix) {
        this.tileCollider = new TileCollider(matrix);
    }

    setDistance(distance) {
        this.distance = distance;
    }

    update(deltaTime) {
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
