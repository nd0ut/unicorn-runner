import { Trait } from '../Entity';

export class InteractionController extends Trait {
    constructor(game) {
        super('interactionController');

        this.game = game;
        this.shiftPressed = false;

        this.setupHandlers();
    }

    get entityFactory() {
        return this.game.entityFactory;
    }

    get playerController() {
        return this.game.playerEnv.playerController;
    }

    get currentLevel() {
        return this.game.levelManager.level;
    }

    setupHandlers() {
        ['keydown', 'keyup'].forEach(eventName => {
            window.addEventListener(eventName, e => {
                this.keyHandler(e);
            });
        });
    }

    keyHandler(e) {
        if(!this.playerController.player) {
            return;
        }
        
        this.handleKeyEvent(e);

        switch (e.code) {
            case 'Space':
                this.jumpHandler(e);
                break;
            case 'KeyF':
                this.strikeFireballHandler(e);
            default:
                break;
        }
    }

    handleKeyEvent(e) {
        const shiftPressed = e.shiftKey;        
        this.shiftPressed = shiftPressed;        
    }

    boostChecker() {
        const unicorn = this.playerController.player;

        if (unicorn.killable.dead || unicorn.jump.inAir) {
            unicorn.run.cancelBoost();            
            return;
        }

        if (this.shiftPressed && this.playerController.canBoost() && !unicorn.run.boosted) {
            unicorn.run.boost(30000);
        }

        if(!this.shiftPressed && unicorn.run.boosted) {
            unicorn.run.cancelBoost();                        
        }
    }

    strikeFireballHandler(e) {
        const down = e.type === 'keydown';

        if (!down || !this.playerController.canStrikeFireballs()) {
            return;
        }

        const unicorn = this.playerController.player;
        const fireball = this.entityFactory.bullet({
            skinName: 'default',
            ownerEntity: unicorn
        });
        unicorn.striker.strike(fireball, this.currentLevel);
    }

    jumpHandler(e) {
        const unicorn = this.playerController.player;
        const keyState = e.type === 'keydown' ? 1 : 0;

        if (unicorn.killable.dead) {
            return;
        }

        if (keyState > 0) {
            unicorn.jump.start();
        } else {
            unicorn.jump.cancel();
        }
    }

    update() {
        this.boostChecker();
    }
}
