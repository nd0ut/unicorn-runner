import { Vec2 } from '../math';

export class Picker {
    constructor(editor) {
        this.editor = editor;
    }

    get tileResolver() {
        return this.editor.tileResolver;
    }

    get level() {
        return this.editor.level;
    }

    exportRanges() {
        const ranges = [];

        for (const { x, y, tile } of this.level.backgroundGrid) {
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
