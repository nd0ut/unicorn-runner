export function updateTileGrid(spec, grid) {
    const ranges = [];

    for (const { x, y, tile } of grid) {
        ranges.push([tile.skinName || 'default', x, y]);
    }

    spec.tiles = ranges;
}

export function updateEntity(levelSpec, idx, specUpdates) {
    const entitySpec = levelSpec.entities[idx];

    levelSpec.entities[idx] = {
        ...entitySpec,
        ...specUpdates
    };
}

export function createEntity(levelSpec, entitySpec) {
    const idx = levelSpec.entities.length + 1;
    levelSpec.entities[idx] = entitySpec;
    return idx;
}

export function removeEntity(levelSpec, idx) {
    delete levelSpec.entities[idx];
}

export async function saveLocal(levelIdx, levelSpec) {
    // remove deleted entities and sort by x
    const entities = levelSpec.entities
        .filter(e => !!e)
        .sort((a, b) => (a.pos[0] < b.pos[0] ? -1 : 1));
    
    const specUpdate = {
        entities,
        tiles: levelSpec.tiles
    };
    const body = JSON.stringify({ specUpdate, levelIdx });

    const url = 'http://localhost:12345/spec';
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    });

    const result = await resp.json();
    return result;
}
