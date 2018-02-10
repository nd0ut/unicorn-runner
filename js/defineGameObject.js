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
        drawBounds,
        afterCreate
    } = {
        ...defaultOptions,
        ...options
    };

    return async () => {
        const [sprites, soundSets] = await Promise.all([
            Promise.all(spriteSpecs.map(spec => loadSpriteSheet(spec))),
            Promise.all(soundSpecs.map(spec => loadSounds(spec)))
        ]);

        function create(options = {}) {
            const skinName = options.skinName || 'default';

            let skinSprite = sprites.find(sprite => sprite.skinName === skinName);
            let spriteSpec = spriteSpecs.find(spec => spec.skinName === skinName);

            const skinSounds = soundSets.find(sound => sound.skinName === skinName);

            if(!skinSprite) {
                console.warn(`Skin "${name} [${skinName}]" not found. Fallback to the first one.`);
                skinSprite = sprites[0];
                spriteSpec = spriteSpecs[0];
            }

            const entity = new Entity(name);
            entity.size.set(spriteSpec.size[0], spriteSpec.size[1]);
            entity.offset.x = spriteSpec.offset[0];
            entity.offset.y = spriteSpec.offset[1];

            traits({ ...options, sounds: skinSounds }).forEach(trait => entity.addTrait(trait));

            const bounds = drawBounds ? entity.bounds.clone() : undefined;
            entity.draw = getDrawFn(skinSprite, animations, bounds);

            entity.voice = sounds ? sounds(skinSounds) : undefined;

            afterCreate && afterCreate(entity);

            return entity;
        };

        create.availableSkins = sprites.map(s => s.skinName || 'default');
        
        return create;
    };
}
