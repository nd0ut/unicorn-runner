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
        if (
            subject.bounds.left > candidate.bounds.left &&
            subject.bounds.left < candidate.bounds.right
        ) {
            return Sides.LEFT;
        }

        if (
            subject.bounds.right < candidate.bounds.right &&
            subject.bounds.right > candidate.bounds.left
        ) {
            return Sides.RIGHT;
        }
    }

    getSideY(subject, candidate) {        
        if (
            subject.bounds.top > candidate.bounds.top &&
            subject.bounds.top < candidate.bounds.bottom
        ) {
            return Sides.TOP;
        }

        if (
            subject.bounds.bottom < candidate.bounds.bottom &&
            subject.bounds.bottom > candidate.bounds.top
        ) {
            return Sides.BOTTOM;
        }
    }
}
