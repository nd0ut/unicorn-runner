import { clamp, lerp, Vec2 } from '../math';

export class Mouse {
    constructor(editor) {
        this.editor = editor;

        this.clickHandler = undefined;    
        this.dragHandler = undefined;    
        this.moveHandler = undefined;
        
        this.pos = new Vec2(0, 0);

        this.downTime = 0;
        this.downPos = new Vec2(0, 0);

        this.dragging = false;

        this.initHandlers();
    }

    get cam() {
        return this.editor.camera;
    }

    toGamePos(x, y) {
        return new Vec2(this.cam.pos.x + x, this.cam.pos.y + y)
    }

    initHandlers() {
        const canvas = this.editor.canvasSelector;

        canvas.addEventListener('mousemove', this.handleMove.bind(this));
        canvas.addEventListener('mousedown', this.handleDown.bind(this));
        canvas.addEventListener('mouseup', this.handleUp.bind(this));
        canvas.addEventListener('wheel', this.handleWheel.bind(this));
    }

    handleDown(e) {
        const { offsetX, offsetY } = e;
        this.downTime = new Date().valueOf();
        this.downPos.set(offsetX, offsetY);
    }

    handleUp(e) {
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
        const { offsetX, offsetY } = e;        
        this.pos = this.toGamePos(offsetX, offsetY);

        const drag = this.downTime > 0 && this.pos.distance(this.downPos) > 10;
        if(drag) {
            this.handleDrag(e, this.dragging ? 'dragging' : 'start');
            this.dragging = true;
        }

        this.moveHandler(this.pos);
    }

    handleClick(e) {
        const { offsetX, offsetY } = e;
        const gamePos = this.toGamePos(offsetX, offsetY);

        this.clickHandler(gamePos);
    }

    handleWheel(e) {
        e.preventDefault();

        const { deltaX, deltaY } = e;

        this.cam.pos.x += deltaX;
        this.cam.pos.y += deltaY;

        this.cam.pos.x = clamp(this.cam.pos.x, -1000, Infinity);
        this.cam.pos.y = clamp(this.cam.pos.y, -1000, 0);
    }

    handleDrag(e, dragState) {
        this.dragHandler && this.dragHandler(dragState);
    }

    onClick(clickHandler) {
        this.clickHandler = clickHandler;
    }

    onDrag(dragHandler) {
        this.dragHandler = dragHandler;
    }

    onMove(moveHandler) {
        this.moveHandler = moveHandler;
    }
}