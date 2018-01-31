export class CameraExt {
    constructor(name, controller) {
        this.name = name;
        this.controller = controller;
    }

    get cam() {
        return this.controller.cam;
    }

    update(deltaTime, time, options = {}) {}
}
