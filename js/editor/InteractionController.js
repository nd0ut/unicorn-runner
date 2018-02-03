export class InteractionController {
    constructor(editor) {
        this.editor = editor;

        this.editor.mouse.onClick(this.onClick.bind(this));
        this.editor.mouse.onMove(this.onMove.bind(this));

        ['keypress'].forEach(eventName => {
            window.addEventListener(eventName, e => {
                this.keyHandler(e);
            });
        });
    }

    keyHandler(e) {
        if(e.repeat) {
            return;
        }

        console.log(e);

        switch (e.code) {
            case 'KeyT':
                this.editor.editMode ? this.editor.startPlayer() : this.editor.startEditor();
                break;
            default:
                break;
        }
    }
    onMove(pos) {
        const tilePos = this.editor.editorLevelManager.pickTilePos(pos);
    }

    onClick(pos) {
        const picked = this.editor.editorLevelManager.pickEntity(pos);
        const tileIndex = this.editor.editorLevelManager.pickTileIndex(pos);

        console.log(picked, tileIndex);

        if (tileIndex) {
            const tile = { name: 'noname' };
            this.editor.editorLevelManager.level.tileGrid.set(tileIndex.x, tileIndex.y, tile);
            this.editor.level.spec.layers[0].tiles[0].ranges = this.editor.editorLevelManager.exportRanges();
        }
    }
}