import { loadImage } from './loaders';
import { SpriteSheet } from './SpriteSheet';
import { TileResolver } from './TileCreation';
import { clamp } from './math';

export function createBackgroundLayer(level, tiles, image) {
    const resolver = new TileResolver(tiles);
    const buffer = document.createElement('canvas');
    const sprites = new SpriteSheet('background', image, 60, 60);

    sprites.define('ground', 0, 0, 60, 60);

    buffer.width = 1024 + 60;
    buffer.height = 600 + 60;

    const context = buffer.getContext('2d');

    function redraw(x, y, width, height) {
        context.clearRect(0, 0, buffer.width, buffer.height);

        const startX = x;
        const endX = x + width;
        const startY = y;
        const endY = y + height;

        for (let x = startX; x <= endX; ++x) {
            for (let y = startY; y <= endY; y++) {
                const tile = tiles.get(x, y);
                if (tile) {
                    sprites.drawTile('ground', context, x - startX, y - startY);
                }
            }
        }
    }

    return function drawBackgroundLayer(context, camera) {
        const width = resolver.toIndex(camera.size.x);
        const height = resolver.toIndex(camera.size.y);
        const x = resolver.toIndex(camera.pos.x);
        const y = resolver.toIndex(camera.pos.y);

        const xOffset = x < 0 ? 60 : 0;
        const yOffset = y < 0 ? 60 : 0;

        redraw(x, y, width, height);

        context.drawImage(buffer, -camera.pos.x % 60 - xOffset, -camera.pos.y % 60 - yOffset);
    };
}

export function drawStaticBackground(level) {
    const buffer = document.createElement('canvas');
    buffer.width = 1024 + 60;
    buffer.height = 600 + 60;

    const context = buffer.getContext('2d');

    let images;

    loadImages({
        CloudsImage: require('../img/clouds.png'),
        BackImage: require('../img/mountains.png'),
        FrontImage: require('../img/forest.png')
    }).then(result => (images = result));

    function drawGradient(context, camera) {
        const gradient = context.createLinearGradient(0, 0, 0, buffer.width);

        const camY = Math.abs(camera.pos.y);

        const step1 = clamp(0, 0, 1);
        const step2 = clamp(0.4 - camY * 0.0001, 0, 1);
        const step3 = clamp(0.8, 0, 1);

        gradient.addColorStop(step1, '#256bcc');
        gradient.addColorStop(step2, '#2278c6');
        gradient.addColorStop(step3, '#00c7a4');
        context.fillStyle = gradient;
        context.fillRect(0, 0, buffer.width, buffer.height);
    }

    function loadImages(urlMap) {
        const names = Object.keys(urlMap);
        const urls = Object.values(urlMap);

        return Promise.all(urls.map(url => loadImage(url))).then(images =>
            images.reduce((result, image, idx) => {
                result[names[idx]] = image;
                return result;
            }, {})
        );
    }

    function drawImages(context, camera) {
        const CloudsImage = images.CloudsImage;
        const BackImage = images.BackImage;
        const FrontImage = images.FrontImage;

        const backMargin = 1000;
        const count = Math.floor(level.distance / FrontImage.width) + 5;

        const SkyCoordX = -camera.pos.x / 3;
        const BackCoordX = -camera.pos.x / 2;
        const FrontCoordX = -camera.pos.x / 1;

        const SkyCoordY = -camera.pos.y * 0.05;
        const BackCoordY = -camera.pos.y * 0.07;
        const FrontCoordY = -camera.pos.y * 0.2;

        for (let i = 0; i < count; i++) {
            context.drawImage(
                CloudsImage,
                SkyCoordX + CloudsImage.width * i + backMargin,
                SkyCoordY
            );
            context.drawImage(
                BackImage,
                BackCoordX + BackImage.width * i,
                BackCoordY + camera.size.y - BackImage.height
            );
            context.drawImage(
                FrontImage,
                FrontCoordX + FrontImage.width * i,
                FrontCoordY + camera.size.y - FrontImage.height
            );
        }
    }

    return function drawStaticBackgroundLayer(context, camera) {
        drawGradient(context, camera);

        if (images) {
            drawImages(context, camera);
        }
    };
}

export function createSpriteLayer(entities, width = 240, height = 350) {
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
                entity.pos.y - camera.pos.y
            );
        });
    };
}
