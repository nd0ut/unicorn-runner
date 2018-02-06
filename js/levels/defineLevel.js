export function defineLevel(spec, options) {
    async function init(game) {
        const level = await game.loadLevel(spec);
        const playerEnv = game.playerEnv;
        const unicorn = game.entityFactory.unicorn();
        level.entities.add(playerEnv);

        function startLevel() {
            options.onStart && options.onStart(game, level);

            playerEnv.playerController.setPlayer(unicorn);
            game.cameraController.focus.follow(unicorn);

            game.timer.update = (deltaTime, time) => {
                level.update(deltaTime);
                game.levelManager.update(deltaTime, time, level);
                game.cameraController.update(deltaTime, time, level);
                level.comp.draw(game.context, game.camera);
            };
        }

        return {
            level,
            startLevel
        };
    }

    return {
        spec,
        init
    };
}
