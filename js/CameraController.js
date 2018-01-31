import { lerp, Vec2 } from './math';

export class CameraController {
    constructor(camera) {
        this.cam = camera;
        this.cameraOffset = new Vec2(0, 0);
        this.damping = 0.5;
    }

    setFollowEntity(entity) {
        this.entity = entity;
        this.lastVel = entity.vel.clone();
    }

    update(deltaTime, time, { alcohol = false, earthquake = false } = {}) {
        this.follow(deltaTime, time);
    }

    follow(deltaTime, time) {
        if (!this.entity || time < 1000) {
            return;
        }

        let entityX = this.entity.pos.x - this.cameraOffset.x;

        if (Math.abs(this.cam.pos.x - entityX) > 0.1) {
            entityX = lerp(
                this.cam.pos.x,
                entityX,
                1 / this.damping * deltaTime
            );
        }

        this.cam.pos.x = entityX;
    }
}
