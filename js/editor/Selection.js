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
            const entities = this.editor.level.spec.entities;
            const spec = entities.find(entity => {
                return entity.name === this.selectedEntity.name && 
                    entity.pos[0] === this.selectedEntity.pos.x &&
                    entity.pos[1] === this.selectedEntity.pos.y
            });
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