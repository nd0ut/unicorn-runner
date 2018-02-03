import * as levels from '../levels';
import { loadEditorLevel } from './loadEditorLevel';
import { firstLevelSpec } from '../levels/first';
import { Vec2 } from '../math';
import { TileResolver } from '../TileCreation';

export class LevelManager {
    constructor(editor) {
        this.editor = editor;

        this.levelSpecs = [firstLevelSpec];

        this.levelSpec = undefined;
        this.level = undefined;
        this.tileResolver = undefined;
    }

    async runLevel(levelIdx) {
        const levelSpec = this.levelSpecs[levelIdx];
        const { level, startLevel } = await loadEditorLevel(this.editor, levelSpec);

        this.level = level;
        this.levelSpec = levelSpec;
        this.tileResolver = new TileResolver(this.level.tileGrid);

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

    pickTilePos(pos) {
        if (!this.tileResolver) {
            return;
        }
        const tileIndexes = this.pickTileIndex(pos);
        const tilePos = this.tileResolver.getTilePos(tileIndexes.x, tileIndexes.y);
        return tilePos;
    }

    pickTileIndex(pos) {
        const indexX = this.tileResolver.toIndex(pos.x);
        const indexY = this.tileResolver.toIndex(pos.y);

        return new Vec2(indexX, indexY);
    }

    update() {

    }
}
