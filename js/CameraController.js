import everpolate from 'everpolate';
import { Vec2 } from './math';

export class CameraController {
    constructor(camera) {
        this.camera = camera;

        this.lastPos = camera.pos.clone();
        this.lastVel = undefined;

        this.velocityChangeTime = 0;

        this.cameraOffset = new Vec2(0, 0);
    }

    get pos() {
        return this.camera.pos;
    }

    setFollowEntity(entity) {
        this.entity = entity;
        this.lastVel = entity.vel.clone();        
    }

    update(deltaTime, time, {alcohol = false, earthquake = false} = {}) {
        this.setBasePosition();
        
        this.syncVelocity(deltaTime, time);              

        this.applyOffset();        
    }

    setBasePosition() {
        this.pos.x = Math.max(0, this.entity.pos.x - 100);
    }

    applyOffset() {
        this.pos.x += this.cameraOffset.x;
        this.pos.y += this.cameraOffset.y;
    }

    syncVelocity(deltaTime, time) {
        if(this.cameraOffset.x > 0) {
            this.cameraOffset.x = (300 - this.cameraOffset.x) * easeIn(time / 10000, 1)
        } else {
            this.cameraOffset.x = 300 * easeIn(time / 10000, 1)            
        }

        this.lastVel = this.entity.vel.clone();
    }
}

function linearTween(t, b, c, d) {
	return c*t/d + b;
};

function easeInOutQuad(t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};


function easeIn(t, d){
  return Math.pow(t / d, 5);
}
