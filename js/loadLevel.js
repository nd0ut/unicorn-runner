import { createBackgroundLayer, createSpriteLayer, createStaticBackgroundLayer } from './layers';
import { Level } from './Level';
import { loadImages, loadSounds, loadSpriteSheet } from './loaders';
import { Matrix } from './math';

function setupTileGrid(levelSpec, level) {
    const tileGrid = createTileGrid(levelSpec.tiles);
    level.setTileGrid(tileGrid);
    level.setDistance(tileGrid.width() * 60);
}

function setupBackgrounds(
    levelSpec,
    level,
    backgroundImages,
    getGradientSteps,
    tileSprite
) {
    const backgroundLayer = createBackgroundLayer(level, tileSprite);
    const staticBackgroundLayer = createStaticBackgroundLayer(
        level,
        backgroundImages,
        getGradientSteps
    );
    level.comp.addLayer(staticBackgroundLayer);
    level.comp.addLayer(backgroundLayer);
}

function setupEntities(levelSpec, level, entityFactory) {
    levelSpec.entities.forEach((tileSpec, idx) => {
        const createEntity = entityFactory[tileSpec.name];
        const entity = createEntity(tileSpec);
        entity.pos.set(tileSpec.pos[0], tileSpec.pos[1]);
        entity.idx = idx;

        level.entities.add(entity);
        tileSpec.id && level.namedEntities.set(tileSpec.id, entity);
    });

    const spriteLayer = createSpriteLayer(level.entities);
    level.comp.addLayer(spriteLayer);
}

function setupSounds(level, sounds) {
    level.sounds = sounds;
}

export function createLevelLoader(entityFactory) {
    return function loadLevel(levelSpec) {
        return Promise.resolve(levelSpec)
            .then(levelSpec =>
                Promise.all([
                    levelSpec,
                    loadImages(levelSpec.background.images),
                    levelSpec.background.gradient,
                    loadSpriteSheet(levelSpec.tileSprite),
                    levelSpec.sounds && loadSounds(levelSpec)
                ])
            )
            .then(
                ([levelSpec, backgroundImages, getGradientSteps, tileSprite, sounds]) => {
                    const level = new Level(levelSpec.name);

                    setupTileGrid(levelSpec, level);
                    setupBackgrounds(
                        levelSpec,
                        level,
                        backgroundImages,
                        getGradientSteps,
                        tileSprite
                    );
                    setupEntities(levelSpec, level, entityFactory);
                    setupSounds(level, sounds);

                    return level;
                }
            );
    };
}

function createTileGrid(tiles) {
    const grid = new Matrix();

    for (const { skinName, x, y } of expandTiles(tiles)) {
        const tile = {
            skinName: skinName || 'default'
        };
        grid.set(x, y, tile);
    }

    return grid;
}

function* expandSpan(skinName, xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield { skinName, x, y };
        }
    }
}

function expandRange(range) {
    const skinDeclared = typeof range[0] === 'string';
    const skinName = skinDeclared ? range[0] : undefined;

    range = skinDeclared ? range.slice(1) : range;

    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(skinName, xStart, xLen, yStart, yLen);
    } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        return expandSpan(skinName, xStart, xLen, yStart, 1);
    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(skinName, xStart, 1, yStart, 1);
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        yield* expandRange(range);
    }
}

function* expandTiles(tiles) {
    yield* expandRanges(tiles);
}
