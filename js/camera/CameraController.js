export class CameraController {
    constructor(camera, extensions) {
        this.cam = camera;
        this.extensions = this.loadExtensions(extensions);
    }

    loadExtensions(extensions) {
        return extensions.map(ExtKlass => {
            const ext = new ExtKlass(this);
            this[ext.name] = ext;
            return ext;
        });
    }

    update(deltaTime, time, { alcohol = false, earthquake = false } = {}) {
        this.extensions.forEach(ext => ext.update(...arguments));
    }
}

