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
                    this.getSideY(subject, candidate)
                    // this.getSideX(subject, candidate);
                console.log(side);
                subject.collides(candidate, side);
            }
        });
    }

    getSideX(subject, candidate) {
        if (subject.vel.x > 0) {
            if (subject.bounds.right > candidate.bounds.left) {
                return Sides.RIGHT;
            }
        } else if (subject.vel.x < 0) {
            if (subject.bounds.left < candidate.bounds.right) {
                return Sides.LEFT;
            }
        }
    }

    getSideY(subject, candidate) {
        if (subject.vel.y > 0) {
            if (subject.bounds.bottom > candidate.bounds.top) {
                return Sides.BOTTOM;
            }
        } else if (subject.vel.y < 0) {
            if (subject.bounds.top < candidate.bounds.bottom) {
                return Sides.TOP;
            }
        }
    }
}
