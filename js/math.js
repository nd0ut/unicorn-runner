export class Matrix {
    constructor() {
        this.grid = [];
    }

    get(x, y) {
        const col = this.grid[x];
        if (col) {
            return col[y];
        }
        return undefined;
    }

    set(x, y, value) {
        if (!this.grid[x]) {
            this.grid[x] = [];
        }

        this.grid[x][y] = value;
    }

    width() {
        return this.grid.length;
    }
}

export class Vec2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }
}

export function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}

export const rand = {
    int: (min, max) => Math.floor(rand.float(min, ++max)),
    float: (min, max) => Math.random() * (max - min) + min
};
