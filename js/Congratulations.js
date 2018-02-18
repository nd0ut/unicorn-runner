import { loadSounds } from './loaders';
import { splash } from './Splash';

const soundsPromise = loadSounds({
    sounds: [
        {
            url: require('../sounds/win.wav'),
            name: 'win'
        }
    ]
});

export async function doCongratulations(game) {
    const sounds = await soundsPromise;
    sounds.get('win').playOnce();

    const pc = game.playerEnv.playerController;

    await splash('you win! <br> congratulations!', {
        size: 50,
        background: 'rgba(0,0,0,0.5)'
    });

    const html = `
            score: ${pc.totalScore} <br> 
            Deaths: ${pc.deaths}
        `;
    splash(html, { size: 50, background: 'rgba(0,0,0,0.5)', timeout: 100000 });
}
