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

export function createStaticBackgroundLayer(level, backgroundSprites, getGradientSteps) {
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

        const steps = getGradientSteps(camera.pos);

        for(const [color, step] of steps) {    
            gradient.addColorStop(step, color);
        }

        context.fillStyle = gradient;
        context.fillRect(0, 0, buffer.width, buffer.height);
    }

    function drawImages(context, camera) {
        const SkyImage = images.SkyImage;
        const BackImage = images.BackImage;
        const FrontImage = images.FrontImage;

        const skyMargin = 500;
        const widthMetric = FrontImage || BackImage || SkyImage;
        const count = Math.floor(level.distance / (widthMetric ? widthMetric.width : 1)) + 5;

        const SkyCoordX = -camera.pos.x / 2.9;
        const BackCoordX = -camera.pos.x / 1.9;
        const FrontCoordX = -camera.pos.x / 0.9;

        const SkyCoordY = -camera.pos.y * 0.05;
        const BackCoordY = -camera.pos.y * 0.07;
        const FrontCoordY = -camera.pos.y * 0.2;

        for (let i = 0; i < count; i++) {
            SkyImage && context.drawImage(
                SkyImage,
                SkyCoordX + SkyImage.width * i + i * skyMargin,
                SkyCoordY
            );
            BackImage && context.drawImage(
                BackImage,
                BackCoordX + BackImage.width * i,
                BackCoordY + camera.size.y - BackImage.height
            );
            FrontImage && context.drawImage(
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
            context.rect(tile.x1 - camera.pos.x, tile.y1 - camera.pos.y, tile.x2 - tile.x1, tile.y2 - tile.y1);
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
