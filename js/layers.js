import { loadImage } from './loaders';
import { SpriteSheet } from './SpriteSheet';
import { TileResolver } from './TileCreation';

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
                if(tile) {
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

    function drawGradient(context) {
        let gradient = context.createLinearGradient(0, 0, 0, buffer.width);
        gradient.addColorStop(0, '#256bcc');
        gradient.addColorStop(0.4, '#2278c6');
        gradient.addColorStop(0.8, '#00c7a4');
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
        let CloudsImage = images.CloudsImage;
        let BackImage = images.BackImage;
        let FrontImage = images.FrontImage;

        const backMargin = 1000;
        const count = Math.floor(level.distance / FrontImage.width) + 5;

        let SkyCoordX = -camera.pos.x / 3;
        let BackCoordX = -camera.pos.x / 2;
        let FrontCoordX = -camera.pos.x / 1;

        for (let i = 0; i < count; i++) {
            context.drawImage(CloudsImage, SkyCoordX + CloudsImage.width * i + backMargin, 0);
            context.drawImage(
                BackImage,
                BackCoordX + BackImage.width * i,
                -camera.pos.y + camera.size.y - BackImage.height
            );
            context.drawImage(
                FrontImage,
                FrontCoordX + FrontImage.width * i,
                -camera.pos.y + camera.size.y - FrontImage.height
            );
        }
    }

    return function drawStaticBackgroundLayer(context, camera) {
        drawGradient(context);

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
