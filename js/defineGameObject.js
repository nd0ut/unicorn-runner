import { Entity } from './Entity';
import { loadSpriteSheet } from './loaders';

function getDrawFn(sprite, animations) {
    const routeAnim = animations(sprite);

    return function(context) {
        sprite.draw(routeAnim(this), context, 0, 0);
    };
}

export function defineGameObject(name, { specs, traits, animations, size, offset }) {
    return async () => {
        const sprites = await Promise.all(specs.map(spec => loadSpriteSheet(spec)));

        return (options = { skinName: 'default' }) => {
            const { skinName } = options;
            
            const sprite = sprites.find(sprite => sprite.skinName === skinName);
    
            const entity = new Entity(name);
            entity.size.set(size[0], size[1]);
            entity.offset.x = offset[0];
            entity.offset.y = offset[1];

            traits(options).forEach(trait => entity.addTrait(trait));
    
            entity.draw = getDrawFn(sprite, animations);
    
            return entity;
        }
    };
}
