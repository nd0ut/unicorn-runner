export function updateTileGrid(spec, grid) {
    const ranges = [];

    for (const { x, y, tile } of grid) {
        ranges.push([x, y]);
    }

    spec.layers[0].tiles[0].ranges = ranges;
}

export function updateEntity(levelSpec, idx, specUpdates) {
    const entitySpec = levelSpec.entities[idx];

    levelSpec.entities[idx] = {
        ...entitySpec,
        ...specUpdates
    }
}
