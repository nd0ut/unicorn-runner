import { Entity } from './Entity';
import { loadSpriteSheet, loadSounds } from './loaders';

function getDrawFn(sprite, animations) {
    const routeAnim = animations(sprite);

    return function(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    };
}

const defaultOptions = {
    spriteSpecs: [],
    soundSpecs: [],

    traits: undefined,
    animations: undefined,
    sounds: undefined,
    size: undefined,
    offset: undefined
};

export function defineGameObject(name, options) {
    const {
        spriteSpecs,
        soundSpecs,
        traits,
        animations,
        sounds,
        size,
        offset
    } = { ...defaultOptions, ...options };

    return async () => {
        const [sprites, sounds] = await Promise.all([
            Promise.all(spriteSpecs.map(spec => loadSpriteSheet(spec))),
            Promise.all(soundSpecs.map(spec => loadSounds(spec)))
        ]);

        return (options = { skinName: 'default' }) => {
            const { skinName } = options;

            const skinSprite = sprites.find(sprite => sprite.skinName === skinName);
            const skinSounds = sounds.find(sound => sound.skinName === skinName);

            const entity = new Entity(name);
            entity.size.set(size[0], size[1]);
            entity.offset.x = offset[0];
            entity.offset.y = offset[1];

            traits({ ...options, sounds: skinSounds }).forEach(trait =>
                entity.addTrait(trait)
            );

            entity.draw = getDrawFn(skinSprite, animations);

            return entity;
        };
    };
}
