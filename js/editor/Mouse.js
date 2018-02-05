import { clamp, Vec2 } from '../math';
import { EventEmitter } from '../util';

export const MouseEvents = {
    CLICK: Symbol('CLICK'),
    RIGHTCLICK: Symbol('RIGHTCLICK'),
    DRAG: Symbol('DRAG'),
    MOVE: Symbol('MOVE'),
    WHEEL: Symbol('WHEEL')
};

export const DragState = {
    START: Symbol('START'),
    DRAGGING: Symbol('DRAGGING'),
    STOP: Symbol('STOP')
};

@EventEmitter.decorator
export class Mouse {
    constructor(editor) {
        this.editor = editor;

        this.pos = new Vec2(0, 0);

        this.downTime = 0;
        this.downPos = new Vec2(0, 0);

        this.dragging = false;

        this.initHandlers();
    }

    toGamePos(x, y) {
        const cam = this.editor.camera;
        return new Vec2(cam.pos.x + x, cam.pos.y + y);
    }

    initHandlers() {
        const canvas = this.editor.canvasSelector;

        canvas.addEventListener('mousemove', this.handleMove.bind(this));
        canvas.addEventListener('mousedown', this.handleDown.bind(this));
        canvas.addEventListener('mouseup', this.handleUp.bind(this));
        canvas.addEventListener('wheel', this.handleWheel.bind(this));
        canvas.addEventListener('contextmenu', (e) => {
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
    }

    handleDown(e) {
        const { offsetX, offsetY } = e;

        this.downTime = new Date().valueOf();
        this.downPos.set(offsetX, offsetY);
    }

    handleUp(e) {
        const { offsetX, offsetY } = e;
        const pos = this.toGamePos(offsetX, offsetY);

        if (this.dragging) {
            this.handleDrag(e, DragState.STOP, pos);
            this.dragging = false;
            this.downTime = 0;
            return;
        }

        this.handleClick(e);
        this.downTime = 0;
        return;
    }

    handleMove(e) {
        const { offsetX, offsetY } = e;
        this.pos = this.toGamePos(offsetX, offsetY);

        const drag = this.downTime > 0 && this.pos.distance(this.downPos) > 2;
        if (drag) {
            const dragState = this.dragging ? DragState.DRAGGING : DragState.START;
            this.handleDrag(e, dragState, this.pos);
            this.dragging = true;
        }

        this.emit(MouseEvents.MOVE, this.pos);
    }

    handleClick(e) {
        const { offsetX, offsetY } = e;
        const pos = this.toGamePos(offsetX, offsetY);

        if (e.which === 1) {
            this.emit(MouseEvents.CLICK, pos);
        } else if (e.which === 3) {
            e.preventDefault();
            e.stopPropagation();
            this.emit(MouseEvents.RIGHTCLICK, pos);
        }

    }

    handleWheel(e) {
        e.preventDefault();

        const { deltaX, deltaY } = e;

        this.emit(MouseEvents.WHEEL, { deltaX, deltaY });
    }

    handleDrag(e, dragState, pos) {
        this.emit(MouseEvents.DRAG, dragState, pos);
    }
}
