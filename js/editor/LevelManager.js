import * as levels from '../levels';
import { loadEditorLevel } from './loadEditorLevel';
import { firstLevelSpec } from '../levels/first';
import { Vec2 } from '../math';

export class LevelManager {
    constructor(editor) {
        this.editor = editor;

        this.levelSpecs = [firstLevelSpec];
        this.level = undefined;

        this.tiles = undefined;
    }

    async runLevel(levelIdx) {
        const { level, startLevel } = await loadEditorLevel(this.editor, this.levelSpecs[levelIdx]);
        this.level = level;

        this.disableTraits();
        
        startLevel();
    }

    disableTraits(level) {
        for (const entity of this.level.entities) {
            entity.physics && entity.removeTrait('physics');
            entity.solid && entity.removeTrait('solid');
            entity.run && entity.removeTrait('run');
        }
    }

    pickEntity(pos) {
        for(const entity of this.level.entities) {
            if (entity.bounds.contains(pos)) {
                return entity;
            }
        }
    }

    pickTileIndex(pos) {
        // const indexX = this.level.tileResolver.toIndex(pos.x);
        // const indexY = this.level.tileResolver.toIndex(pos.y);
        
        // return new Vec2(indexX, indexY);
    }

    update() {

    }
}
