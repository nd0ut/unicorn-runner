import { clamp } from './math';
import { TileResolver } from './TileCreation';

export function createBackgroundLayer(level, tileSprite) {
    const resolver = new TileResolver(level.tileGrid);
    const buffer = document.createElement('canvas');

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
                const tile = level.tileGrid.get(x, y);
                if (tile) {
                    const skinName = tile.skinName || 'default';
                    tileSprite.drawTile(skinName, context, x - startX, y - startY);
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

        context.drawImage(
            buffer,
            -camera.pos.x % 60 - xOffset,
            -camera.pos.y % 60 - yOffset
        );
    };
}

export function createStaticBackgroundLayer(level, backgroundSprites) {
    const buffer = document.createElement('canvas');
    buffer.width = 1024 + 60;
    buffer.height = 600 + 60;

    const context = buffer.getContext('2d');

    const images = {
        SkyImage: backgroundSprites.sky,
        BackImage: backgroundSprites.back,
        FrontImage: backgroundSprites.front
    };

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

    function drawImages(context, camera) {
        const SkyImage = images.SkyImage;
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
                SkyImage,
                SkyCoordX + SkyImage.width * i + backMargin,
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
        drawImages(context, camera);
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

export function createDebugLayer(editor) {
    const buffer = document.createElement('canvas');
    buffer.width = 1024 + 60;
    buffer.height = 600 + 60;

    const context = buffer.getContext('2d');

    function drawEntityBounds(camera) {
        context.clearRect(0, 0, buffer.width, buffer.height);

        const camBounds = camera.getBounds();
        const level = editor.level;

        const selectedEntity = editor.selection.selectedEntity;
        const selectedTile = editor.selection.selectedTile;

        if (selectedEntity) {
            for (const e of level.entities) {
                if (!camBounds.overlaps(e.bounds)) {
                    continue;
                }
                context.beginPath();
                context.strokeStyle = selectedEntity === e ? 'white' : 'black';
                context.lineWidth = selectedEntity === e ? 2 : 1;
                context.rect(
                    e.bounds.left - camBounds.left,
                    e.bounds.top - camBounds.top,
                    e.size.x,
                    e.size.y
                );
                context.stroke();
                context.closePath();
            }
        } else if (selectedTile) {
            const tile = selectedTile;

            context.beginPath();
            context.strokeStyle = 'white';
            context.lineWidth = 2;
            context.rect(tile.x1, tile.y1, tile.x2 - tile.x1, tile.y2 - tile.y1);
            context.stroke();
            context.closePath();
        }
    }

    function drawLayer(context, camera) {
        drawEntityBounds(camera);

        context.drawImage(buffer, 0, 0);
    }

    return function drawDebugLayer(context, camera) {
        drawLayer(context, camera);
    };
}
