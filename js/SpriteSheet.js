export class SpriteSheet {
    constructor(skinName, image, width, height) {
        this.skinName = skinName || 'default';
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
        this.animations = new Map();
    }

    defineAnim(name, animation) {
        this.animations.set(name, animation);
    }

    define(name, x, y, width, height) {
        const buffers = [false, true].map(() => {
            const buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;

            const context = buffer.getContext('2d');

            context.drawImage(
                this.image,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height);

            return buffer;
        });

        this.tiles.set(name, buffers);
    }

    draw(name, context, x, y, bounds = undefined) {
        const buffer = this.tiles.get(name)[0];
        context.drawImage(buffer, x, y);

        if (bounds) {
            context.beginPath();
            context.rect(bounds.left, bounds.top, bounds.width, bounds.height);
            context.stroke();

            context.rect(x, y, buffer.width, buffer.height);
            context.stroke();
            context.closePath();            
        }
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
}
