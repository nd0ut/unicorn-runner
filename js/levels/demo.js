import { rand, clamp } from '../math';
import { createPlayerEnv } from '../player/createPlayerEnv';
import { AutoJump } from '../Traits';

const N = 50;

function getEntities() {
    const choose = ['speedBooster'];
    // const choose = ['rainbow', 'speedBooster', 'portal'];
    // const choose = ['portal'];

    const entities = Array.from(Array(N)).map((val, idx) => ({
        name: choose[rand.int(0, choose.length - 1)],
        pos: [idx * rand.int(100, 2000) + 500, 100]
    }));

    return entities;
}

function getRanges() {
    let h = 5;
    let mul = 1;
    let x = 0;

    const ranges = Array.from(Array(N)).map(() => {
        mul = h === 0 ? 1 : mul;
        mul = h === 7 ? -1 : mul;

        const platformWidth = rand.int(6, 12);

        const range = [x, platformWidth, h, 1];
        h = h + mul;
        x = x + platformWidth + 1;

        return range;
    });

    return ranges;
}

const ranges = getRanges();
const entities = getEntities();

const spec = {
    background: {
        images: {},
        gradient: camPos => {
            const step = ['#ffffff', 0];
            const step2 = ['#ffffff', 1];
            return [step, step2];
        }
    },
    sounds: [
        {
            url: require('../../sounds/music/demo.wav'),
            name: 'music'
        }
    ],
    tileSprite: {
        imageURL: require('../../img/tiles/trak2_wall1a.png'),
        tileW: 60,
        tileH: 60,
        frames: [
            {
                name: 'default',
                rect: [0, 0, 60, 60]
            }
        ]
    },
    tiles: ranges,
    entities
};

async function init(game) {
    const level = await game.loadLevel(spec);

    const unicorn = game.entityFactory.unicorn();
    unicorn.addTrait(new AutoJump());

    const playerEnv = createPlayerEnv(game);
    level.entities.add(playerEnv);

    const playBtn = document.querySelector('.play-btn');
    playBtn.style.visibility = 'visible';

    function checkFinish() {
        if (unicorn.pos.x > level.distance) {
            unicorn.pos.x = 64;
            unicorn.pos.y = 64;
        }
    }

    function startLevel() {
        level.sounds.get('music').playLoop();

        playerEnv.playerController.setPlayer(unicorn);
        game.cameraController.focus.follow(unicorn);

        game.timer.update = (deltaTime, time) => {
            checkFinish();
            level.update(deltaTime);
            game.cameraController.update(deltaTime, time, level);
            level.comp.draw(game.context, game.camera);
        };

        const onPlayClick = async () => {
            document.querySelector('.play-block').remove();
            await game.levelManager.nextLevel();
            game.canvasSelector.classList.toggle('blur', false);
        };

        const onPlayHover = () => {
            game.canvasSelector.classList.toggle('blur', true);
        };

        const onPlayUnhover = () => {
            game.canvasSelector.classList.toggle('blur', false);
        };

        playBtn.addEventListener('click', onPlayClick);
        playBtn.addEventListener('mouseover', onPlayHover);
        playBtn.addEventListener('mouseout', onPlayUnhover);
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

export default {
    spec,
    init
};
