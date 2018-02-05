export class ClipBox {
    constructor(pos, size, offset) {
        this.pos = pos;
        this.size = size;
        this.offset = offset;
    }

    overlaps(box) {
        return this.bottom > box.top
            && this.top < box.bottom
            && this.left < box.right
            && this.right > box.left;
    }

    contains(pos) {
        return this.bottom >= pos.y
            && this.top <= pos.y
            && this.left <= pos.x
            && this.right >= pos.x
    }

    clone() {
        return new ClipBox(
            Object.assign({}, this.pos),
            Object.assign({}, this.size),
            Object.assign({}, this.offset)
        );
    }

    get width() {
        return this.size.x;
    }

    get height() {
        return this.size.y;
    }

    get bottom() {
        return this.pos.y + this.size.y + this.offset.y;
    }

    set bottom(y) {
        this.pos.y = y - (this.size.y + this.offset.y);
    }

    get top() {
        return this.pos.y + this.offset.y;
    }

    set top(y) {
        this.pos.y = y - this.offset.y;
    }

    get left() {
        return this.pos.x + this.offset.x;
    }

    set left(x) {
        this.pos.x = x - this.offset.x;
    }

    get right() {
        return this.pos.x + this.size.x + this.offset.x;
    }

    set right(x) {
        this.pos.x = x - (this.size.x + this.offset.x);
    }
}
