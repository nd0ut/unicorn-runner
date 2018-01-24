import { Trait } from './Entity';
import { Sides } from './Entity';
import { getRandomInt } from './math';

export class Physics extends Trait {
    constructor() {
        super('physics');
    }

    update(entity, deltaTime, level) {
        entity.pos.x += entity.vel.x * deltaTime;
        level.tileCollider.checkX(entity);

        entity.pos.y += entity.vel.y * deltaTime;
        level.tileCollider.checkY(entity);

        entity.vel.y += level.gravity * deltaTime;
    }
}

export class AutoJump extends Trait {
    constructor() {
        super('autojump');
    }
    
    update(entity, deltaTime, level) {
        const distance = entity.vel.x * 0.3;
        const willCollide = level.tileCollider.willCollideX(entity, distance);

        if(willCollide) {
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

export class Run extends Trait {
    constructor() {
        super('run');

        this.speed = 13000;
        this.distance = 0;
    }

    update(entity, deltaTime) {
        entity.vel.x = this.speed * deltaTime;
        this.distance += Math.abs(entity.vel.x) * deltaTime;
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
    }

    get fallingDown() {
        return this.ready < 0 && this.falling;
    }

    get jumpingUp() {
        return this.ready < 0 && this.jumping;
    }

    start() {
        this.requestTime = this.gracePeriod;
    }

    cancel() {
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
        if(this.ready < 0 && entity.vel.y < 0) {
            this.jumping = true;
            this.falling = false;            
        } else if(this.ready < 0 && entity.vel.y > 0) {
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
            entity.vel.y = -(
                this.velocity +
                Math.abs(entity.vel.x) * this.speedBoost
            );
            this.engageTime -= deltaTime;
            if(this.engageTime < 0) {
                this.engageTime = 0;
            }
        }

        this.ready--;
    }
}

export class Killable extends Trait {
    constructor() {
        super('killable');
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = 0.3;
    }

    kill() {
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
        }
    }
}

export class Pickable extends Trait {
    constructor() {
        super('pickable');
        this.picked = false;
        this.pickTime = 0;
        this.removeAfter = 0.3;
    }

    pick() {
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

export class Picker extends Trait {
    constructor() {
        super('picker');
        this.onPick = function() {};
    }

    collides(us, them) {
        if (!them.pickable || them.pickable.picked) {
            return;
        }

        this.onPick(us, them);
    }
}
