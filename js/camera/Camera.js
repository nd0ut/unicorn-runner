import { Vec2 } from '../math';

export class Camera {
    constructor() {
        this.pos = new Vec2(0, 0);
        this.size = new Vec2(1024, 600);
    }
}