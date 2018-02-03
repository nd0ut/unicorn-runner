import * as levels from '../levels';
import { loadEditorLevel } from './loadEditorLevel';
import { Vec2 } from '../math';
import { TileResolver } from '../TileCreation';

export class EditorLevelManager {
    constructor(editor) {
        this.editor = editor;

        this.levelSpec = undefined;
        this.level = undefined;
        this.tileResolver = undefined;
    }

    async runLevel(spec) {
        const { level, startLevel } = await loadEditorLevel(this.editor, spec);

        this.level = level;
        this.levelSpec = spec;
        this.tileResolver = new TileResolver(this.level.tileGrid);

        this.disableTraits();

        startLevel();
    }

    exportRanges() {
        const ranges = [];

        for (const { x, y, tile } of this.level.tileGrid) {
            ranges.push([x, y]);
        }

        return ranges;
    }

    disableTraits(level) {
        for (const entity of this.level.entities) {
            entity.physics && entity.removeTrait('physics');
            entity.solid && entity.removeTrait('solid');
            entity.run && entity.removeTrait('run');
        }
    }

    pickEntity(pos) {
        for (const entity of this.level.entities) {
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
}
