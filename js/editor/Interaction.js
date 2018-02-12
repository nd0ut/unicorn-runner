import { clamp } from '../math';
import { EventEmitter } from '../util';
import { DragState, MouseEvents } from './Mouse';
import * as SpecTools from './SpecTools';

export const InteractionMode = {
    SELECT: Symbol('SELECT'),
    TILE: Symbol('TILE'),
    ENTITY: Symbol('ENTITY')
};

@EventEmitter.decorator
export class Interaction {
    constructor(editor) {
        this.editor = editor;
        this.mode = InteractionMode.SELECT;

        this.editor.mouse.on(MouseEvents.CLICK, this.onClick.bind(this));
        this.editor.mouse.on(MouseEvents.RIGHTCLICK, this.onRightClick.bind(this));
        this.editor.mouse.on(MouseEvents.DRAG, this.onDrag.bind(this));
        this.editor.mouse.on(MouseEvents.MOVE, this.onMove.bind(this));
        this.editor.mouse.on(MouseEvents.WHEEL, this.onWheel.bind(this));

        window.addEventListener('keydown', this.onKeyPress.bind(this));

        this.dragging = {};
        this.createEntityName = undefined;
        this.createEntitySkinName = undefined;
        this.createTileSkin = undefined;
    }

    get level() {
        return this.editor.level;
    }

    get cam() {
        return this.editor.camera;
    }

    setMode(mode) {
        this.mode = mode;
        this.emit('change');
    }

    setCreateEntityName(entityName) {
        this.createEntityName = entityName;
    }

    setCreateTileSkin(skinName) {
        this.createTileSkin = skinName;
    }

    setCreateEntitySkinName(skinName) {
        this.createEntitySkinName = skinName;
    }

    onKeyPress(e) {
        switch (e.code) {
            case 'KeyT':
                this.editor.paused ? this.editor.resume() : this.editor.pause();
                break;
            case 'KeyR':
                this.editor.restart();
                break;
            case 'KeyQ':
                this.setMode(InteractionMode.SELECT);
                break;
            case 'KeyW':
                this.setMode(InteractionMode.TILE);
                break;
            case 'KeyE':
                this.setMode(InteractionMode.ENTITY);
                break;
            case 'ArrowRight':
                this.setCamPos(this.cam.pos.x + 500, this.cam.pos.y);
                break;
            case 'ArrowLeft':
                this.setCamPos(this.cam.pos.x - 500, this.cam.pos.y);
                break;
            default:
                break;
        }
    }

    onMove(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        const tile = this.editor.picker.pickTile(pos);
    }

    onDrag(dragState, pos, delta) {
        if (dragState === DragState.STOP) {
            this.dragging = {};
            return;
        }

        this.tryDrawTiles(dragState, pos, delta) ||
            this.tryDragCamera(dragState, pos, delta) ||
            this.tryDragEntity(dragState, pos, delta);
    }

    tryDrawTiles(dragState, pos) {
        const tile = this.editor.picker.pickTile(pos);

        if (!tile && this.mode !== InteractionMode.TILE) {
            return false;
        }

        if (dragState === DragState.START) {
            this.dragging.drawTiles = true;
            this.dragging.remove = tile ? true : false;
            return true;
        }

        if (!this.dragging.drawTiles) {
            return false;
        }

        if (dragState === DragState.DRAGGING) {
            if (this.dragging.remove && tile) {
                this.removeTile(pos);
            } else if (!this.dragging.remove && !tile) {
                this.createTile(pos);
            }
        }

        return true;
    }

