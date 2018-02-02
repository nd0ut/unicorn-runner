import { splashText } from '../Splash';
import { Striker } from '../Traits';

export async function loadEditorLevel(editor, levelSpec) {
    const level = await editor.loadLevel(levelSpec);

    function startLevel() {
        editor.timer.update = (deltaTime, time) => {
            level.update(deltaTime);
            editor.levelManager.update(deltaTime, time);
            level.comp.draw(editor.context, editor.camera);
        };
    }

    return {
        level,
        startLevel
    };
}
