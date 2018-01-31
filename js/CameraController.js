import { lerp, Vec2, rand } from './math';

export class CameraController {
    constructor(camera) {
        this.cam = camera;
 
        // focus
        this.followEntity = undefined;
        this.focusEntity = undefined;
        this.focusTime = undefined;
        this.focusSwitched = false;
        this.focusReached = false;
        this.focusRestored = false;
        this.focusRestoredTime = undefined;
        this.focusResolver = undefined;

        this.cameraOffset = this.defaultCameraOffset;
        this.damping = this.defaultDamping;
        this.shakingAmp = 50;

        // alcohol
        this.alcoFreq = 1;
        this.alcoAmp = 1;
        this.alcoRand = 0;
        this.alcoDamping = 1;
    }

    get defaultDamping() {
        return 0.4;
    }

    get defaultCameraOffset() {
        return new Vec2(0, 0);
    }

    setFollowEntity(entity) {
        this.followEntity = entity;
        this.entity = entity;
        this.lastVel = entity.vel.clone();
    }

    switchFocus(focusEntity, time) {
        this.focusSwitched = true;
        this.focusEntity = focusEntity
        this.focusTime = time;
        this.entity = focusEntity;
        this.followEntity.run.stop();
        this.cameraOffset.x = this.cam.size.x / 3;
        
        return new Promise((res) => {
            this.focusResolver = res;
        })
    }

    checkFocus(deltaTime, time) {
        if(this.focusSwitched && !this.focusReached) {
            const dist = Math.abs(this.entity.pos.x - this.cam.pos.x);
            if(dist < 500) {
                this.focusReached = true;

                setTimeout(() => {
                    this.entity = this.followEntity;
                }, this.focusTime);
            }

        }
        if(this.focusSwitched && this.focusReached && !this.focusRestored) {
            const dist = Math.abs(this.followEntity.pos.x - this.cam.pos.x);
            if(dist < 500) {
                this.focusRestored = true;
                this.focusRestoredTime = time;
            }
        }
        if(this.focusSwitched && this.focusReached && this.focusRestored) {
            this.focusSwitched = false;
            this.focusReached = false;
            this.focusRestored = false;
            this.focusEntity = undefined;
            this.focusResolver();
            this.focusResolver = undefined;
            this.followEntity.run.resume();            
        }
    }

    update(deltaTime, time, { alcohol = false, earthquake = false } = {}) {
        this.checkFocus(deltaTime, time);

        if (!alcohol && !earthquake && !this.focusSwitched && (time - this.focusRestoredTime) > 500) {
            this.damping = this.defaultDamping;
            this.cameraOffset = this.defaultCameraOffset;
        }

        this.follow(deltaTime, time);

        if (alcohol) {
            this.alcohol(deltaTime, time);
        }

        if (earthquake) {
            this.earthquake(deltaTime, time);
        }
    }

    alcohol(deltaTime, time) {
        this.damping = this.alcoDamping;

        const newRand = this.alcoRand * rand.float(0, 1);
        this.alcoRand = lerp(this.alcoRand, newRand, deltaTime);

        this.cam.pos.y =
            sinusoid(
                time / 1000,
                0,
                Math.sin(this.alcoRand) * this.alcoAmp,
                Math.sin(this.alcoRand) * this.alcoFreq,
                0
            ) * 100;
        this.cameraOffset.x =
            Math.sin(time / 1000) + Math.sin(this.alcoRand) * 500;
    }

    earthquake(deltaTime, time) {
        this.cam.pos.x =
            this.entity.pos.x -
            this.cameraOffset.x +
            rand.float(0, this.shakingAmp);

        this.cam.pos.y = rand.float(0, this.shakingAmp);
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

function sinusoid(t, a, b, c, d) {
    return a + b * Math.sin(c * t + d);
}
