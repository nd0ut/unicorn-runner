import { rand, lerp } from '../math';
import { CameraExt } from './CameraExt';

export const ShakeType = {
    DRUNK: Symbol('DRUNK'),
    EARTH: Symbol('EARTH')
};

export class CameraShake extends CameraExt {
    constructor(controller) {
        super('shake', controller);

        this.alcoFreq = 1;
        this.alcoAmp = 1;
        this.alcoRand = 1;
        this.alcoDamping = 1;

        this.shakingAmp = 50;
    }

    get entity() {
        return this.controller.focus.entity;
    }

    get camOffset() {
        return this.controller.focus.camOffset;
    }

    update(deltaTime, time, { shakeType } = { }) {
        if (!shakeType) {
            this.resetFocus();
            return;
        }
        this.runShake(shakeType, deltaTime, time);
    }

    runShake(shakeType, deltaTime, time) {
        switch (shakeType) {
            case ShakeType.DRUNK:
                this.drunk(deltaTime, time);
                break;
            case ShakeType.EARTH:
                this.earth(deltaTime, time);
            default:
                break;
        }
    }

    resetFocus() {
        this.controller.focus.damping = this.controller.focus.defaultDamping;
        this.controller.focus.camOffset = this.controller.focus.defaultCamOffset;
    }

    drunk(deltaTime, time) {
        this.controller.focus.damping = this.alcoDamping;

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
        this.camOffset.x =
            Math.sin(time / 1000) + Math.sin(this.alcoRand) * 500;
    }

    earth(deltaTime, time) {
        this.cam.pos.x =
            this.entity.pos.x -
            this.camOffset.x +
            rand.float(0, this.shakingAmp);

        this.cam.pos.y = rand.float(0, this.shakingAmp);
    }
}


function sinusoid(t, a, b, c, d) {
    return a + b * Math.sin(c * t + d);
}
