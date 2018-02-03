export class Interaction {
    constructor(editor) {
        this.editor = editor;

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
        const tilePos = this.editor.picker.pickTilePos(pos);
    }

    onClick(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        const tileIndex = this.editor.picker.pickTileIndex(pos);

        if (tileIndex) {
            const tile = 1;
            this.level.backgroundGrid.set(tileIndex.x, tileIndex.y, tile);
            this.level.collisionGrid.set(tileIndex.x, tileIndex.y, tile);
            this.spec.layers[0].tiles[0].ranges = this.editor.picker.exportRanges();
        }
    }
}