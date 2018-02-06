import { EventEmitter } from '../util';

@EventEmitter.decorator
export class Selection {
    constructor(editor) {
        this.editor = editor;

        this.selectedTile = undefined;
        this.selectedEntity = undefined;
    }

    get empty() {
        return !this.selectedTile && !this.selectedEntity;
    }

    selectTile(tile) {
        this.selectedTile = tile;
        this.selectedEntity = undefined;
        this.emit('change');
    }

    selectEntity(entity) {
        if (this.selectedEntity === entity) {
            return;
        }

        this.selectedEntity = entity;
        this.selectedTile = undefined;

        this.emit('change');
    }

    getSpec() {
        if (this.empty) {
            return;
        }

        if (this.selectedEntity) {
            const entities = this.editor.levelSpec.entities;
            const spec = entities[this.selectedEntity.idx];

            return spec;
        }

        if (this.selectedTile) {
            const spec = { skinName: this.selectedTile.skinName };
            return spec;
        }
    }

    clear() {
        this.selectedEntity = undefined;
        this.selectedTile = undefined;

        this.emit('change');
    }
}
