export class InteractionController {
    constructor(editor) {
        this.editor = editor;

        this.editor.mouse.onClick(this.onClick.bind(this));
        this.editor.mouse.onMove(this.onMove.bind(this));
    }

    onMove(pos) {
        const tilePos = this.editor.levelManager.pickTilePos(pos);
    }

    onClick(pos) {
        const picked = this.editor.levelManager.pickEntity(pos);
        const tileIndex = this.editor.levelManager.pickTileIndex(pos);

        console.log(picked, tileIndex);

        if (tileIndex) {
            this.editor.levelManager.level.tileGrid.set(tileIndex.x, tileIndex.y, 'test');
        }
    }
}