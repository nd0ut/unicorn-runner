import { Trait } from './Entity';
import { Sides } from './Entity';
import { lerp } from './math';
import { EventEmitter } from './util';

export class Physics extends Trait {
    constructor({ applyGravity } = { applyGravity: true }) {
        super('physics');

        this.applyGravity = applyGravity;
    }

    update(entity, deltaTime, level) {
        entity.pos.x += entity.vel.x * deltaTime;
        level.tileCollider.checkX(entity);

        entity.pos.y += entity.vel.y * deltaTime;
        level.tileCollider.checkY(entity);

        if (this.applyGravity) {
            entity.vel.y += level.gravity * deltaTime;
        }
    }
}

export class AutoJump extends Trait {
    constructor() {
        super('autojump');
    }

    update(entity, deltaTime, level) {
        const distance = entity.vel.x * 0.3;
        const willCollide = level.tileCollider.willCollideX(entity, distance);

        if (willCollide) {
            entity.jump.start();
            setTimeout(() => entity.jump.cancel(), 300);
        }
    }
}

export class Solid extends Trait {
    constructor() {
        super('solid');
        this.obstructs = true;
    }

    obstruct(entity, side, match) {
        if (!this.obstructs) {
            return;
        }

        if (side === Sides.BOTTOM) {
            entity.bounds.bottom = match.y1;
            entity.vel.y = 0;
        } else if (side === Sides.TOP) {
            entity.bounds.top = match.y2;
            entity.vel.y = 0;
        } else if (side === Sides.LEFT) {
            entity.bounds.left = match.x2;
            entity.vel.x = 0;
        } else if (side === Sides.RIGHT) {
            entity.bounds.right = match.x1;
            entity.vel.x = 0;
        }
    }
}

export class Stackable extends Trait {
    constructor() {
        super('stackable');
    }

    collides(us, them, side) {
        if (us.name !== them.name) {
            return;
        }

        if (this.killable && this.killable.dead) {
            return;
        }

        if (us.vel.y > 0 && side === Sides.BOTTOM) {
            us.bounds.bottom = them.bounds.top;
            us.vel.y = 0;
        } else if (us.vel.y < 0 && side === Sides.TOP) {
            us.bounds.top = them.bounds.bottom;
            us.vel.y = 0;
        } else if (us.vel.x > 0 && side === Sides.RIGHT) {
            us.bounds.right = them.bounds.left;
            us.vel.x = 0;
        } else if (us.vel.x < 0 && side === Sides.LEFT) {
            us.bounds.left = them.bounds.right;
            us.vel.x = 0;
        }
    }
}

export class Impassable extends Trait {
    constructor() {
        super('impassable');
        this.activated = true;
    }

    activate() {
        this.queue(() => (this.activated = true));
    }

    deactivate() {
        this.queue(() => (this.activated = false));
    }

    collides(us, them, side) {
        if (!this.activated) {
            return;
        }

        if (side === Sides.BOTTOM) {
            them.bounds.top = us.bounds.bottom;
            them.vel.y = 0;
        } else if (side === Sides.TOP) {
            them.bounds.bottom = us.bounds.top;
            them.vel.y = 0;
        } else if (side === Sides.RIGHT) {
            them.bounds.left = us.bounds.right;
            them.vel.x = 0;
        } else if (side === Sides.LEFT) {
            them.bounds.right = us.bounds.left;
            them.vel.x = 0;
        }

        them.obstruct(them, side);
    }
}

export class Run extends Trait {
    constructor({ speed = 15000 }) {
        super('run');

        this.speed = speed;
        this.realSpeed = this.speed;
        this.lastSpeed = this.speed;
        this.originSpeed = undefined;

        this.damping = 1;
        this.distance = 0;
        this.onGround = false;
        this.boosted = false;
    }

    stop() {
        if (this.originSpeed) {
            this.resume();
        }

        this.originSpeed = this.speed;
        this.speed = 1;
    }

    resume() {
        if (!this.originSpeed) {
            return;
        }

        this.speed = this.originSpeed;
        this.originSpeed = undefined;
    }

    boost(speed) {
        if (this.boosted) {
            return;
        }

        this.originSpeed = this.speed;
        this.speed = this.originSpeed + speed;
        this.boosted = true;
    }

    cancelBoost() {
        if (!this.boosted) {
            return;
        }

        this.speed = this.originSpeed;
        this.originSpeed = undefined;
        this.boosted = false;
    }

    update(entity, deltaTime) {
        this.realSpeed = this.speed;

        if (Math.abs(this.lastSpeed - this.speed) > 0) {
            this.realSpeed = lerp(
                this.lastSpeed,
                this.speed,
                1 / this.damping * deltaTime
            );
        }

        entity.vel.x = this.realSpeed * deltaTime;
        this.distance += Math.abs(entity.vel.x) * deltaTime;
        this.lastSpeed = this.realSpeed;
    }
}

