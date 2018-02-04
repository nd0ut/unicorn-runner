export const InteractionMode = {
    SELECT: Symbol('SELECT'),
    TILE: Symbol('TILE'),
    ENTITY: Symbol('ENTITY')
}

export class Interaction {
    constructor(editor) {
        this.editor = editor;
        this.mode = InteractionMode.SELECT;

        this.editor.mouse.onClick(this.onClick.bind(this));
        this.editor.mouse.onMove(this.onMove.bind(this));

        window.addEventListener('keypress', this.onKeyPress.bind(this));
    }

    get level() {
        return this.editor.level;
    }

    get spec() {
        return this.editor.level.spec;
    }

    setMode(mode) {
        this.mode = mode;
    }

    onKeyPress(e) {
        if (e.repeat) {
            return;
        }

        switch (e.code) {
            case 'KeyT':
                this.editor.paused ? this.editor.resume() : this.editor.pause();
                break;
            default:
                break;
        }
    }

    onMove(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        const tile = this.editor.picker.pickTile(pos);        
    }

    onClick(pos) {
        switch (this.mode) {
            case InteractionMode.SELECT:
                this.clickSelect(pos);
                break;
            case InteractionMode.TILE:
                this.clickTile(pos);
                break;
            case InteractionMode.ENTITY:
                this.clickEntity(pos);                
            default:
                break;
        }
    }

    clickEntity(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        
        console.log('entity', entity);
    }

    clickTile(pos) {
        const tileIndex = this.editor.picker.pickTileIndex(pos);

        if (tileIndex) {
            const tile = 1;
            this.level.backgroundGrid.set(tileIndex.x, tileIndex.y, tile);
            this.level.collisionGrid.set(tileIndex.x, tileIndex.y, tile);
            this.spec.layers[0].tiles[0].ranges = this.editor.picker.exportRanges();
        }

        console.log('tile', tileIndex);        
    }
    
    clickSelect(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        if(entity) {
            this.editor.selection.selectEntity(entity);
            return;
        }

        const tile = this.editor.picker.pickTile(pos);
        if(tile) {
            this.editor.selection.selectTile(tile);
            return
        }        

        this.editor.selection.clear();
    }
}