import { lerp, Vec2, rand } from '../math';
import {CameraFocus} from './CameraFocus';
import { CameraShake } from './CameraShake';

export class CameraController {
    constructor(camera) {
        this.cam = camera;
        this.extensions = this.loadExtensions();
    }

    loadExtensions() {
        let extensions = [
            CameraShake,
            CameraFocus
        ].map(ExtKlass => {
            const ext = new ExtKlass(this);
            this[ext.name] = ext;
            return ext;
        });

        return extensions;
    }

    update(deltaTime, time, { alcohol = false, earthquake = false } = {}) {
        this.extensions.forEach(ext => ext.update(...arguments));
    }
}

