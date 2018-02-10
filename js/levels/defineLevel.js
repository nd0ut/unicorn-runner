export function defineLevel(spec, options) {
    async function init(game) {
        const level = await game.loadLevel(spec);
        const playerEnv = game.playerEnv;
        const unicorn = game.entityFactory.unicorn();
        level.entities.add(playerEnv);

        playerEnv.playerController.checkpoint.set(spec.spawn[0], spec.spawn[1]);

        function startLevel() {
            options.onStart && options.onStart(game, level);

            playerEnv.playerController.setPlayer(unicorn);
            game.cameraController.focus.follow(unicorn);

            game.timer.update = (deltaTime, time) => {
                level.update(deltaTime);
                game.levelManager.update(deltaTime, time, level);
                game.cameraController.update(deltaTime, time, level);
                level.comp.draw(game.context, game.camera);

                options.afterUpdate && options.afterUpdate(game, level);
            };
        }

        function stopLevel() {
            for (const [name, sound] of level.sounds.entries()) {
                sound.stop();
            }
        }

        return {
            level,
            startLevel,
            stopLevel
        };
    }

    return {
        spec,
        init
    };
}
