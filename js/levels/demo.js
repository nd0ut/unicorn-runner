import { rand, clamp } from '../math';
import { createPlayerEnv } from '../player/createPlayerEnv';
import { AutoJump, Physics } from '../Traits';

const N = 100;

function getEntities() {
    const choose = ['speedBooster'];
    // const choose = ['rainbow', 'speedBooster', 'portal'];
    // const choose = ['portal'];

    const entities = Array.from(Array(N)).map((val, idx) => ({
        name: choose[rand.int(0, choose.length - 1)],
        pos: [idx * rand.int(1000, 2000) + 500, -1000]
    }));

    return entities;
}

function getRanges() {
    let h = 5;
    let mul = 1;
    let x = 0;

    const ranges = Array.from(Array(N)).map(() => {
        mul = h === -3 ? 1 : mul;
        mul = h === 9 ? -1 : mul;

        const platformWidth = rand.int(15, 30);

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

function initPlayButton(game) {
    const playBtn = document.querySelector('.play-btn');
    playBtn.style.visibility = 'visible';

    playBtn.addEventListener('click', onPlayClick);
    playBtn.addEventListener('mouseover', onPlayHover);
    playBtn.addEventListener('mouseout', onPlayUnhover);
    window.addEventListener('keydown', onKeyDown);

    async function start() {
        document.querySelector('.play-block').remove();
        window.removeEventListener('keydown', onKeyDown);

        await game.levelManager.nextLevel();
        game.canvasSelector.classList.toggle('blur', false);
    }

    function onPlayClick() {
        start();
    }

    function onPlayHover() {
        game.canvasSelector.classList.toggle('blur', true);
    }

    function onPlayUnhover() {
        game.canvasSelector.classList.toggle('blur', false);
    }

    function onKeyDown(e) {
        if (e.code === 'Space') {
            start();
        }
    }
}

async function init(game) {
    const level = await game.loadLevel(spec);

    const unicorn = game.entityFactory.unicorn({ speed: 20000 });
    unicorn.addTrait(new AutoJump());

    const playerEnv = createPlayerEnv(game);
    level.entities.add(playerEnv);
    level.entities.forEach(entity => entity.addTrait(new Physics()));

    initPlayButton(game);

    function checkFinish() {
        if (unicorn.pos.x > level.distance) {
            unicorn.pos.x = 64;
            unicorn.pos.y = 64;
        }
    }

    function startLevel() {
        level.sounds.get('music').playLoop({ volume: 0.8 });

        playerEnv.playerController.setPlayer(unicorn);
        game.cameraController.focus.follow(unicorn);

        game.timer.update = (deltaTime, time) => {
            checkFinish();
            level.update(deltaTime);
            game.cameraController.update(deltaTime, time, level);
            level.comp.draw(game.context, game.camera);
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

export default {
    spec,
    init
};
