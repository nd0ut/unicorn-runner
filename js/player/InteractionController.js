import { Trait } from "../Entity";

export class InteractionController extends Trait {
    constructor(game) {
        super('interactionController');

        this.game = game;

        this.setupHandlers();
    }

    get entityFactory() {
        return this.game.entityFactory;
    }

    get playerController() {
        return this.game.playerEnv.playerController;
    }

    get currentLevel() {
        return this.game.level;
    }

    setupHandlers() {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, e => {
                this.keyHandler(e);
            });
        });
    }

    keyHandler(e) {
        switch (e.code) {
            case 'Space':
                this.jumpHandler(e);
                break;
            case 'KeyF':
                this.strikeFireballHandler(e)
            default:
                break;
        }
    }

    strikeFireballHandler(e) {
        if (e.repeat || !this.playerController.canStrikeFireballs()) {
            return;
        }

        const unicorn = this.playerController.player;
        const fireball = this.entityFactory.bullet({ 
            skinName: 'fireball', 
            ownerEntity: unicorn 
        });
        unicorn.striker.strike(fireball, this.currentLevel);
    }

    jumpHandler(e) {
        const unicorn = this.playerController.player;
        const keyState = e.type === 'keydown' ? 1 : 0;

        if(unicorn.killable.dead) {
            return;
        }

        if (keyState > 0) {
            unicorn.jump.start();
        } else {
            unicorn.jump.cancel();
        }
    }
}
