export class Timer {
    constructor(deltaTime = 1/60) {
        this.rafId = undefined;
        
        let accumulatedTime = 0;
        let lastTime = 0;
        
        this.updateProxy = (time) => {
            accumulatedTime += (time - lastTime) / 1000;

            if (accumulatedTime > 1) {
                accumulatedTime = 1;
            }

            while (accumulatedTime > deltaTime) {
                this.update(deltaTime, time);
                accumulatedTime -= deltaTime;
            }

            lastTime = time;

            this.enqueue();
        }
    }

    update() {
        
    }

    enqueue() {
        this.rafId = requestAnimationFrame(this.updateProxy);
    }

    start() {
        this.enqueue();
    }

    stop() {
        cancelAnimationFrame(this.rafId);
    }
}
