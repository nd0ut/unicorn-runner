export class Selection {
    constructor(editor) {
        this.editor = editor;

        this.selectedTile = undefined;
        this.selectedEntity = undefined;

        this.changeHandler = undefined;
    }

    get empty() {
        return !this.selectedTile && !this.selectedEntity;
    }

    selectTile(tile) {
        this.selectedTile = tile;
        this.selectedEntity = undefined;
        console.log(tile);
        this.changeHandler();
    }

    selectEntity(entity) {
        this.selectedEntity = entity;
        this.selectedTile = undefined;

        this.changeHandler();
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
    }

    clear() {
        this.selectedEntity = undefined;
        this.selectedTile = undefined;

        this.changeHandler();
    }

    onChange(changeHandler) {
        this.changeHandler = changeHandler;
    }
}
