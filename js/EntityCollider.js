import { Sides } from './Entity';

export class EntityCollider {
    constructor(entities) {
        this.entities = entities;
    }

    check(subject) {
        this.entities.forEach(candidate => {
            if (subject === candidate) {
                return;
            }

            if (subject.bounds.overlaps(candidate.bounds)) {
                const side =
                    this.getSideY(subject, candidate) ||
                    this.getSideX(subject, candidate);
                subject.collides(candidate, side);
            }
        });
    }

    getSideX(subject, candidate) {
        const movingRight = subject.vel.x > 0;
        const movingRightFaster = subject.vel.x > candidate.vel.x;
        if (movingRight && movingRightFaster) {
            if (subject.bounds.right > candidate.bounds.left) {
                return Sides.RIGHT;
            }
        }

        const movingLeft = subject.vel.x < 0;
        const movingLeftFaster = subject.vel.x < candidate.vel.x;
        if (movingLeft && movingLeftFaster) {
            if (subject.bounds.left < candidate.bounds.right) {
                return Sides.LEFT;
            }
        }
    }

    getSideY(subject, candidate) {
        const movingDown = subject.vel.y > 0;
        const movingDownFaster = subject.vel.y > candidate.vel.y;
        if (movingDown && movingDownFaster) {
            if (subject.bounds.bottom > candidate.bounds.top) {
                return Sides.BOTTOM;
            }
        } 

        const movingUp = subject.vel.y < 0;
        const movingUpFaster = subject.vel.y < candidate.vel.y;
        if (movingUp && movingUpFaster) {
            if (subject.bounds.top < candidate.bounds.bottom) {
                return Sides.TOP;
            }
        }
    }
}
