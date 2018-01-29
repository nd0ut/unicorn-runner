import { Entity } from '../Entity';
import { PlayerController } from '../PlayerController';
import { InteractionController } from '../InteractionController';

export function createPlayerEnv(game) {
    const playerEnv = new Entity('player');

    const playerControl = new PlayerController();
    playerControl.checkpoint.set(64, 64);
    playerEnv.addTrait(playerControl);

    const interactionControl = new InteractionController(game);
    playerEnv.addTrait(interactionControl);

    return playerEnv;
}
