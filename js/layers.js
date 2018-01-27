import { loadImage } from './loaders';
import { SpriteSheet } from './SpriteSheet';
import { TileResolver } from './TileCreation';

export function createBackgroundLayer(level, tiles, image) {
    const resolver = new TileResolver(tiles);
    const buffer = document.createElement('canvas');
    const sprites = new SpriteSheet(image, 60, 60);

    sprites.define('ground', 0, 0, 60, 60);

    buffer.width = 840 + 60;
    buffer.height = 660;

    const context = buffer.getContext('2d');

    function redraw(startIndex, endIndex)  {
        context.clearRect(0, 0, buffer.width, buffer.height);

        for (let x = startIndex; x <= endIndex; ++x) {
            const col = tiles.grid[x];
            if (col) {
                col.forEach((tile, y) => {
                    sprites.drawTile('ground', context, x - startIndex, y);
                });
            }
        }
    }

    return function drawBackgroundLayer(context, camera) {
        const drawWidth = resolver.toIndex(camera.size.x);
        const drawFrom = resolver.toIndex(camera.pos.x);
        const drawTo = drawFrom + drawWidth;

        redraw(drawFrom, drawTo);

        context.drawImage(buffer,
            -camera.pos.x % 60,
            -camera.pos.y);
    };
}

export function drawStaticBackground() {
    const buffer = document.createElement('canvas');
    buffer.width = 840 + 60;
    buffer.height = 660;

    let BackImage;
    let CloudsImage;
    let FrontImage;
    let loaded = 0;
    const context = buffer.getContext('2d');

    function drawGradient(context) {
        let gradient = context.createLinearGradient(0, 0, 0, buffer.width);
        gradient.addColorStop(0, '#256bcc');
        gradient.addColorStop(0.4, '#2278c6');
        gradient.addColorStop(0.8, '#00c7a4');
        context.fillStyle = gradient;
        context.fillRect(0, 0, buffer.width, buffer.height);
    }

    function loadGrass() {
        loadImage(require('../img/clouds.png')).then(function(result) {
            CloudsImage = result;
            loaded++;
        });

        loadImage(require('../img/mountains.png')).then(function(result) {
            BackImage = result;
            loaded++;
        });

        loadImage(require('../img/forest.png')).then(function(result) {
            FrontImage = result;
            loaded++;
        });
    }

    function drawGrass(context, camera) {
        let BackCoordX = -camera.pos.x / 0.8;
        let SkyCoordX = -camera.pos.x / 1.2;
        let FrontCoordX = -camera.pos.x / 0.7;

        for (let i = 0; i < 30; i++) {
            context.drawImage(CloudsImage, SkyCoordX + BackImage.width * i + 600, 0);
            context.drawImage(BackImage, BackCoordX + BackImage.width * i, buffer.height - BackImage.height + 1);
            context.drawImage(FrontImage, FrontCoordX + FrontImage.width * i, buffer.height - FrontImage.height + 1);
        }
    }

    loadGrass();
    return function drawBackgroundLayer(context, camera) {
        if (loaded > 2) {
            drawGradient(context);
            drawGrass(context, camera);
        }
    }
}

export function createSpriteLayer(entities, width = 172, height = 142) {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawSpriteLayer(context, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);

            entity.draw(spriteBufferContext);

            context.drawImage(
                spriteBuffer,
                entity.pos.x - camera.pos.x,
                entity.pos.y - camera.pos.y);
        });
    };
}
