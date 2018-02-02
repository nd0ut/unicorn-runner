export class InteractionController {
    constructor(editor) {
        this.editor = editor;

        this.editor.mouse.onClick(this.onClick.bind(this));
    }

    onClick(pos) {
        // const picked = this.editor.levelManager.pickEntity(pos);
        // const tileIndex = this.editor.levelManager.pickTileIndex(pos);

        // if (tileIndex) {
        //     this.editor.levelManager.level.tileGrid.remove(tileIndex.x, tileIndex.y);
        // }
    }
}