export class Jump extends Trait {
    constructor() {
        super('jump');

        this.falling = false;
        this.jumping = false;

        this.ready = 0;
        this.duration = 0.8;
        this.engageTime = 0;
        this.requestTime = 0;
        this.gracePeriod = 0.1;
        this.speedBoost = 0.3;
        this.velocity = 200;

        this.enabled = true;
    }

    get fallingDown() {
        return this.ready < 0 && this.falling;
    }

    get jumpingUp() {
        return this.ready < 0 && this.jumping;
    }

    get inAir() {
        return this.fallingDown || this.jumpingUp;
    }

    start() {
        if (!this.enabled) {
            return;
        }

        this.requestTime = this.gracePeriod;
    }

    cancel() {
        if (!this.enabled) {
            return;
        }
        this.engageTime = 0;
        this.requestTime = 0;
    }

    obstruct(entity, side) {
        if (side === Sides.BOTTOM) {
            this.ready = 1;
            this.falling = false;
        } else if (side === Sides.TOP) {
            this.cancel();
        }
    }

    update(entity, deltaTime) {
        if (this.ready < 0 && entity.vel.y < 0) {
            this.jumping = true;
            this.falling = false;
        } else if (this.ready < 0 && entity.vel.y > 0) {
            this.jumping = false;
            this.falling = true;
        }

        if (this.requestTime > 0) {
            if (this.ready > 0) {
                this.engageTime = this.duration;
                this.requestTime = 0;
            }

            this.requestTime -= deltaTime;
        }

        if (this.engageTime > 0) {
            entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
            this.engageTime -= deltaTime;
            if (this.engageTime < 0) {
                this.engageTime = 0;
            }
        }

        this.ready--;
    }
}

@EventEmitter.decorator
export class Killable extends Trait {
    constructor({ removeAfter } = {}) {
        super('killable');
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = removeAfter !== undefined ? removeAfter : 0.3;
    }

    kill() {
        if(this.dead) {
            return;
        }
        
        this.emit('dead');
        this.queue(() => (this.dead = true));
    }

    revive() {
        this.dead = false;
        this.deadTime = 0;
    }

    update(entity, deltaTime, level) {
        if (this.dead) {
            entity.vel.x = entity.vel.x * 0.3;

            this.deadTime += deltaTime;
            if (this.deadTime > this.removeAfter) {
                this.queue(() => {
                    level.entities.delete(entity);
                });
            }

            return;
        }
    }
}

@EventEmitter.decorator
export class Killer extends Trait {
    constructor() {
        super('killer');
    }

    kill(victim) {
        this.emit('kill', victim);
    }
}

@EventEmitter.decorator
export class Pickable extends Trait {
    constructor({ onPick } = {}) {
        super('pickable');
        this.picked = false;
        this.pickTime = 0;
        this.removeAfter = 0.3;

        onPick && this.on('pick', onPick);
    }

    pick() {
        this.emit('pick');
        this.queue(() => (this.picked = true));
    }

    update(entity, deltaTime, level) {
        if (this.picked) {
            this.pickTime += deltaTime;
            if (this.pickTime > this.removeAfter) {
                this.queue(() => {
                    level.entities.delete(entity);
                });
            }
        }
    }
}

@EventEmitter.decorator
export class Picker extends Trait {
    constructor() {
        super('picker');
    }

    collides(us, them) {
        if (!them.pickable || them.pickable.picked) {
            return;
        }

        this.emit('pick', us, them)
    }
}

@EventEmitter.decorator
export class Striker extends Trait {
    constructor() {
        super('striker');

        this.reloadDuration = 0.1;
        this.canStrike = true;
        this.strikeTime = 0;
    }

    isStriking() {
        return this.strikeTime > 0 && this.strikeTime < this.reloadDuration;
    }

    strike(bullet, level) {
        if (!this.canStrike) {
            return;
        }

        bullet.pos.x = this.entity.pos.x + 100;
        bullet.pos.y = this.entity.pos.y + 40;
        bullet.vel.x = 1000;
        level.entities.add(bullet);

        this.canStrike = false;
        this.strikeTime = 0;

        bullet.bulletBehavior.striked();
        this.emit('strike', bullet);
    }

    update(entity, deltaTime, level) {
        if (this.canStrike) {
            return;
        }

        this.strikeTime += deltaTime;

        if (this.strikeTime > this.reloadDuration) {
            this.canStrike = true;
            this.strikeTime = 0;
        }
    }
}
