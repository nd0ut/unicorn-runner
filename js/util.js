export function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = undefined;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}


export class EventEmitter {
    static decorator(target) {
        const eventEmitter = new EventEmitter();

        target.prototype.on = eventEmitter.on.bind(eventEmitter);
        target.prototype.emit = eventEmitter.emit.bind(eventEmitter);
    }

    constructor(instance) {
        this.events = new Map();
    }

    on(event, handler) {
        let handlers = this.events.get(event);

        if(handlers) {
            handlers.push(handler);
        } else {
            handlers = [handler];
            this.events.set(event, handlers);
        }
    }

    async emit(event, ...args) {
        const handlers = this.events.get(event);

        if(!handlers) {
            return;
        }

        for(const handler of handlers) {
            handler(...args);
        }
        
        await Promise.all(handlers.map(handler => handler.bind(undefined, ...args)));
    }
}
