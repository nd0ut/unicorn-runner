import { Vec2 } from '../math';
import { ClipBox } from '../ClipBox';

export class Camera {
    constructor() {
        this.pos = new Vec2(0, 0);
        this.size = new Vec2(1024, 600);
    }

    getBounds() {
        return new ClipBox(this.pos, this.size, Vec2.zero);
    }
}
