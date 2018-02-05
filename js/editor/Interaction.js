import { clamp } from '../math';
import { MouseEvents, DragState } from './Mouse';
import { updateTileGrid, updateEntity } from './SpecUpdate';

export const InteractionMode = {
    SELECT: Symbol('SELECT'),
    TILE: Symbol('TILE'),
    ENTITY: Symbol('ENTITY')
};

export class Interaction {
    constructor(editor) {
        this.editor = editor;
        this.mode = InteractionMode.SELECT;

        this.editor.mouse.on(MouseEvents.CLICK, this.onClick.bind(this));
        this.editor.mouse.on(MouseEvents.DRAG, this.onDrag.bind(this));
        this.editor.mouse.on(MouseEvents.MOVE, this.onMove.bind(this));
        this.editor.mouse.on(MouseEvents.WHEEL, this.onWheel.bind(this));

        window.addEventListener('keypress', this.onKeyPress.bind(this));

        this.dragging = {};
    }

    get level() {
        return this.editor.level;
    }

    get cam() {
        return this.editor.camera;
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
            case 'KeyR':
                this.editor.restart();
                break;
            default:
                break;
        }
    }

    onMove(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        const tile = this.editor.picker.pickTile(pos);
    }

    onDrag(dragState, pos) {
        if(this.mode === InteractionMode.SELECT) {
            this.tryDragEntity(dragState, pos);
        }
    }

    tryDragEntity(dragState, pos) {
        if(dragState === DragState.START) {
            const entity = this.editor.picker.pickEntity(pos);
            
            if(entity) {
                this.editor.selection.selectEntity(entity);                
                this.dragging.entity = entity;
                this.dragging.offsetX = pos.x - entity.pos.x;
                this.dragging.offsetY = pos.y - entity.pos.y;
            }

            return;
        }

        if(!this.dragging.entity) {
            return;
        }

        const x = pos.x - this.dragging.offsetX;
        const y = pos.y - this.dragging.offsetY;
        this.dragging.entity.pos.x = x;
        this.dragging.entity.pos.y = y;

        updateEntity(this.editor.levelSpec, this.dragging.entity.idx, {
            pos: [x, y]
        })

        if (dragState === DragState.STOP) {
            this.dragging = {};
        }
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

    onWheel({deltaX, deltaY}) {
        this.cam.pos.x += deltaX;
        this.cam.pos.y += deltaY;

        this.cam.pos.x = clamp(this.cam.pos.x, -1000, Infinity);
        this.cam.pos.y = clamp(this.cam.pos.y, -1000, 0);
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

            updateTileGrid(this.editor.levelSpec, this.level.backgroundGrid);
        }

        console.log('tile', tileIndex);
    }

    clickSelect(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        if (entity) {
            this.editor.selection.selectEntity(entity);
            return;
        }

        const tile = this.editor.picker.pickTile(pos);
        if (tile) {
            this.editor.selection.selectTile(tile);
            return;
        }

        this.editor.selection.clear();
    }
}