    tryDragCamera(dragState, pos, delta) {
        if (dragState === DragState.START) {
            const entity = this.editor.picker.pickEntity(pos);
            const tile = this.editor.picker.pickTile(pos);

            if (!entity && !tile) {
                this.dragging.moveCamera = true;
                this.dragging.startPos = pos;
                this.dragging.offsetX = pos.x - this.cam.pos.x;
                this.dragging.offsetY = pos.y - this.cam.pos.y;
                return true;
            }
        }

        if (!this.dragging.moveCamera) {
            return false;
        }

        if (dragState === DragState.DRAGGING) {
            const x = this.dragging.startPos.x - this.dragging.offsetX - delta.x;
            const y = this.dragging.startPos.y - this.dragging.offsetY - delta.y;

            this.setCamPos(x, y);
        }

        return true;
    }

    tryDragEntity(dragState, pos) {
        if (dragState === DragState.START) {
            const entity = this.editor.picker.pickEntity(pos);

            if (entity) {
                this.editor.selection.selectEntity(entity);
                this.dragging.entity = entity;
                this.dragging.offsetX = pos.x - entity.pos.x;
                this.dragging.offsetY = pos.y - entity.pos.y;
                return true;
            }
        }

        if (!this.dragging.entity) {
            return false;
        }

        if (dragState === DragState.DRAGGING) {
            const x = pos.x - this.dragging.offsetX;
            const y = pos.y - this.dragging.offsetY;
            this.dragging.entity.pos.x = x;
            this.dragging.entity.pos.y = y;

            SpecTools.updateEntity(this.editor.levelSpec, this.dragging.entity.idx, {
                pos: [x, y]
            });
        }

        this.emit('change');

        return true;
    }

    onClick(pos) {
        switch (this.mode) {
            case InteractionMode.SELECT:
                this.selectInPosition(pos);
                break;
            case InteractionMode.TILE:
                this.createTile(pos);
                break;
            case InteractionMode.ENTITY:
                this.createEntity(pos);
            default:
                break;
        }
    }

    onRightClick(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        if (entity) {
            this.removeEntity(pos);
        }

        const tile = this.editor.picker.pickTile(pos);
        if (tile) {
            this.removeTile(pos);
        }
    }

    onWheel(delta) {
        const x = this.cam.pos.x + delta.x;
        const y = this.cam.pos.y + delta.y;

        this.setCamPos(x, y);
    }

    setCamPos(x, y) {
        this.cam.pos.x = clamp(x, -1000, Infinity);
        this.cam.pos.y = clamp(y, -1000, 0);
    }

    createEntity(pos) {
        const entityCreator = this.editor.entityFactory[this.createEntityName];
        const entity = entityCreator({ skinName: this.createEntitySkinName });

        const x = pos.x - entity.size.x / 2 - entity.offset.x;
        const y = pos.y - entity.size.y / 2 - entity.offset.y;

        const idx = SpecTools.createEntity(this.editor.levelSpec, {
            name: entity.name,
            pos: [x, y],
            skinName: this.createEntitySkinName
        });
        entity.pos.set(x, y);
        entity.idx = idx;

        this.editor.level.entities.add(entity);
    }

    removeEntity(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        SpecTools.removeEntity(this.editor.levelSpec, entity.idx);
        this.editor.level.entities.delete(entity);
    }

    createTile(pos) {
        const tileIndex = this.editor.picker.pickTileIndex(pos);

        if (tileIndex) {
            const tile = { skinName: this.createTileSkin };
            this.level.tileGrid.set(tileIndex.x, tileIndex.y, tile);
            SpecTools.updateTileGrid(this.editor.levelSpec, this.level.tileGrid);
        }
    }

    removeTile(pos) {
        const tileIndex = this.editor.picker.pickTileIndex(pos);

        if (tileIndex) {
            this.level.tileGrid.remove(tileIndex.x, tileIndex.y);
            SpecTools.updateTileGrid(this.editor.levelSpec, this.level.tileGrid);
        }
    }

    selectInPosition(pos) {
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

    async saveToFile() {
        const { success } = await SpecTools.saveLocal(
            this.editor.levelIdx,
            this.editor.levelSpec
        );

        return success;
    }
}
