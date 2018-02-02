import { clamp, lerp, Vec2 } from '../math';

export class MouseController {
    constructor(editor) {
        this.editor = editor;

        this.clickHandler = undefined;    
        this.dragHandler = undefined;    

        this.pos = new Vec2(0, 0);

        this.downTime = 0;
        this.downPos = new Vec2(0, 0);

        this.dragging = false;

        this.initHandlers();
    }

    get cam() {
        return this.editor.camera;
    }

    initHandlers() {
        const canvas = this.editor.canvasSelector;

        canvas.addEventListener('mousemove', this.handleMove.bind(this));
        canvas.addEventListener('mousedown', this.handleDown.bind(this));
        canvas.addEventListener('mouseup', this.handleUp.bind(this));
        canvas.addEventListener('wheel', this.handleWheel.bind(this));
    }

    handleDown(e) {
        const { layerX, layerY } = e;
        this.downTime = new Date().valueOf();
        this.downPos.set(layerX, layerY);
    }

    handleUp(e) {
        const { layerX, layerY } = e;

        if (this.dragging) {
            this.handleDrag(e, 'stop');            
            this.dragging = false;
            this.downTime = 0;            
            return;
        }

        const isClick = new Date().valueOf() - this.downTime < 50;
        if (isClick) {
            this.handleClick(e);
            this.downTime = 0;            
            return;
        }
    }

    handleMove(e) {
        const { layerX, layerY } = e;
        this.pos.set(layerX, layerY);

        const drag = this.downTime > 0 && this.pos.distance(this.downPos) > 10;
        if(drag) {
            this.handleDrag(e, this.dragging ? 'dragging' : 'start');
            this.dragging = true;
        }
    }

    handleClick(e) {
        const { layerX, layerY } = e;

        this.clickHandler(new Vec2(layerX, layerY));
    }

    handleWheel(e) {
        e.preventDefault();

        const { deltaX, deltaY } = e;

        this.cam.pos.x += deltaX;
        this.cam.pos.y += deltaY;

        this.cam.pos.x = clamp(this.cam.pos.x, 0, Infinity);
        this.cam.pos.y = clamp(this.cam.pos.y, -5000, 0);
    }

    handleDrag(e, dragState) {
        this.dragHandler && this.dragHandler(e, dragState);
    }

    onClick(clickHandler) {
        this.clickHandler = clickHandler;
    }

    onDrag(dragHandler) {
        this.dragHandler = dragHandler;
    }
}
