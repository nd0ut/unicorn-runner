export function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            timeout = undefined;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

export class EventEmitter {
    static emitters = new WeakMap();

    static getEmitter(instance) {
        let emitter = EventEmitter.emitters.get(instance);

        if (!emitter) {
            emitter = new EventEmitter();
            EventEmitter.emitters.set(instance, emitter);
        }

        return emitter;
    }

    static decorator(target) {
        target.prototype.on = function on(...args) {
            const emitter = EventEmitter.getEmitter(this);
            emitter.on.call(emitter, ...args);
        }

        target.prototype.emit = function emit(...args) {
            const emitter = EventEmitter.getEmitter(this);
            emitter.emit.call(emitter, ...args);
        }
    }

    constructor(instance) {
        this.events = new Map();
    }

    on(event, handler) {
        let handlers = this.events.get(event);

        if (handlers) {
            handlers.push(handler);
        } else {
            handlers = [handler];
            this.events.set(event, handlers);
        }
    }

    async emit(event, ...args) {
        const handlers = this.events.get(event);

        if (!handlers) {
            return;
        }

        for (const handler of handlers) {
            handler(...args);
        }

        await Promise.all(handlers.map(handler => handler.bind(handler, ...args)));
    }
}
