import { Entity } from './Entity';
import { loadSpriteSheet, loadSounds } from './loaders';

function getDrawFn(sprite, animations, bounds) {
    const routeAnim = animations(sprite);

    return function(context) {
        sprite.draw(routeAnim(this), context, 0, 0, bounds);
    };
}

const defaultOptions = {
    spriteSpecs: [],
    soundSpecs: [],

    traits: undefined,
    animations: undefined,
    sounds: undefined,
    size: undefined,
    offset: undefined,

    drawBounds: false,
    afterCreate: undefined
};

export function defineGameObject(name, options) {
    const {
        spriteSpecs,
        soundSpecs,
        traits,
        animations,
        sounds,
        size,
        offset,
        drawBounds,
        afterCreate
    } = { ...defaultOptions, ...options };

    return async () => {
        const [sprites, soundSets] = await Promise.all([
            Promise.all(spriteSpecs.map(spec => loadSpriteSheet(spec))),
            Promise.all(soundSpecs.map(spec => loadSounds(spec)))
        ]);

        return (options = { skinName: 'default' }) => {
            const { skinName } = options;

            const skinSprite = sprites.find(sprite => sprite.skinName === skinName);
            const skinSounds = soundSets.find(sound => sound.skinName === skinName);

            const entity = new Entity(name);
            entity.size.set(size[0], size[1]);
            entity.offset.x = offset[0];
            entity.offset.y = offset[1];

            traits({ ...options, sounds: skinSounds }).forEach(trait =>
                entity.addTrait(trait)
            );

            const bounds = drawBounds ? entity.bounds.clone() : undefined;
            entity.draw = getDrawFn(skinSprite, animations, bounds);

            entity.voice = sounds ? sounds(skinSounds) : undefined;

            afterCreate && afterCreate(entity);

            return entity;
        };
    };
}
