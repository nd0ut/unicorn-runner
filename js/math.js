export class Matrix {
    constructor() {
        this.grid = [];
        this.offset = 100;
    }

    get(x, y) {
        x += this.offset;
        y += this.offset;

        const col = this.grid[x];
        if (col) {
            return col[y];
        }
        return undefined;
    }

    set(x, y, value) {
        x += this.offset;
        y += this.offset;

        if (!this.grid[x]) {
            this.grid[x] = [];
        }

        this.grid[x][y] = value;
    }

    remove(x, y) {
        x += this.offset;
        y += this.offset;

        delete this.grid[x][y];
    }

    width() {
        return this.grid.length - this.offset;
    }

    *[Symbol.iterator]() {
        for (let x = 0; x < this.grid.length; x++) {
            if (this.grid[x]) {
                for (let y = 0; y < this.grid[x].length; y++) {
                    const tile = this.grid[x][y];
                    if (tile) {
                        yield ({ 
                            tile ,
                            x: x - this.offset, 
                            y: y - this.offset
                        })
                    }
                }
            }
        }
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

    distance(vec) {
        const dist = Math.sqrt(Math.pow(vec.x - this.x, 2) + Math.pow(vec.y - this.y, 2));
        return dist;
    }
    
    static zero = new Vec2(0, 0);
}

export function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}

export const rand = {
    int: (min, max) => Math.floor(rand.float(min, ++max)),
    float: (min, max) => Math.random() * (max - min) + min
};

export function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}
