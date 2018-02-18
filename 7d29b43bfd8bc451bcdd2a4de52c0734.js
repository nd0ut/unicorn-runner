// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({32:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.lerp = lerp;
exports.clamp = clamp;
let Matrix = exports.Matrix = class Matrix {
    constructor() {
        this.grid = [];
        this.offset = 100;
    }

    get(x, y) {
        x += this.offset;
        y += this.offset;

        const col = this.grid[x];
        if (col) {
            return col[y];
        }
        return undefined;
    }

    set(x, y, value) {
        x += this.offset;
        y += this.offset;

        if (!this.grid[x]) {
            this.grid[x] = [];
        }

        this.grid[x][y] = value;
    }

    remove(x, y) {
        x += this.offset;
        y += this.offset;

        delete this.grid[x][y];
    }

    width() {
        return this.grid.length - this.offset;
    }

    *[Symbol.iterator]() {
        for (let x = 0; x < this.grid.length; x++) {
            if (this.grid[x]) {
                for (let y = 0; y < this.grid[x].length; y++) {
                    const tile = this.grid[x][y];
                    if (tile) {
                        yield {
                            tile,
                            x: x - this.offset,
                            y: y - this.offset
                        };
                    }
                }
            }
        }
    }
};
let Vec2 = exports.Vec2 = class Vec2 {
    constructor(x, y) {
        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vec2(this.x, this.y);
    }

    distance(vec) {
        const dist = Math.sqrt(Math.pow(vec.x - this.x, 2) + Math.pow(vec.y - this.y, 2));
        return dist;
    }

};
Vec2.zero = new Vec2(0, 0);
function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
}

const rand = exports.rand = {
    int: (min, max) => Math.floor(rand.float(min, ++max)),
    float: (min, max) => Math.random() * (max - min) + min
};

function clamp(val, min, max) {
    return val > max ? max : val < min ? min : val;
}
},{}],43:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let ClipBox = exports.ClipBox = class ClipBox {
    constructor(pos, size, offset) {
        this.pos = pos;
        this.size = size;
        this.offset = offset;
    }

    overlaps(box) {
        return this.bottom > box.top && this.top < box.bottom && this.left < box.right && this.right > box.left;
    }

    contains(pos) {
        return this.bottom >= pos.y && this.top <= pos.y && this.left <= pos.x && this.right >= pos.x;
    }

    clone() {
        return new ClipBox(this.pos.clone(), this.size.clone(), this.offset.clone());
    }

    get width() {
        return this.size.x;
    }

    get height() {
        return this.size.y;
    }

    get bottom() {
        return this.pos.y + this.size.y + this.offset.y;
    }

    set bottom(y) {
        this.pos.y = y - (this.size.y + this.offset.y);
    }

    get top() {
        return this.pos.y + this.offset.y;
    }

    set top(y) {
        this.pos.y = y - this.offset.y;
    }

    get left() {
        return this.pos.x + this.offset.x;
    }

    set left(x) {
        this.pos.x = x - this.offset.x;
    }

    get right() {
        return this.pos.x + this.size.x + this.offset.x;
    }

    set right(x) {
        this.pos.x = x - (this.size.x + this.offset.x);
    }
};
},{}],18:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Camera = undefined;

var _math = require('../math');

var _ClipBox = require('../ClipBox');

let Camera = exports.Camera = class Camera {
    constructor() {
        this.pos = new _math.Vec2(0, 0);
        this.size = new _math.Vec2(1024, 600);
    }

    getBounds() {
        return new _ClipBox.ClipBox(this.pos, this.size, _math.Vec2.zero);
    }
};
},{"../math":32,"../ClipBox":43}],19:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let CameraController = exports.CameraController = class CameraController {
    constructor(camera, extensions) {
        this.cam = camera;
        this.extensions = this.loadExtensions(extensions);
    }

    loadExtensions(extensions) {
        return extensions.map(ExtKlass => {
            const ext = new ExtKlass(this);
            this[ext.name] = ext;
            return ext;
        });
    }

    update(deltaTime, time, { alcohol = false, earthquake = false } = {}) {
        this.extensions.forEach(ext => ext.update(...arguments));
    }
};
},{}],46:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let CameraExt = exports.CameraExt = class CameraExt {
    constructor(name, controller) {
        this.name = name;
        this.controller = controller;
    }

    get cam() {
        return this.controller.cam;
    }

    update(deltaTime, time, options = {}) {}
};
},{}],20:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CameraFocus = undefined;

var _CameraExt = require('./CameraExt');

var _math = require('../math');

const NoticeState = {
    IDLE: Symbol('IDLE'),
    STARTED: Symbol('STARTED'),
    REACHED: Symbol('REACHED'),
    RESTORED: Symbol('RESTORED')
};

let CameraFocus = exports.CameraFocus = class CameraFocus extends _CameraExt.CameraExt {
    constructor(controller) {
        super('focus', controller);

        this.followEntity = undefined;
        this.noticeEntity = undefined;

        this.noticeState = NoticeState.IDLE;

        this.noticeTime = undefined;
        this.noticeResolver = undefined;

        this.damping = this.defaultDamping;
        this.camOffset = this.defaultCamOffset;
        this.reachDistance = 500;
    }

    get defaultDamping() {
        return 0.3;
    }

    get defaultCamOffset() {
        return new _math.Vec2(0, 100);
    }

    update(deltaTime, time, level) {
        if (level.frozen) {
            return;
        }

        this.checkNotice(deltaTime, time);
        this.following(deltaTime, time);
    }

    follow(entity) {
        if (this.noticeState !== NoticeState.IDLE) {
            this.stopNotice();
        }

        this.followEntity = entity;
        this.entity = entity;

        this.cam.pos.x = entity.pos.x;
        this.cam.pos.y = 0;
    }

    following(deltaTime, time) {
        if (!this.entity) {
            return;
        }

        let entityX = this.entity.pos.x - this.camOffset.x;
        let entityY = this.entity.pos.y;

        if (Math.abs(this.cam.pos.x - entityX) > 0.1) {
            entityX = (0, _math.lerp)(this.cam.pos.x, entityX, 1 / this.damping * deltaTime);
        }

        if (Math.abs(this.cam.pos.y - entityY) > 0.1) {
            entityY = (0, _math.lerp)(this.cam.pos.y, entityY, 1 / this.damping * deltaTime);
        }

        this.cam.pos.x = entityX;
        this.cam.pos.y = Math.min(entityY, 0);
    }

    notice(noticeEntity, time, xOffset) {
        this.noticeState = NoticeState.NOTICE_STARTED;

        this.noticeEntity = noticeEntity;
        this.noticeTime = time;
        this.entity = noticeEntity;
        this.followEntity.run.stop();

        if (xOffset) {
            this.camOffset.x = xOffset;
        }

        return new Promise(res => {
            this.noticeResolver = res;
        });
    }

    onNoticeReach() {
        this.noticeState = NoticeState.REACHED;

        setTimeout(() => {
            this.entity = this.followEntity;
        }, this.noticeTime);
    }

    onNoticeRestore(time) {
        this.stopNotice();
    }

    checkNotice(deltaTime, time) {
        if (this.noticeState === NoticeState.STARTED) {
            const distToNotice = Math.abs(this.entity.pos.x - this.cam.pos.x);
            if (distToNotice < this.reachDistance) {
                this.onNoticeReach();
            }
        }

        if (this.noticeState === NoticeState.REACHED) {
            const distToFollow = Math.abs(this.followEntity.pos.x - this.cam.pos.x);
            if (distToFollow < this.reachDistance) {
                this.onNoticeRestore(time);
            }
        }
    }

    stopNotice() {
        this.noticeState = NoticeState.IDLE;
        this.followEntity.run.resume();
        this.camOffset = this.defaultCamOffset;

        this.noticeResolver();

        this.noticeTime = undefined;
        this.noticeResolver = undefined;
    }
};
},{"./CameraExt":46,"../math":32}],21:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CameraShake = exports.ShakeType = undefined;

var _math = require('../math');

var _CameraExt = require('./CameraExt');

const ShakeType = exports.ShakeType = {
    DRUNK: Symbol('DRUNK'),
    EARTH: Symbol('EARTH')
};

let CameraShake = exports.CameraShake = class CameraShake extends _CameraExt.CameraExt {
    constructor(controller) {
        super('shake', controller);

        this.alcoFreq = 1;
        this.alcoAmp = 1;
        this.alcoRand = 1;
        this.alcoDamping = 1;

        this.shakingAmp = 50;
    }

    get entity() {
        return this.controller.focus.entity;
    }

    get camOffset() {
        return this.controller.focus.camOffset;
    }

    update(deltaTime, time, { shakeType } = {}) {
        if (!shakeType) {
            this.resetFocus();
            return;
        }
        this.runShake(shakeType, deltaTime, time);
    }

    runShake(shakeType, deltaTime, time) {
        switch (shakeType) {
            case ShakeType.DRUNK:
                this.drunk(deltaTime, time);
                break;
            case ShakeType.EARTH:
                this.earth(deltaTime, time);
            default:
                break;
        }
    }

    resetFocus() {
        this.controller.focus.damping = this.controller.focus.defaultDamping;
        this.controller.focus.camOffset = this.controller.focus.defaultCamOffset;
    }

    drunk(deltaTime, time) {
        this.controller.focus.damping = this.alcoDamping;

        const newRand = this.alcoRand * _math.rand.float(0, 1);
        this.alcoRand = (0, _math.lerp)(this.alcoRand, newRand, deltaTime);

        this.cam.pos.y = sinusoid(time / 1000, 0, Math.sin(this.alcoRand) * this.alcoAmp, Math.sin(this.alcoRand) * this.alcoFreq, 0) * 100;
        this.camOffset.x = Math.sin(time / 1000) + Math.sin(this.alcoRand) * 500;
    }

    earth(deltaTime, time) {
        this.cam.pos.x = this.entity.pos.x - this.camOffset.x + _math.rand.float(0, this.shakingAmp);

        this.cam.pos.y = _math.rand.float(0, this.shakingAmp);
    }
};


function sinusoid(t, a, b, c, d) {
    return a + b * Math.sin(c * t + d);
}
},{"../math":32,"./CameraExt":46}],33:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Entity = exports.Trait = exports.Sides = undefined;

var _math = require('./math');

var _ClipBox = require('./ClipBox');

const Sides = exports.Sides = {
    TOP: Symbol('TOP'),
    BOTTOM: Symbol('BOTTOM'),
    LEFT: Symbol('LEFT'),
    RIGHT: Symbol('RIGHT')
};

let Trait = exports.Trait = class Trait {
    constructor(name) {
        this.NAME = name;
        this.tasks = [];
        this.entity = undefined;
    }

    finalize() {
        this.tasks.forEach(task => task());
        this.tasks.length = 0;
    }

    setEntity(entity) {
        this.entity = entity;
    }

    queue(task) {
        this.tasks.push(task);
    }

    collides(us, them) {}

    obstruct() {}

    update() {}
};
let Entity = exports.Entity = class Entity {
    constructor(name) {
        this.name = name;
        this.pos = new _math.Vec2(0, 0);
        this.vel = new _math.Vec2(0, 0);
        this.size = new _math.Vec2(0, 0);
        this.offset = new _math.Vec2(0, 0);
        this.bounds = new _ClipBox.ClipBox(this.pos, this.size, this.offset);
        this.lifetime = 0;

        this.traits = [];

        this.idx = undefined;
    }

    addTrait(trait) {
        trait.setEntity(this);

        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    removeTrait(traitName) {
        const idx = this.traits.findIndex(trait => trait.NAME === traitName);

        if (idx === -1) {
            return;
        }

        this.traits.splice(idx, 1);
        this[traitName] = undefined;
    }

    collides(candidate, side) {
        this.traits.forEach(trait => {
            trait.collides(this, candidate, side);
        });
    }

    obstruct(side, match) {
        this.traits.forEach(trait => {
            trait.obstruct(this, side, match);
        });
    }

    draw() {}

    voice(entity) {}

    finalize() {
        this.traits.forEach(trait => {
            trait.finalize();
        });
    }

    update(deltaTime, level) {
        this.voice && this.voice(this);

        this.traits.forEach(trait => {
            trait.update(this, deltaTime, level);
        });

        this.lifetime += deltaTime;
    }
};
},{"./math":32,"./ClipBox":43}],28:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.splash = splash;
function splash(text, { timeout = 1000, size = 100, color = 'white', background = 'transparent' } = {}) {
    const textDiv = document.querySelector('.splash-text');
    const blockDiv = document.querySelector('.splash-block');

    return new Promise(resolve => {
        blockDiv.style = `background-color: ${background}`;

        textDiv.style = `font-size: ${size}pt; color: ${color};`;
        textDiv.innerHTML = text;
        textDiv.classList.toggle('splash-text--hide', false);
        textDiv.classList.toggle('splash-text--show', true);

        setTimeout(() => {
            textDiv.classList.toggle('splash-text--show', false);
            textDiv.classList.toggle('splash-text--hide', true);
            setTimeout(() => {
                resolve();
            }, 300);
        }, timeout);
    });
}
},{}],44:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PlayerController = undefined;

var _Entity = require('../Entity');

var _LevelManager = require('../LevelManager');

var _math = require('../math');

var _Splash = require('../Splash');

let PlayerController = exports.PlayerController = class PlayerController extends _Entity.Trait {
    constructor(game) {
        super('playerController');
        this.game = game;
        this.checkpoint = new _math.Vec2(0, 0);
        this.player = undefined;

        this.game.levelManager.on(_LevelManager.LevelEvents.FINISHED, this.onLevelFinished.bind(this));
        this.game.levelManager.on(_LevelManager.LevelEvents.FAILED, this.onLevelFailed.bind(this));

        this.totalScore = 0;
        this.score = 0;
        this.mana = 0;
        this.kills = 0;
        this.deaths = 0;

        this.fireballsSelector = document.getElementById('current-fireballs');
        this.scoreSelector = document.getElementById('unicorn-score');

        this.updateUiCounts(this.fireballsSelector, this.mana);
    }

    setPlayer(entity) {
        this.player = entity;

        this.player.picker.on('pick', this.onPick.bind(this));
        this.player.striker.on('strike', this.onStrike.bind(this));
        this.player.killer.on('kill', this.onKill.bind(this));
        this.player.killable.on('dead', this.onDead.bind(this));
    }

    onPick(picker, pickable) {
        if (pickable.name === 'rainbow') {
            this.score += 50;
            this.updateUiCounts(this.scoreSelector, this.totalScore + this.score);
        }
        if (pickable.name === 'manaPot') {
            this.mana += 2;
            this.updateUiCounts(this.fireballsSelector, this.mana);
        }
    }

    onStrike(bullet) {
        if (bullet.name === 'bullet') {
            this.mana--;
        }
        this.updateUiCounts(this.fireballsSelector, this.mana);
    }

    onKill() {
        this.kills++;
    }

    onDead() {
        this.deaths++;
    }

    updateUiCounts(selector, count) {
        setTimeout(() => {
            selector.innerHTML = Math.ceil(count);
        }, 0);
    }

    canStrikeFireballs() {
        const alive = this.player && !this.player.killable.dead;
        const haveMana = this.mana > 0;

        if (!haveMana) {
            (0, _Splash.splash)('no mana', {
                timeout: 1000,
                size: 30
            });
        }

        return alive && haveMana;
    }

    canBoost() {
        const alive = this.player && !this.player.killable.dead;
        const haveMana = this.mana > 0;

        if (alive && this.mana === 0) {
            (0, _Splash.splash)('no mana', {
                timeout: 1000,
                size: 30
            });
        }

        return alive && haveMana;
    }

    commitScore() {
        this.totalScore += this.score;
        this.resetScore();
    }

    resetScore() {
        this.score = 0;
        this.updateUiCounts(this.scoreSelector, this.totalScore + this.score);
    }

    resetMana() {
        this.mana = 0;
        this.updateUiCounts(this.fireballsSelector, this.mana);
    }

    update(entity, deltaTime, level) {
        if (!this.player) {
            return;
        }

        if (!this.player.killable.dead && !level.entities.has(this.player)) {
            this.player.pos.set(this.checkpoint.x, this.checkpoint.y);
            level.entities.add(this.player);
            return;
        }

        if (this.player.run.boosted) {
            this.mana -= deltaTime;

            if (this.mana <= 0) {
                this.player.run.cancelBoost();
                this.mana = 0;
            }

            this.updateUiCounts(this.fireballsSelector, this.mana);
        }
    }

    onLevelFinished({ isLastLevel }) {
        this.commitScore();
        this.resetMana();
    }

    onLevelFailed() {
        this.resetScore();
        this.resetMana();
    }
};
},{"../Entity":33,"../LevelManager":11,"../math":32,"../Splash":28}],45:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InteractionController = undefined;

var _Entity = require('../Entity');

let InteractionController = exports.InteractionController = class InteractionController extends _Entity.Trait {
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
        if (!this.playerController.player) {
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

        if (!this.shiftPressed && unicorn.run.boosted) {
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
};
},{"../Entity":33}],22:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createPlayerEnv = createPlayerEnv;

var _Entity = require('../Entity');

var _PlayerController = require('./PlayerController');

var _InteractionController = require('./InteractionController');

function createPlayerEnv(game) {
    const playerEnv = new _Entity.Entity('player');

    const playerControl = new _PlayerController.PlayerController(game);
    playerControl.checkpoint.set(96, 64);
    playerEnv.addTrait(playerControl);

    const interactionControl = new _InteractionController.InteractionController(game);
    playerEnv.addTrait(interactionControl);

    return playerEnv;
}
},{"../Entity":33,"./PlayerController":44,"./InteractionController":45}],29:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debounce = debounce;
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this,
              args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = undefined;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

let EventEmitter = exports.EventEmitter = class EventEmitter {

    static getEmitter(instance) {
        let emitter = EventEmitter.emitters.get(instance);

        if (!emitter) {
            emitter = new EventEmitter();
            EventEmitter.emitters.set(instance, emitter);
        }

        return emitter;
    }

    static decorator(target) {
        target.prototype.on = function on(...args) {
            const emitter = EventEmitter.getEmitter(this);
            emitter.on.call(emitter, ...args);
        };

        target.prototype.emit = function emit(...args) {
            const emitter = EventEmitter.getEmitter(this);
            emitter.emit.call(emitter, ...args);
        };
    }

    constructor(instance) {
        this.events = new Map();
    }

    on(event, handler) {
        let handlers = this.events.get(event);

        if (handlers) {
            handlers.push(handler);
        } else {
            handlers = [handler];
            this.events.set(event, handlers);
        }
    }

    async emit(event, ...args) {
        const handlers = this.events.get(event);

        if (!handlers) {
            return;
        }

        for (const handler of handlers) {
            handler(...args);
        }

        await Promise.all(handlers.map(handler => handler.bind(handler, ...args)));
    }
};
EventEmitter.emitters = new WeakMap();
},{}],62:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Striker = exports.Picker = exports.Pickable = exports.Killer = exports.Killable = exports.Jump = exports.Run = exports.Impassable = exports.Stackable = exports.Solid = exports.AutoJump = exports.Physics = undefined;

var _dec, _class, _dec2, _class2, _dec3, _class3, _dec4, _class4, _dec5, _class5;

var _Entity = require('./Entity');

var _math = require('./math');

var _util = require('./util');

let Physics = exports.Physics = class Physics extends _Entity.Trait {
    constructor({ applyGravity } = { applyGravity: true }) {
        super('physics');

        this.applyGravity = applyGravity;
    }

    update(entity, deltaTime, level) {
        entity.pos.x += entity.vel.x * deltaTime;
        level.tileCollider.checkX(entity);

        entity.pos.y += entity.vel.y * deltaTime;
        level.tileCollider.checkY(entity);

        if (this.applyGravity) {
            entity.vel.y += level.gravity * deltaTime;
        }
    }
};
let AutoJump = exports.AutoJump = class AutoJump extends _Entity.Trait {
    constructor() {
        super('autojump');
    }

    update(entity, deltaTime, level) {
        const distance = entity.vel.x * 0.3;
        const willCollide = level.tileCollider.willCollideX(entity, distance);

        if (willCollide) {
            entity.jump.start();
            setTimeout(() => entity.jump.cancel(), 300);
        }
    }
};
let Solid = exports.Solid = class Solid extends _Entity.Trait {
    constructor() {
        super('solid');
        this.obstructs = true;
    }

    obstruct(entity, side, match) {
        if (!this.obstructs) {
            return;
        }

        if (side === _Entity.Sides.BOTTOM) {
            entity.bounds.bottom = match.y1;
            entity.vel.y = 0;
        } else if (side === _Entity.Sides.TOP) {
            entity.bounds.top = match.y2;
            entity.vel.y = 0;
        } else if (side === _Entity.Sides.LEFT) {
            entity.bounds.left = match.x2;
            entity.vel.x = 0;
        } else if (side === _Entity.Sides.RIGHT) {
            entity.bounds.right = match.x1;
            entity.vel.x = 0;
        }
    }
};
let Stackable = exports.Stackable = class Stackable extends _Entity.Trait {
    constructor() {
        super('stackable');
    }

    collides(us, them, side) {
        if (us.name !== them.name) {
            return;
        }

        if (this.killable && this.killable.dead) {
            return;
        }

        if (us.vel.y > 0 && side === _Entity.Sides.BOTTOM) {
            us.bounds.bottom = them.bounds.top;
            us.vel.y = 0;
        } else if (us.vel.y < 0 && side === _Entity.Sides.TOP) {
            us.bounds.top = them.bounds.bottom;
            us.vel.y = 0;
        } else if (us.vel.x > 0 && side === _Entity.Sides.RIGHT) {
            us.bounds.right = them.bounds.left;
            us.vel.x = 0;
        } else if (us.vel.x < 0 && side === _Entity.Sides.LEFT) {
            us.bounds.left = them.bounds.right;
            us.vel.x = 0;
        }
    }
};
let Impassable = exports.Impassable = class Impassable extends _Entity.Trait {
    constructor() {
        super('impassable');
        this.activated = true;
    }

    activate() {
        this.queue(() => this.activated = true);
    }

    deactivate() {
        this.queue(() => this.activated = false);
    }

    collides(us, them, side) {
        if (!this.activated) {
            return;
        }

        if (side === _Entity.Sides.BOTTOM) {
            them.bounds.top = us.bounds.bottom;
            them.vel.y = 0;
        } else if (side === _Entity.Sides.TOP) {
            them.bounds.bottom = us.bounds.top;
            them.vel.y = 0;
        } else if (side === _Entity.Sides.RIGHT) {
            them.bounds.left = us.bounds.right;
            them.vel.x = 0;
        } else if (side === _Entity.Sides.LEFT) {
            them.bounds.right = us.bounds.left;
            them.vel.x = 0;
        }

        them.obstruct(them, side);
    }
};
let Run = exports.Run = class Run extends _Entity.Trait {
    constructor({ speed = 15000 }) {
        super('run');

        this.speed = speed;
        this.realSpeed = this.speed;
        this.lastSpeed = this.speed;
        this.originSpeed = undefined;

        this.damping = 1;
        this.distance = 0;
        this.onGround = false;
        this.boosted = false;
    }

    stop() {
        if (this.originSpeed) {
            this.resume();
        }

        this.originSpeed = this.speed;
        this.speed = 1;
    }

    resume() {
        if (!this.originSpeed) {
            return;
        }

        this.speed = this.originSpeed;
        this.originSpeed = undefined;
    }

    boost(speed) {
        if (this.boosted) {
            return;
        }

        this.originSpeed = this.speed;
        this.speed = this.originSpeed + speed;
        this.boosted = true;
    }

    cancelBoost() {
        if (!this.boosted) {
            return;
        }

        this.speed = this.originSpeed;
        this.originSpeed = undefined;
        this.boosted = false;
    }

    update(entity, deltaTime) {
        this.realSpeed = this.speed;

        if (Math.abs(this.lastSpeed - this.speed) > 0) {
            this.realSpeed = (0, _math.lerp)(this.lastSpeed, this.speed, 1 / this.damping * deltaTime);
        }

        entity.vel.x = this.realSpeed * deltaTime;
        this.distance += Math.abs(entity.vel.x) * deltaTime;
        this.lastSpeed = this.realSpeed;
    }
};
let Jump = exports.Jump = class Jump extends _Entity.Trait {
    constructor() {
        super('jump');

        this.falling = false;
        this.jumping = false;

        this.ready = 0;
        this.duration = 0.8;
        this.engageTime = 0;
        this.requestTime = 0;
        this.gracePeriod = 0.1;
        this.speedBoost = 0.3;
        this.velocity = 200;

        this.enabled = true;
    }

    get fallingDown() {
        return this.ready < 0 && this.falling;
    }

    get jumpingUp() {
        return this.ready < 0 && this.jumping;
    }

    get inAir() {
        return this.fallingDown || this.jumpingUp;
    }

    start() {
        if (!this.enabled) {
            return;
        }

        this.requestTime = this.gracePeriod;
    }

    cancel() {
        if (!this.enabled) {
            return;
        }
        this.engageTime = 0;
        this.requestTime = 0;
    }

    obstruct(entity, side) {
        if (side === _Entity.Sides.BOTTOM) {
            this.ready = 1;
            this.falling = false;
        } else if (side === _Entity.Sides.TOP) {
            this.cancel();
        }
    }

    update(entity, deltaTime) {
        if (this.ready < 0 && entity.vel.y < 0) {
            this.jumping = true;
            this.falling = false;
        } else if (this.ready < 0 && entity.vel.y > 0) {
            this.jumping = false;
            this.falling = true;
        }

        if (this.requestTime > 0) {
            if (this.ready > 0) {
                this.engageTime = this.duration;
                this.requestTime = 0;
            }

            this.requestTime -= deltaTime;
        }

        if (this.engageTime > 0) {
            entity.vel.y = -(this.velocity + Math.abs(entity.vel.x) * this.speedBoost);
            this.engageTime -= deltaTime;
            if (this.engageTime < 0) {
                this.engageTime = 0;
            }
        }

        this.ready--;
    }
};
let Killable = exports.Killable = (_dec = _util.EventEmitter.decorator, _dec(_class = class Killable extends _Entity.Trait {
    constructor({ removeAfter } = {}) {
        super('killable');
        this.dead = false;
        this.deadTime = 0;
        this.removeAfter = removeAfter !== undefined ? removeAfter : 0.3;
    }

    kill() {
        if (this.dead) {
            return;
        }

        this.emit('dead');
        this.queue(() => this.dead = true);
    }

    revive() {
        this.dead = false;
        this.deadTime = 0;
    }

    update(entity, deltaTime, level) {
        if (this.dead) {
            entity.vel.x = entity.vel.x * 0.3;

            this.deadTime += deltaTime;
            if (this.deadTime > this.removeAfter) {
                this.queue(() => {
                    level.entities.delete(entity);
                });
            }

            return;
        }
    }
}) || _class);
let Killer = exports.Killer = (_dec2 = _util.EventEmitter.decorator, _dec2(_class2 = class Killer extends _Entity.Trait {
    constructor() {
        super('killer');
    }

    kill(victim) {
        this.emit('kill', victim);
    }
}) || _class2);
let Pickable = exports.Pickable = (_dec3 = _util.EventEmitter.decorator, _dec3(_class3 = class Pickable extends _Entity.Trait {
    constructor({ onPick } = {}) {
        super('pickable');
        this.picked = false;
        this.pickTime = 0;
        this.removeAfter = 0.3;

        onPick && this.on('pick', onPick);
    }

    pick() {
        this.emit('pick');
        this.queue(() => this.picked = true);
    }

    update(entity, deltaTime, level) {
        if (this.picked) {
            this.pickTime += deltaTime;
            if (this.pickTime > this.removeAfter) {
                this.queue(() => {
                    level.entities.delete(entity);
                });
            }
        }
    }
}) || _class3);
let Picker = exports.Picker = (_dec4 = _util.EventEmitter.decorator, _dec4(_class4 = class Picker extends _Entity.Trait {
    constructor() {
        super('picker');
    }

    collides(us, them) {
        if (!them.pickable || them.pickable.picked) {
            return;
        }

        this.emit('pick', us, them);
    }
}) || _class4);
let Striker = exports.Striker = (_dec5 = _util.EventEmitter.decorator, _dec5(_class5 = class Striker extends _Entity.Trait {
    constructor() {
        super('striker');

        this.reloadDuration = 0.1;
        this.canStrike = true;
        this.strikeTime = 0;
    }

    isStriking() {
        return this.strikeTime > 0 && this.strikeTime < this.reloadDuration;
    }

    strike(bullet, level) {
        if (!this.canStrike) {
            return;
        }

        bullet.pos.x = this.entity.pos.x + 100;
        bullet.pos.y = this.entity.pos.y + 40;
        bullet.vel.x = 1000;
        level.entities.add(bullet);

        this.canStrike = false;
        this.strikeTime = 0;

        bullet.bulletBehavior.striked();
        this.emit('strike', bullet);
    }

    update(entity, deltaTime, level) {
        if (this.canStrike) {
            return;
        }

        this.strikeTime += deltaTime;

        if (this.strikeTime > this.reloadDuration) {
            this.canStrike = true;
            this.strikeTime = 0;
        }
    }
}) || _class5);
},{"./Entity":33,"./math":32,"./util":29}],82:[function(require,module,exports) {
module.exports="/dist/f1ecb4c5aae51ac1c82c3e2d17b666a0.wav";
},{}],83:[function(require,module,exports) {
module.exports="/dist/f528c7ca9edef7acaf8678528cb2a803.png";
},{}],78:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _math = require('../math');

var _createPlayerEnv = require('../player/createPlayerEnv');

var _Traits = require('../Traits');

const N = 100;

function getEntities() {
    const choose = ['speedBooster'];
    // const choose = ['rainbow', 'speedBooster', 'portal'];
    // const choose = ['portal'];

    const entities = Array.from(Array(N)).map((val, idx) => ({
        name: choose[_math.rand.int(0, choose.length - 1)],
        pos: [idx * _math.rand.int(1000, 2000) + 500, -1000]
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

        const platformWidth = _math.rand.int(15, 30);

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
    sounds: [{
        url: require('../../sounds/music/demo.wav'),
        name: 'music'
    }],
    tileSprite: {
        imageURL: require('../../img/tiles/trak2_wall1a.png'),
        tileW: 60,
        tileH: 60,
        frames: [{
            name: 'default',
            rect: [0, 0, 60, 60]
        }]
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
    unicorn.addTrait(new _Traits.AutoJump());

    const playerEnv = (0, _createPlayerEnv.createPlayerEnv)(game);
    level.entities.add(playerEnv);
    level.entities.forEach(entity => entity.addTrait(new _Traits.Physics()));

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

exports.default = {
    spec,
    init
};
},{"../math":32,"../player/createPlayerEnv":22,"../Traits":62,"../../sounds/music/demo.wav":82,"../../img/tiles/trak2_wall1a.png":83}],89:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.defineLevel = defineLevel;
function defineLevel(spec, options) {
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
},{}],85:[function(require,module,exports) {
module.exports="/dist/33f9e95192f7d4f800fc6dead92d1536.png";
},{}],86:[function(require,module,exports) {
module.exports="/dist/dd47bf358ec24a59aff3ebb6549b4fd5.png";
},{}],87:[function(require,module,exports) {
module.exports="/dist/d290ed1ad8dd4323f1573231ca89335b.png";
},{}],84:[function(require,module,exports) {
module.exports="/dist/1dbbb8aca01f558b79636d70dce5b20c.mp3";
},{}],88:[function(require,module,exports) {
module.exports="/dist/5956ea456339dd2bc9e30426631d0c43.png";
},{}],79:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Splash = require("../Splash");

var _Traits = require("../Traits");

var _defineLevel = require("./defineLevel");

var _math = require("../math");

const spec = {
  name: "warm up",
  spawn: [96, 64],
  background: {
    images: {
      sky: require("../../img/backgrounds/clouds.png"),
      back: require("../../img/backgrounds/mountains.png"),
      front: require("../../img/backgrounds/forest.png")
    },
    gradient: camPos => {
      return [["#256bcc", 0], ["#2278c6", (0, _math.clamp)(0.4 - camPos.y * 0.0001, 0, 0.8)], ["#00c7a4", 0.8]];
    }
  },
  sounds: [{
    url: require("../../sounds/hooked-on-a-feeling.mp3"),
    name: "music"
  }],
  tileSprite: {
    imageURL: require("../../img/tiles/y5lxj.png"),
    tileW: 60,
    tileH: 60,
    frames: [{
      name: "grass",
      rect: [60 * 0, 0, 60, 60]
    }, {
      name: "stone",
      rect: [60 * 1, 0, 60, 60]
    }, {
      name: "dirt",
      rect: [60 * 2, 0, 60, 60]
    }, {
      name: "default",
      rect: [60 * 3, 0, 60, 60]
    }, {
      name: "stone2",
      rect: [60 * 0, 60, 60, 60]
    }, {
      name: "wood",
      rect: [60 * 1, 60, 60, 60]
    }, {
      name: "sand",
      rect: [60 * 2, 60, 60, 60]
    }]
  },
  tiles: [["default", 2, 6], ["default", 3, 6], ["default", 4, 6], ["default", 5, 6], ["default", 6, 6], ["default", 7, 6], ["default", 8, 6], ["default", 9, 6], ["default", 10, 6], ["default", 11, 6], ["default", 12, 6], ["default", 13, 6], ["default", 14, 6], ["default", 15, 6], ["default", 16, 6], ["default", 17, 6], ["default", 18, 6], ["default", 19, 6], ["default", 26, 6], ["default", 27, 6], ["default", 28, 6], ["default", 29, 6], ["default", 30, 6], ["default", 31, 6], ["default", 32, 6], ["default", 38, 4], ["default", 39, 4], ["default", 40, 4], ["default", 41, 4], ["default", 42, 4], ["default", 43, 4], ["default", 44, 4], ["default", 45, 4], ["default", 46, 4], ["default", 47, 4], ["default", 51, 4], ["default", 52, 4], ["default", 53, 4], ["default", 55, 6], ["default", 56, 6], ["wood", 60, 6], ["default", 64, 8], ["default", 65, 8], ["default", 66, 8], ["default", 67, 8], ["default", 68, 8], ["default", 74, 5], ["default", 75, 5], ["default", 76, 5], ["default", 77, 5], ["default", 78, 5], ["default", 79, 5], ["default", 80, 5], ["default", 81, 5], ["default", 82, 5], ["default", 87, 8], ["default", 88, 8], ["default", 93, 6], ["default", 94, 6], ["default", 95, 6], ["default", 96, 6], ["default", 101, 6], ["default", 102, 6], ["default", 103, 6], ["default", 104, 6], ["default", 105, 6], ["default", 106, 6], ["default", 107, 6], ["default", 108, 6], ["default", 109, 6], ["default", 110, 6], ["default", 111, 6], ["default", 112, 6], ["default", 113, 6], ["default", 114, 6], ["default", 115, 6], ["default", 116, 6], ["default", 117, 6], ["default", 118, 6], ["default", 119, 6], ["default", 124, 6], ["default", 125, 6], ["default", 126, 6], ["default", 127, 6], ["default", 128, 6], ["default", 129, 6], ["default", 130, 6], ["default", 131, 6], ["default", 132, 6], ["default", 133, 6], ["default", 138, 4], ["default", 139, 4], ["default", 140, 4], ["default", 141, 4], ["default", 142, 4], ["default", 143, 4], ["default", 144, 4], ["default", 145, 4], ["default", 146, 4], ["default", 147, 4], ["default", 151, 4], ["default", 152, 4], ["default", 155, 6], ["default", 156, 6], ["wood", 160, 6], ["default", 164, 8], ["default", 165, 8], ["default", 166, 8], ["default", 167, 8], ["default", 168, 8], ["default", 173, 5], ["default", 174, 5], ["default", 175, 5], ["default", 176, 5], ["default", 177, 5], ["default", 178, 5], ["default", 179, 5], ["default", 180, 5], ["default", 181, 5], ["default", 182, 5], ["default", 187, 8], ["default", 188, 8], ["default", 194, 6], ["default", 195, 6], ["dirt", 195, 7], ["default", 196, 6], ["dirt", 196, 7], ["dirt", 196, 8], ["default", 197, 6], ["dirt", 197, 7], ["dirt", 197, 8], ["stone", 197, 9], ["default", 198, 6], ["dirt", 198, 7], ["dirt", 198, 8], ["stone", 198, 9], ["default", 199, 6], ["dirt", 199, 7], ["dirt", 199, 8], ["stone", 199, 9], ["default", 200, 6], ["dirt", 200, 7], ["dirt", 200, 8], ["stone", 200, 9], ["default", 201, 6], ["dirt", 201, 7], ["dirt", 201, 8], ["stone", 201, 9], ["default", 202, 6], ["dirt", 202, 7], ["dirt", 202, 8], ["stone", 202, 9], ["default", 203, 6], ["dirt", 203, 7], ["dirt", 203, 8], ["stone", 203, 9], ["default", 204, 6], ["dirt", 204, 7], ["dirt", 204, 8], ["stone", 204, 9], ["default", 205, 6], ["dirt", 205, 7], ["dirt", 205, 8], ["stone", 205, 9], ["default", 206, 6], ["dirt", 206, 7], ["dirt", 206, 8], ["stone", 206, 9], ["default", 207, 6], ["dirt", 207, 7], ["dirt", 207, 8], ["stone", 207, 9], ["default", 208, 6], ["dirt", 208, 7], ["dirt", 208, 8], ["stone", 208, 9], ["default", 209, 6], ["dirt", 209, 7], ["dirt", 209, 8], ["stone", 209, 9], ["default", 210, 6], ["dirt", 210, 7], ["dirt", 210, 8], ["stone", 210, 9], ["default", 211, 6], ["dirt", 211, 7], ["dirt", 211, 8], ["stone", 211, 9], ["default", 212, 6], ["dirt", 212, 7], ["dirt", 212, 8], ["stone", 212, 9], ["default", 213, 6], ["dirt", 213, 7], ["dirt", 213, 8], ["stone", 213, 9], ["default", 214, 6], ["dirt", 214, 7], ["dirt", 214, 8], ["stone", 214, 9], ["default", 215, 6], ["dirt", 215, 7], ["dirt", 215, 8], ["stone", 215, 9], ["default", 216, 6], ["dirt", 216, 7], ["dirt", 216, 8], ["stone", 216, 9], ["default", 217, 6], ["dirt", 217, 7], ["dirt", 217, 8], ["stone", 217, 9], ["default", 218, 6], ["dirt", 218, 7], ["dirt", 218, 8], ["stone", 218, 9], ["default", 219, 6], ["dirt", 219, 7], ["dirt", 219, 8], ["stone", 219, 9], ["default", 220, 6], ["dirt", 220, 7], ["dirt", 220, 8], ["stone", 220, 9], ["default", 221, 6], ["dirt", 221, 7], ["dirt", 221, 8], ["stone", 221, 9], ["default", 222, 6], ["dirt", 222, 7], ["dirt", 222, 8], ["stone", 222, 9], ["default", 223, 6], ["dirt", 223, 7], ["dirt", 223, 8], ["stone", 223, 9], ["default", 224, 6], ["dirt", 224, 7], ["dirt", 224, 8], ["stone", 224, 9], ["default", 225, 6], ["dirt", 225, 7], ["dirt", 225, 8], ["stone", 225, 9], ["default", 226, 6], ["dirt", 226, 7], ["dirt", 226, 8], ["default", 227, 6], ["dirt", 227, 7], ["default", 228, 6]],
  entities: [{ name: "speedBooster", pos: [769.6654805148739, 299.5] }, { name: "rainbow", pos: [1314.8304345700217, 43.5] }, { name: "enemy", skinName: "cactus", pos: [1796, 285.75] }, { name: "enemy", skinName: "cactus", pos: [2580, 0] }, { name: "rainbow", pos: [3183.8893762925363, -147.088566603083] }, { name: "enemy", skinName: "cactus", pos: [3968, 405.75] }, { name: "rainbow", pos: [4610, -7] }, { name: "enemy", skinName: "cactus", pos: [4620, 0] }, { name: "rainbow", pos: [5604, 37] }, { name: "enemy", skinName: "cactus", pos: [6519.332364340603, 285] }, { name: "speedBooster", pos: [6663.277780038607, 302.5] }, { name: "rainbow", pos: [7388, 0] }, { name: "enemy", skinName: "cactus", pos: [7721.990176118361, 286] }, { name: "enemy", skinName: "cactus", pos: [9995.156915549245, 408] }]
};

exports.default = (0, _defineLevel.defineLevel)(spec, {
  onStart: (game, level) => {
    // level.sounds.get('music').playOnce();
  },
  afterUpdate: onAfterUpdate()
});


function onAfterUpdate() {
  let firstJumpReached = false;

  return (game, level) => {
    const player = game.playerEnv.playerController.player;
    const firstJumpX = 500;

    const nearFirstJump = Math.abs(player.pos.x - firstJumpX) < 10;
    if (!firstJumpReached && nearFirstJump) {
      firstJumpReached = true;
      (0, _Splash.splash)("press space to jump", { size: 50, timeout: 2000 });
    }
  };
}
},{"../Splash":28,"../Traits":62,"./defineLevel":89,"../math":32,"../../img/backgrounds/clouds.png":85,"../../img/backgrounds/mountains.png":86,"../../img/backgrounds/forest.png":87,"../../sounds/hooked-on-a-feeling.mp3":84,"../../img/tiles/y5lxj.png":88}],80:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Splash = require("../Splash");

var _Traits = require("../Traits");

var _defineLevel = require("./defineLevel");

var _math = require("../math");

const spec = {
  name: "shooting",
  spawn: [96, 64],
  background: {
    images: {
      sky: require("../../img/backgrounds/clouds.png"),
      back: require("../../img/backgrounds/mountains.png"),
      front: require("../../img/backgrounds/forest.png")
    },
    gradient: camPos => {
      return [["#256bcc", 0], ["#2278c6", (0, _math.clamp)(0.4 - camPos.y * 0.0001, 0, 0.8)], ["#00c7a4", 0.8]];
    }
  },
  sounds: [{
    url: require("../../sounds/hooked-on-a-feeling.mp3"),
    name: "music"
  }],
  tileSprite: {
    imageURL: require("../../img/tiles/y5lxj.png"),
    tileW: 60,
    tileH: 60,
    frames: [{
      name: "grass",
      rect: [60 * 0, 0, 60, 60]
    }, {
      name: "stone",
      rect: [60 * 1, 0, 60, 60]
    }, {
      name: "dirt",
      rect: [60 * 2, 0, 60, 60]
    }, {
      name: "default",
      rect: [60 * 3, 0, 60, 60]
    }, {
      name: "stone2",
      rect: [60 * 0, 60, 60, 60]
    }, {
      name: "wood",
      rect: [60 * 1, 60, 60, 60]
    }, {
      name: "sand",
      rect: [60 * 2, 60, 60, 60]
    }]
  },
  tiles: [["default", 1, 7], ["default", 2, 7], ["default", 3, 7], ["default", 4, 7], ["default", 5, 7], ["default", 6, 7], ["default", 7, 7], ["default", 8, 7], ["default", 9, 7], ["default", 10, 7], ["default", 11, 7], ["default", 12, 7], ["default", 13, 7], ["default", 14, 7], ["default", 15, 7], ["default", 16, 7], ["wood", 17, 6], ["default", 17, 7], ["wood", 18, 5], ["wood", 18, 6], ["default", 18, 7], ["wood", 24, 5], ["wood", 24, 6], ["wood", 24, 7], ["default", 24, 8], ["wood", 25, 6], ["wood", 25, 7], ["default", 25, 8], ["wood", 26, 7], ["default", 26, 8], ["default", 27, 8], ["default", 28, 8], ["default", 29, 8], ["default", 30, 8], ["default", 31, 8], ["default", 32, 8], ["default", 33, 8], ["default", 34, 8], ["default", 35, 8], ["default", 36, 8], ["default", 37, 8], ["default", 38, 8], ["default", 39, 8], ["wood", 46, 7], ["wood", 47, 7], ["wood", 48, 7], ["wood", 49, 7], ["wood", 50, 7], ["wood", 51, 7], ["wood", 52, 7], ["wood", 53, 6], ["wood", 53, 7], ["wood", 54, 6], ["wood", 55, 6], ["wood", 56, 6], ["wood", 57, 6], ["wood", 58, 6], ["wood", 59, 6], ["wood", 60, 5], ["wood", 60, 6], ["wood", 61, 5], ["wood", 62, 5], ["wood", 63, 5], ["wood", 64, 5], ["wood", 65, 5], ["wood", 66, 4], ["wood", 66, 5], ["wood", 67, 4], ["wood", 68, 4], ["wood", 69, 4], ["wood", 70, 4], ["wood", 71, 4], ["wood", 72, 4], ["wood", 73, 4], ["wood", 74, 4], ["wood", 75, 4], ["wood", 76, 4], ["wood", 77, 4], ["wood", 78, 4], ["wood", 79, 4], ["wood", 80, -10], ["wood", 80, -9], ["wood", 80, -8], ["wood", 80, -7], ["wood", 80, -6], ["wood", 80, -5], ["wood", 80, -4], ["wood", 80, -3], ["wood", 80, 4], ["wood", 81, 4], ["wood", 82, -10], ["wood", 82, -9], ["wood", 82, -8], ["wood", 82, -7], ["wood", 82, -6], ["wood", 82, -5], ["wood", 82, -4], ["wood", 82, -3], ["wood", 82, 4], ["default", 83, -4], ["wood", 83, -3], ["wood", 83, 4], ["default", 84, -3], ["wood", 84, -2], ["wood", 84, 4], ["wood", 84, 5], ["wood", 84, 6], ["wood", 84, 7], ["wood", 84, 8], ["wood", 84, 9], ["default", 85, -3], ["wood", 85, -2], ["default", 85, 5], ["dirt", 85, 6], ["dirt", 85, 7], ["stone", 85, 8], ["stone", 85, 9], ["default", 86, -3], ["wood", 86, -2], ["default", 86, 6], ["dirt", 86, 7], ["stone", 86, 8], ["stone", 86, 9], ["default", 87, -2], ["wood", 87, -1], ["default", 87, 6], ["dirt", 87, 7], ["stone", 87, 8], ["stone", 87, 9], ["default", 88, -1], ["wood", 88, 0], ["default", 88, 6], ["dirt", 88, 7], ["stone", 88, 8], ["stone", 88, 9], ["default", 89, 0], ["wood", 89, 1], ["default", 89, 6], ["dirt", 89, 7], ["stone", 89, 8], ["stone", 89, 9], ["default", 90, 1], ["wood", 90, 2], ["default", 90, 6], ["dirt", 90, 7], ["stone", 90, 8], ["stone", 90, 9], ["default", 91, 1], ["wood", 91, 2], ["default", 91, 6], ["dirt", 91, 7], ["stone", 91, 8], ["stone", 91, 9], ["default", 92, 6], ["dirt", 92, 7], ["stone", 92, 8], ["stone", 92, 9], ["default", 93, 6], ["dirt", 93, 7], ["stone", 93, 8], ["stone", 93, 9], ["dirt", 94, 7], ["stone2", 94, 8], ["stone", 94, 9], ["stone2", 95, 8], ["stone2", 95, 9], ["stone2", 96, 9], ["stone2", 97, 9], ["stone2", 98, 9], ["stone2", 99, 9], ["stone2", 100, 9], ["stone2", 101, 9], ["wood", 102, 4], ["stone2", 102, 9], ["wood", 103, 4], ["wood", 103, 5], ["stone2", 103, 9], ["stone2", 104, 9], ["stone2", 105, 9], ["stone2", 106, 9], ["stone2", 107, 9], ["stone2", 108, 9], ["stone2", 109, 9], ["stone2", 110, 9], ["default", 118, 5], ["default", 119, 5], ["default", 120, 5], ["default", 121, 5], ["dirt", 121, 6], ["default", 122, 6], ["dirt", 122, 7], ["default", 123, 7], ["dirt", 123, 8], ["default", 124, 8], ["default", 125, 8], ["default", 126, 8], ["default", 127, 8], ["default", 128, 8], ["default", 129, 8], ["default", 130, 8], ["default", 131, 8], ["default", 132, 8], ["default", 133, 8], ["wood", 134, 2], ["default", 134, 8], ["default", 135, 8], ["default", 136, 8], ["default", 137, 8], ["default", 138, 8], ["default", 139, 8], ["default", 140, 8], ["default", 141, 8], ["default", 142, 8], ["default", 143, 8], ["default", 144, 8], ["default", 145, 8], ["stone2", 146, 5], ["stone2", 146, 8], ["dirt", 146, 9], ["stone2", 147, 4], ["stone2", 147, 5], ["stone2", 147, 8], ["dirt", 147, 9], ["stone2", 148, 4], ["stone2", 148, 8], ["dirt", 148, 9], ["wood", 149, 3], ["stone2", 149, 4], ["stone2", 149, 8], ["dirt", 149, 9], ["wood", 150, 3], ["stone2", 150, 4], ["stone2", 150, 8], ["dirt", 150, 9], ["stone2", 151, 4], ["stone2", 151, 8], ["dirt", 151, 9], ["wood", 152, 3], ["stone2", 152, 4], ["stone2", 152, 8], ["dirt", 152, 9], ["stone2", 153, 4], ["stone2", 153, 8], ["dirt", 153, 9], ["stone2", 154, 3], ["stone2", 154, 4], ["stone2", 154, 8], ["dirt", 154, 9], ["wood", 155, 2], ["stone2", 155, 3], ["stone2", 155, 4], ["stone2", 155, 8], ["dirt", 155, 9], ["stone2", 156, 3], ["stone2", 156, 4], ["stone2", 156, 8], ["dirt", 156, 9], ["stone2", 157, 4], ["stone2", 157, 8], ["dirt", 157, 9], ["stone2", 158, 4], ["stone2", 158, 8], ["dirt", 158, 9], ["wood", 159, 3], ["stone2", 159, 4], ["stone2", 159, 8], ["dirt", 159, 9], ["stone2", 160, 4], ["stone2", 160, 5], ["stone2", 160, 8], ["dirt", 160, 9], ["stone2", 161, 5], ["stone2", 161, 8], ["dirt", 161, 9], ["grass", 162, 8], ["dirt", 162, 9], ["stone2", 163, 8], ["dirt", 163, 9], ["grass", 164, 8], ["dirt", 164, 9], ["stone2", 165, 8], ["dirt", 165, 9], ["wood", 166, 7], ["grass", 166, 8], ["dirt", 166, 9], ["stone2", 167, 8], ["dirt", 167, 9], ["grass", 168, 8], ["dirt", 168, 9], ["stone2", 169, 8], ["dirt", 169, 9], ["grass", 170, 8], ["dirt", 170, 9], ["stone2", 171, 8], ["dirt", 171, 9], ["wood", 172, 7], ["stone2", 172, 8], ["dirt", 172, 9], ["wood", 173, 6], ["wood", 173, 7], ["grass", 173, 8], ["dirt", 173, 9], ["wood", 174, 7], ["grass", 174, 8], ["dirt", 174, 9], ["stone2", 175, 8], ["dirt", 175, 9], ["grass", 176, 8], ["dirt", 176, 9], ["stone2", 177, 8], ["dirt", 177, 9], ["grass", 178, 8], ["dirt", 178, 9], ["stone2", 179, 8], ["dirt", 179, 9], ["grass", 180, 8], ["dirt", 180, 9], ["wood", 181, 7], ["default", 181, 8], ["dirt", 181, 9], ["wood", 182, 7], ["default", 182, 8], ["dirt", 182, 9], ["default", 183, 8], ["dirt", 183, 9], ["default", 184, 8], ["dirt", 184, 9], ["default", 185, 8], ["dirt", 185, 9], ["default", 186, 8], ["dirt", 186, 9], ["default", 187, 8], ["dirt", 187, 9], ["default", 188, 8], ["dirt", 188, 9], ["default", 189, 8], ["dirt", 189, 9], ["default", 190, 8], ["dirt", 190, 9], ["default", 191, 8], ["dirt", 191, 9], ["default", 192, 8], ["dirt", 192, 9], ["default", 193, 8], ["dirt", 193, 9], ["wood", 198, 8], ["wood", 199, 7], ["wood", 203, 7], ["wood", 204, 6], ["wood", 207, 6], ["wood", 208, 5], ["wood", 211, 5], ["wood", 212, 4], ["wood", 214, 5], ["wood", 215, 4], ["wood", 218, 5], ["wood", 219, 4], ["wood", 220, 4], ["wood", 221, 4], ["wood", 222, 4], ["wood", 223, 4], ["wood", 224, 4], ["wood", 225, 4], ["wood", 226, 4], ["wood", 227, 4], ["wood", 228, 4], ["wood", 229, 4], ["wood", 230, 4], ["wood", 231, 4], ["wood", 232, 4], ["wood", 233, 4], ["wood", 234, 4], ["wood", 235, 4], ["wood", 236, 4], ["wood", 237, 4], ["wood", 238, 4], ["wood", 239, 4], ["wood", 240, 4], ["wood", 241, 4], ["wood", 242, 4], ["wood", 243, 4], ["wood", 244, 4], ["wood", 245, 3], ["wood", 245, 4], ["wood", 246, 3], ["wood", 247, 2], ["wood", 247, 3], ["wood", 247, 4], ["wood", 247, 5], ["wood", 247, 6], ["wood", 247, 7], ["wood", 247, 8], ["wood", 247, 9], ["wood", 247, 10]],
  entities: [{ name: "manaPot", pos: [1266.0000186093064, 15] }, { name: "enemy", pos: [2319.1666666666615, 381.5], skinName: "target" }, { name: "manaPot", pos: [2867, 344] }, { name: "manaPot", pos: [3017.408459114388, 346] }, { name: "manaPot", pos: [3283.9999999999914, 285] }, { name: "manaPot", pos: [3430.9999999999914, 287] }, { name: "manaPot", pos: [3664.050762163021, 227] }, { name: "manaPot", pos: [3805.050762163021, 228] }, { name: "speedBooster", pos: [4028.498282284062, 177.5] }, { name: "speedBooster", pos: [4781.498282284062, 62.5] }, { name: "enemy", skinName: "cactus", pos: [4858.074896158258, 165.5] }, { name: "enemy", skinName: "cactus", pos: [4859, -14.5] }, { name: "enemy", skinName: "cactus", pos: [4859, 108.5] }, { name: "enemy", skinName: "cactus", pos: [4859, -398.5] }, { name: "enemy", skinName: "cactus", pos: [4859, 45.91666666666667] }, { name: "enemy", skinName: "cactus", pos: [4859.074896158258, -210] }, { name: "enemy", skinName: "cactus", pos: [4860, -463.08333333333337] }, { name: "enemy", skinName: "cactus", pos: [4860, -74.5] }, { name: "enemy", skinName: "cactus", pos: [4860.074896158258, -143.5] }, { name: "enemy", skinName: "cactus", pos: [4860.074896158258, -275] }, { name: "enemy", skinName: "cactus", pos: [4860.074896158258, -335] }, { name: "enemy", pos: [4860.597505721113, -579.5], skinName: "cactus" }, { name: "enemy", skinName: "cactus", pos: [4861, -519.5] }, { name: "enemy", skinName: "cactus", pos: [4861, -641.75] }, { name: "rainbow", pos: [4952.685545762244, 35.5] }, { name: "enemy", skinName: "cactus", pos: [5618.503676392036, 289] }, { name: "enemy", skinName: "cactus", pos: [5640.333333333396, 341] }, { name: "enemy", skinName: "cactus", pos: [5700.333333333396, 402] }, { name: "enemy", skinName: "cactus", pos: [5760.333333333396, 461] }, { name: "enemy", skinName: "cactus", pos: [5815.333333333396, 467] }, { name: "enemy", skinName: "cactus", pos: [5875.333333333396, 468] }, { name: "enemy", skinName: "cactus", pos: [5939.958719207056, 467] }, { name: "enemy", pos: [6104, 167], skinName: "cactus" }, { name: "rainbow", pos: [6826.5, 229.5], skinName: "default" }, { name: "manaPot", pos: [7065.899479945025, 228], skinName: "default" }, { name: "manaPot", pos: [7180.193362357293, 228], skinName: "default" }, {
    name: "enemy",
    pos: [8018.1666666666615, 25],
    skinName: "target",
    id: "target-1"
  }, {
    name: "enemy",
    pos: [8324.672259524485, 385],
    skinName: "target",
    id: "target-2"
  }, {
    name: "enemy",
    pos: [8726.672259524486, 206],
    skinName: "target",
    id: "target-3"
  }, {
    name: "door",
    pos: [8760.666972841413, 315.5],
    skinName: "default",
    id: "door-1"
  }, {
    name: "speedBooster",
    pos: [8801.896812757153, 399.5],
    skinName: "default"
  }, { name: "enemy", pos: [9664, 406.5], skinName: "cactus" }, { name: "manaPot", pos: [10194.166666849957, 166], skinName: "default" }, {
    name: "rainbow",
    pos: [10629.001220181868, 11.253143575674308],
    skinName: "default"
  }, { name: "manaPot", pos: [10978.166666849957, 415], skinName: "default" }, { name: "manaPot", pos: [11374.166666849957, 398], skinName: "default" }, { name: "enemy", pos: [12219.166666849957, 265.5], skinName: "target" }, { name: "rainbow", pos: [12329.157294348368, 44.5], skinName: "default" }, { name: "enemy", pos: [12459.166666849957, 207.5], skinName: "target" }, { name: "enemy", pos: [12880.166666849957, 145.5], skinName: "target" }, {
    name: "rainbow",
    pos: [13292.660758604594, -23.47985891352434],
    skinName: "default"
  }]
};

exports.default = (0, _defineLevel.defineLevel)(spec, createLevelOptions());


function createLevelOptions() {
  const howToSplash = howToSplasher();

  return {
    onStart: (game, level) => {
      // level.sounds.get('music').playOnce();
    },
    afterUpdate: (game, level) => {
      howToSplash(game, level);
      checkDoor1(game, level);
    }
  };
}

function howToSplasher() {
  let firstJumpReached = false;

  return (game, level) => {
    const player = game.playerEnv.playerController.player;
    const firstJumpX = 1200;

    const nearFirstJump = Math.abs(player.pos.x - firstJumpX) < 10;
    if (!firstJumpReached && nearFirstJump) {
      firstJumpReached = true;
      (0, _Splash.splash)("press f to fire", { size: 50, timeout: 2000 });
    }
  };
}

function checkDoor1(game, level) {
  const targetIds = ["target-1", "target-2", "target-3"];
  const doorId = "door-1";

  const door = level.namedEntities.get(doorId);

  if (door.behavior.opened) {
    return;
  }

  const allTargetsDead = targetIds.every(id => {
    const entity = level.namedEntities.get(id);
    const dead = entity.killable.dead;
    return dead;
  });

  if (allTargetsDead) {
    door.behavior.open();
  }
}
},{"../Splash":28,"../Traits":62,"./defineLevel":89,"../math":32,"../../img/backgrounds/clouds.png":85,"../../img/backgrounds/mountains.png":86,"../../img/backgrounds/forest.png":87,"../../sounds/hooked-on-a-feeling.mp3":84,"../../img/tiles/y5lxj.png":88}],81:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Splash = require("../Splash");

var _Traits = require("../Traits");

var _defineLevel = require("./defineLevel");

var _math = require("../math");

const spec = {
  name: "haste",
  spawn: [96, 64],
  background: {
    images: {
      sky: require("../../img/backgrounds/clouds.png"),
      back: require("../../img/backgrounds/mountains.png"),
      front: require("../../img/backgrounds/forest.png")
    },
    gradient: camPos => {
      return [["#256bcc", 0], ["#2278c6", (0, _math.clamp)(0.4 - camPos.y * 0.0001, 0, 0.8)], ["#00c7a4", 0.8]];
    }
  },
  sounds: [{
    url: require("../../sounds/hooked-on-a-feeling.mp3"),
    name: "music"
  }],
  tileSprite: {
    imageURL: require("../../img/tiles/y5lxj.png"),
    tileW: 60,
    tileH: 60,
    frames: [{
      name: "grass",
      rect: [60 * 0, 0, 60, 60]
    }, {
      name: "stone",
      rect: [60 * 1, 0, 60, 60]
    }, {
      name: "dirt",
      rect: [60 * 2, 0, 60, 60]
    }, {
      name: "default",
      rect: [60 * 3, 0, 60, 60]
    }, {
      name: "stone2",
      rect: [60 * 0, 60, 60, 60]
    }, {
      name: "wood",
      rect: [60 * 1, 60, 60, 60]
    }, {
      name: "sand",
      rect: [60 * 2, 60, 60, 60]
    }]
  },
  tiles: [["default", 1, 7], ["default", 2, 7], ["default", 3, 7], ["default", 4, 7], ["default", 5, 7], ["default", 6, 7], ["default", 7, 7], ["default", 8, 7], ["default", 9, 7], ["default", 10, 7], ["default", 11, 7], ["default", 12, 7], ["default", 13, 7], ["default", 14, 7], ["default", 15, 7], ["default", 16, 7], ["default", 17, 7], ["default", 18, 7], ["default", 19, 7], ["default", 20, 7], ["default", 21, 7], ["default", 22, 7], ["default", 23, 7], ["default", 24, 7], ["default", 25, 7], ["default", 26, 7], ["default", 40, 7], ["default", 41, 7], ["default", 42, 7], ["default", 43, 7], ["default", 44, 7], ["default", 45, 7], ["default", 46, 7], ["default", 47, 7], ["default", 48, 7], ["default", 49, 7], ["default", 50, 7], ["wood", 61, 2], ["wood", 62, 2], ["wood", 63, 2], ["wood", 68, 1], ["wood", 69, 1], ["wood", 70, 1], ["wood", 71, 1], ["wood", 72, 1], ["wood", 73, 1], ["wood", 84, 3], ["default", 84, 4], ["dirt", 84, 5], ["dirt", 84, 6], ["wood", 85, 4], ["default", 85, 5], ["dirt", 85, 6], ["default", 86, 6], ["default", 87, 6], ["default", 88, 6], ["default", 89, 6], ["default", 90, 6], ["default", 91, 6], ["default", 92, 6], ["default", 93, 6], ["default", 94, 6], ["default", 95, 6], ["default", 96, 6], ["default", 97, 6], ["default", 98, 6], ["default", 99, 6], ["default", 100, 6], ["default", 101, 6], ["default", 102, 6], ["default", 103, 6], ["default", 104, 6], ["default", 105, 6], ["default", 106, 6], ["default", 107, 6], ["default", 108, 6], ["default", 109, 6], ["default", 110, 6], ["default", 111, 6], ["default", 112, 6], ["default", 113, 6], ["default", 114, 6], ["default", 115, 6], ["default", 116, 6], ["default", 117, 6], ["default", 118, 6], ["default", 119, 6], ["default", 120, 6], ["default", 121, 6], ["default", 122, 6], ["default", 123, 6], ["default", 124, 6], ["default", 125, 6], ["default", 126, 6], ["default", 127, 6], ["default", 128, 6], ["default", 129, 6], ["stone2", 145, 2], ["stone2", 146, 2], ["stone2", 147, 2], ["wood", 154, 4], ["wood", 155, 4], ["wood", 156, 4], ["wood", 157, 4], ["wood", 158, 4], ["wood", 165, 2], ["wood", 166, 2], ["wood", 167, 2], ["wood", 168, 2], ["wood", 169, 2], ["wood", 176, 0], ["wood", 177, 0], ["wood", 178, 0], ["wood", 179, 0], ["wood", 183, 2], ["wood", 184, 2], ["wood", 185, 2], ["wood", 186, 2], ["wood", 187, 2], ["wood", 191, 9], ["wood", 192, 9], ["wood", 193, 9], ["wood", 197, 9], ["wood", 198, 9], ["wood", 199, 9], ["wood", 200, 9], ["wood", 201, 9], ["wood", 202, 9], ["wood", 207, 9], ["wood", 212, 6], ["wood", 216, 5], ["wood", 220, 4], ["wood", 224, 3], ["wood", 228, 3], ["wood", 232, 3], ["wood", 236, 3], ["wood", 238, 4], ["wood", 240, 5], ["default", 242, 6], ["default", 243, 6], ["default", 244, 6], ["default", 245, 6], ["default", 246, 6], ["default", 247, 6], ["default", 248, 6], ["default", 249, 6], ["default", 250, 6], ["default", 251, 6], ["default", 252, 6], ["default", 253, 6], ["default", 254, 6], ["default", 255, 6], ["default", 256, 6], ["default", 257, 6], ["default", 258, 6], ["default", 259, 6], ["default", 260, 6], ["default", 261, 6], ["default", 262, 6], ["default", 263, 6], ["default", 264, 6], ["default", 267, 6], ["default", 268, 6], ["default", 269, 6], ["default", 270, 6], ["default", 271, 6], ["default", 272, 6], ["default", 273, 6], ["default", 274, 6], ["default", 275, 6], ["default", 276, 6], ["default", 279, 6], ["default", 280, 6], ["default", 281, 6], ["default", 282, 6], ["default", 283, 6], ["default", 284, 6], ["default", 285, 6], ["default", 286, 6], ["default", 287, 6], ["default", 288, 6], ["default", 289, 6], ["default", 290, 6], ["default", 291, 6], ["default", 294, 6], ["default", 295, 6], ["default", 296, 6], ["default", 297, 6], ["default", 298, 6], ["default", 299, 6], ["default", 300, 6], ["default", 301, 6], ["default", 302, 6], ["default", 304, 6], ["default", 305, 6], ["default", 306, 6], ["default", 309, 6], ["default", 310, 6], ["default", 311, 6], ["default", 312, 6], ["default", 315, 6], ["default", 316, 6], ["default", 317, 6], ["default", 318, 6], ["default", 319, 6], ["default", 320, 6], ["default", 321, 6], ["default", 322, 6], ["default", 323, 6], ["default", 324, 6], ["default", 327, 6], ["default", 328, 6], ["default", 331, 6], ["default", 332, 6], ["default", 333, 6], ["default", 334, 6], ["default", 336, 6], ["default", 337, 6], ["default", 338, 6], ["default", 339, 6], ["default", 340, 6], ["default", 341, 6], ["default", 343, 6], ["default", 344, 6], ["default", 345, 6], ["default", 346, 6], ["default", 347, 6], ["default", 349, 6], ["default", 350, 6], ["default", 351, 6], ["default", 352, 6], ["default", 353, 6], ["default", 354, 6], ["default", 355, 6], ["default", 356, 6], ["default", 357, 6], ["default", 358, 6], ["default", 359, 6], ["stone2", 362, 4], ["stone2", 362, 5], ["stone2", 362, 6], ["wood", 363, 5], ["stone2", 363, 6], ["stone2", 364, 6], ["wood", 365, 5], ["stone2", 365, 6], ["stone2", 366, 4], ["stone2", 366, 5], ["stone2", 366, 6], ["wood", 367, 5], ["stone2", 367, 6], ["stone2", 368, 6], ["wood", 369, 5], ["stone2", 369, 6], ["stone2", 370, 4], ["stone2", 370, 5], ["stone2", 370, 6], ["wood", 371, 5], ["stone2", 371, 6], ["stone2", 372, 6], ["wood", 373, 5], ["stone2", 373, 6], ["stone2", 374, 4], ["stone2", 374, 5], ["stone2", 374, 6], ["wood", 375, 5], ["stone2", 375, 6], ["stone2", 376, 6], ["wood", 377, 5], ["stone2", 377, 6], ["stone2", 378, 4], ["stone2", 378, 5], ["stone2", 378, 6], ["dirt", 383, 6], ["default", 384, 3], ["dirt", 384, 4], ["dirt", 384, 6], ["default", 385, 2], ["dirt", 385, 3], ["dirt", 385, 4], ["dirt", 385, 6], ["default", 386, 2], ["dirt", 386, 3], ["dirt", 386, 4], ["dirt", 386, 6], ["default", 388, 3], ["dirt", 388, 4], ["dirt", 388, 6], ["default", 389, 2], ["dirt", 389, 3], ["dirt", 389, 4], ["dirt", 389, 6], ["default", 390, 2], ["dirt", 390, 3], ["dirt", 390, 6], ["default", 391, 1], ["dirt", 391, 2], ["dirt", 391, 6], ["default", 392, 1], ["dirt", 392, 2], ["dirt", 392, 3], ["dirt", 392, 4], ["dirt", 392, 5], ["dirt", 392, 6], ["default", 393, 1], ["dirt", 393, 2], ["dirt", 393, 3], ["dirt", 393, 4], ["dirt", 393, 5], ["dirt", 393, 6], ["default", 394, 0], ["dirt", 394, 1], ["dirt", 394, 2], ["dirt", 394, 3], ["dirt", 394, 4], ["dirt", 394, 6], ["default", 395, 0], ["dirt", 395, 1], ["dirt", 395, 6], ["default", 396, 0], ["dirt", 396, 1], ["dirt", 396, 4], ["dirt", 396, 6], ["default", 397, 0], ["dirt", 397, 1], ["dirt", 397, 4], ["dirt", 397, 5], ["dirt", 397, 6], ["default", 398, 0], ["dirt", 398, 1], ["dirt", 398, 4], ["dirt", 398, 5], ["dirt", 398, 6], ["default", 399, 0], ["dirt", 399, 1], ["dirt", 399, 4], ["dirt", 399, 5], ["default", 400, 0], ["dirt", 400, 1], ["dirt", 400, 4], ["dirt", 400, 5], ["dirt", 400, 6], ["dirt", 401, 2], ["dirt", 401, 4], ["dirt", 401, 5], ["dirt", 401, 6], ["dirt", 402, 2], ["dirt", 402, 3], ["dirt", 402, 4], ["dirt", 402, 5], ["dirt", 403, 4], ["default", 404, -1], ["dirt", 404, 0], ["dirt", 404, 1], ["dirt", 404, 4], ["default", 405, -1], ["dirt", 405, 0], ["dirt", 405, 4], ["default", 406, -1], ["dirt", 406, 0], ["dirt", 406, 1], ["dirt", 406, 4], ["dirt", 407, 1], ["dirt", 407, 2], ["dirt", 407, 3], ["dirt", 407, 4], ["dirt", 408, 3], ["dirt", 408, 4], ["default", 409, -2], ["dirt", 409, -1], ["dirt", 409, 0], ["dirt", 409, 4], ["default", 410, -2], ["dirt", 410, -1], ["dirt", 410, 0], ["dirt", 410, 4], ["default", 411, -1], ["dirt", 411, 0], ["dirt", 411, 1], ["dirt", 411, 2], ["dirt", 411, 3], ["dirt", 411, 4], ["dirt", 411, 5], ["default", 412, 0], ["dirt", 412, 1], ["dirt", 412, 2], ["dirt", 412, 3], ["dirt", 412, 6], ["default", 413, 0], ["dirt", 413, 1], ["dirt", 413, 6], ["default", 414, 0], ["dirt", 414, 1], ["dirt", 414, 5], ["default", 415, 1], ["dirt", 415, 2], ["dirt", 415, 3], ["dirt", 415, 4], ["dirt", 415, 5]],
  entities: [{ name: "manaPot", pos: [485.6330162237009, 348], skinName: "default" }, { name: "manaPot", pos: [605.6383789811518, 348], skinName: "default" }, {
    name: "speedBooster",
    pos: [2812.2347522228215, 355.5],
    skinName: "default"
  }, {
    name: "rainbow",
    pos: [4137.700972128387, -281.40700721319774],
    skinName: "default"
  }, {
    name: "manaPot",
    pos: [4173.970876438694, -15.806867394646929],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [4355.470876438694, -1.306867394646929],
    skinName: "default"
  }, { name: "manaPot", pos: [5423.255953223659, 291], skinName: "default" }, {
    name: "speedBooster",
    pos: [5706.755953223659, 298.5],
    skinName: "default"
  }, { name: "manaPot", pos: [5873.255953223659, 289], skinName: "default" }, {
    name: "speedBooster",
    pos: [6187.755953223659, 288.5],
    skinName: "default"
  }, { name: "manaPot", pos: [6463.255953223659, 282], skinName: "default" }, {
    name: "speedBooster",
    pos: [6769.755953223659, 301.5],
    skinName: "default"
  }, { name: "manaPot", pos: [7057.255953223659, 286], skinName: "default" }, {
    name: "rainbow",
    pos: [9023.31340703079, -143.56851863088718],
    skinName: "default"
  }, {
    name: "rainbow",
    pos: [11116.838169488621, -432.3583991660562],
    skinName: "default"
  }, { name: "manaPot", pos: [13550.334932109752, 64], skinName: "default" }, { name: "manaPot", pos: [13795.334932109752, 70], skinName: "default" }, { name: "manaPot", pos: [14045.334932109752, 65], skinName: "default" }, {
    name: "rainbow",
    pos: [14492.279191459636, -110.14351629708781],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [14782.741349921134, 303.5],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [14979.741349921134, 305.5],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [15148.741349921134, 303.5],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [15301.741349921134, 301.5],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [15432.741349921134, 298.5],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [15588.741349921134, 299.5],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [15734.741349921134, 301.5],
    skinName: "default"
  }, {
    name: "speedBooster",
    pos: [16009.741349921134, 292.5],
    skinName: "default"
  }, { name: "enemy", pos: [17111.241349921132, 276.5], skinName: "cactus" }, { name: "enemy", pos: [17836.241349921132, 281.5], skinName: "cactus" }, { name: "enemy", pos: [19095.241349921132, 264.5], skinName: "target" }]
};

exports.default = (0, _defineLevel.defineLevel)(spec, createLevelOptions());


function createLevelOptions() {
  const howToSplash = howToSplasher();

  return {
    onStart: (game, level) => {
      // level.sounds.get('music').playOnce();
    },
    afterUpdate: (game, level) => {
      howToSplash(game, level);
    }
  };
}

function howToSplasher() {
  const distance = 500;
  let distanceReached = false;

  return (game, level) => {
    const player = game.playerEnv.playerController.player;

    const nearDistance = Math.abs(player.pos.x - distance) < 10;
    if (!distanceReached && nearDistance) {
      distanceReached = true;
      (0, _Splash.splash)("press shift to boost", { size: 50, timeout: 2000 });
    }
  };
}
},{"../Splash":28,"../Traits":62,"./defineLevel":89,"../math":32,"../../img/backgrounds/clouds.png":85,"../../img/backgrounds/mountains.png":86,"../../img/backgrounds/forest.png":87,"../../sounds/hooked-on-a-feeling.mp3":84,"../../img/tiles/y5lxj.png":88}],72:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _demo = require('./demo');

var _demo2 = _interopRequireDefault(_demo);

var _one = require('./one');

var _one2 = _interopRequireDefault(_one);

var _two = require('./two');

var _two2 = _interopRequireDefault(_two);

var _three = require('./three');

var _three2 = _interopRequireDefault(_three);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = [_demo2.default, _one2.default, _two2.default, _three2.default];
},{"./demo":78,"./one":79,"./two":80,"./three":81}],11:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LevelManager = exports.LevelEvents = undefined;

var _dec, _class;

var _levels = require('./levels');

var _levels2 = _interopRequireDefault(_levels);

var _Splash = require('./Splash');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LevelState = {
    IDLE: Symbol('IDLE'),

    FAILED: Symbol('FAILED'),
    FINISH_ANIMATION: Symbol('FINISH_ANIMATION'),
    FINISHED: Symbol('FINISHED')
};

const LevelEvents = exports.LevelEvents = {
    FAILED: Symbol('FAILED'),
    FINISHED: Symbol('FINISHED')
};

let LevelManager = exports.LevelManager = (_dec = _util.EventEmitter.decorator, _dec(_class = class LevelManager {
    constructor(game) {
        this.game = game;

        const loadLastLevel = false;
        const showDemoLevel = true;

        let currentLevel = showDemoLevel ? 0 : 1;

        if (loadLastLevel) {
            const lastLevel = localStorage.getItem('levelIdx') ? parseInt(localStorage.getItem('levelIdx')) : undefined;

            currentLevel = lastLevel || currentLevel;
        }

        this.levels = _levels2.default;
        this.levelIdx = currentLevel;
        this.levelState = LevelState.IDLE;

        this.level = undefined;
        this.stopLevel = undefined;

        this.showSplash = true;
        this.finishDistance = 1500;
        this.fallDistance = 600;

        this.levelSelector = document.getElementById('current-level');
    }

    get playerController() {
        return this.game.playerEnv.playerController;
    }

    get player() {
        return this.game.playerEnv.playerController.player;
    }

    async restartLevel() {
        return this.runLevel(this.levelIdx);
    }

    async nextLevel() {
        this.levelIdx += 1;
        return this.runLevel(this.levelIdx);
    }

    async runLevel(levelIdx = this.levelIdx) {
        this.stopLevel && this.stopLevel();
        localStorage.setItem('levelIdx', levelIdx);

        this.game.canvasSelector.classList.toggle('black', true);

        this.levelIdx = levelIdx;

        this.levelSelector.innerHTML = levelIdx;

        const { init } = this.levels[levelIdx];
        const { level, startLevel, stopLevel } = await init(this.game);

        this.level = level;
        this.stopLevel = stopLevel;

        if (this.showSplash && level.name) {
            await (0, _Splash.splash)(level.name);
        }
        this.game.canvasSelector.classList.toggle('black', false);

        startLevel();

        this.levelState = LevelState.IDLE;

        return level;
    }

    update(deltaTime) {
        if (!this.level) {
            return;
        }

        if (this.level.frozen) {
            return;
        }

        if (this.levelState === LevelState.FINISHED) {
            return;
        }

        if ([LevelState.FINISH_ANIMATION, LevelState.IDLE].includes(this.levelState)) {
            this.checkFinished();
        }

        if (this.levelState === LevelState.IDLE) {
            this.checkFailed();
        }
    }

    checkFinished() {
        const distToFinish = this.level.distance - this.player.pos.x;

        if (distToFinish > this.finishDistance) {
            return;
        }

        const animationEnd = this.player.pos.y + this.player.size.y < -500;

        if (animationEnd) {
            this.levelState = LevelState.FINISHED;
            this.onFinish();
            return;
        }

        if (this.levelState === LevelState.IDLE) {
            this.levelState = LevelState.FINISH_ANIMATION;

            this.ufo = this.game.entityFactory.ufo({ napEntity: this.player });
            this.level.entities.add(this.ufo);
            this.game.cameraController.focus.notice(this.ufo, 10000);
        }
    }

    checkFailed() {
        const death = this.player.killable.dead && !this.level.entities.has(this.player);
        const fall = this.player.pos.y > this.fallDistance;
        const levelFailed = death || fall;

        if (fall) {
            this.player.killable.kill();
        }

        if (levelFailed) {
            this.onFail();
            this.levelState = LevelState.FAILED;
        }
    }

    onFinish() {
        const isLastLevel = this.levelIdx === this.levels.length - 1;

        this.emit(LevelEvents.FINISHED, { isLastLevel });
    }

    onFail() {
        this.emit(LevelEvents.FAILED);
    }
}) || _class);
},{"./levels":72,"./Splash":28,"./util":29}],13:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TileCollider = exports.TileResolver = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Entity = require('./Entity');

let TileResolver = exports.TileResolver = class TileResolver {
    constructor(matrix, tileSize = 60) {
        this.matrix = matrix;
        this.tileSize = tileSize;
    }

    toIndex(pos) {
        if (pos >= 0) {
            return Math.floor(pos / this.tileSize);
        } else {
            return Math.ceil(pos / this.tileSize) - 1;
        }
    }

    toIndexRange(pos1, pos2, toIndex) {
        const pMax = Math.ceil(pos2 / this.tileSize) * this.tileSize;
        const range = [];
        let pos = pos1;
        do {
            range.push(this.toIndex(pos));
            pos += this.tileSize;
        } while (pos < pMax);
        return range;
    }

    getByIndex(indexX, indexY) {
        const tile = this.matrix.get(indexX, indexY);
        if (tile) {
            const x1 = indexX * this.tileSize;
            const x2 = x1 + this.tileSize;
            const y1 = indexY * this.tileSize;
            const y2 = y1 + this.tileSize;
            return _extends({}, tile, {
                indexX,
                indexY,
                x1,
                x2,
                y1,
                y2
            });
        }
    }

    getTilePos(indexX, indexY) {
        const x1 = indexX * this.tileSize;
        const x2 = x1 + this.tileSize;
        const y1 = indexY * this.tileSize;
        const y2 = y1 + this.tileSize;

        return {
            x1,
            x2,
            y1,
            y2
        };
    }

    searchByPosition(posX, posY) {
        const x = this.toIndex(posX);
        const y = this.toIndex(posY);
        return this.getByIndex(x, y);
    }

    searchByRange(x1, x2, y1, y2) {
        const matches = [];
        this.toIndexRange(x1, x2).forEach(indexX => {
            this.toIndexRange(y1, y2).forEach(indexY => {
                const match = this.getByIndex(indexX, indexY);
                if (match) {
                    matches.push(match);
                }
            });
        });
        return matches;
    }
};
let TileCollider = exports.TileCollider = class TileCollider {
    constructor(matrix) {
        this.tiles = new TileResolver(matrix);
    }

    willCollideX(entity, distance) {
        let x;
        if (entity.vel.x > 0) {
            x = entity.bounds.right;
        } else if (entity.vel.x < 0) {
            x = entity.bounds.left;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(x, x + distance, entity.bounds.top, entity.bounds.bottom);

        return matches.length > 0;
    }

    checkX(entity) {
        let x;
        if (entity.vel.x > 0) {
            x = entity.bounds.right;
        } else if (entity.vel.x < 0) {
            x = entity.bounds.left;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(x, x, entity.bounds.top, entity.bounds.bottom);

        matches.forEach(match => {
            if (entity.vel.x > 0) {
                if (entity.bounds.right > match.x1) {
                    entity.obstruct(_Entity.Sides.RIGHT, match);
                }
            } else if (entity.vel.x < 0) {
                if (entity.bounds.left < match.x2) {
                    entity.obstruct(_Entity.Sides.LEFT, match);
                }
            }
        });
    }

    checkY(entity) {
        let y;
        if (entity.vel.y > 0) {
            y = entity.bounds.bottom;
        } else if (entity.vel.y < 0) {
            y = entity.bounds.top;
        } else {
            return;
        }

        const matches = this.tiles.searchByRange(entity.bounds.left, entity.bounds.right, y, y);

        matches.forEach(match => {
            if (entity.vel.y > 0) {
                if (entity.bounds.bottom > match.y1) {
                    entity.obstruct(_Entity.Sides.BOTTOM, match);
                }
            } else if (entity.vel.y < 0) {
                if (entity.bounds.top < match.y2) {
                    entity.obstruct(_Entity.Sides.TOP, match);
                }
            }
        });
    }
};
},{"./Entity":33}],16:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createBackgroundLayer = createBackgroundLayer;
exports.createStaticBackgroundLayer = createStaticBackgroundLayer;
exports.createSpriteLayer = createSpriteLayer;
exports.createDebugLayer = createDebugLayer;

var _math = require('./math');

var _TileCreation = require('./TileCreation');

function createBackgroundLayer(level, tileSprite) {
    const resolver = new _TileCreation.TileResolver(level.tileGrid);
    const buffer = document.createElement('canvas');

    buffer.width = 1024 + 60;
    buffer.height = 600 + 60;

    const context = buffer.getContext('2d');

    function redraw(x, y, width, height) {
        context.clearRect(0, 0, buffer.width, buffer.height);

        const startX = x;
        const endX = x + width;
        const startY = y;
        const endY = y + height;

        for (let x = startX; x <= endX; ++x) {
            for (let y = startY; y <= endY; y++) {
                const tile = level.tileGrid.get(x, y);
                if (tile) {
                    const skinName = tile.skinName || 'default';
                    tileSprite.drawTile(skinName, context, x - startX, y - startY);
                }
            }
        }
    }

    return function drawBackgroundLayer(context, camera) {
        const width = resolver.toIndex(camera.size.x);
        const height = resolver.toIndex(camera.size.y);
        const x = resolver.toIndex(camera.pos.x);
        const y = resolver.toIndex(camera.pos.y);

        const xOffset = x < 0 ? 60 : 0;
        const yOffset = y < 0 ? 60 : 0;

        redraw(x, y, width, height);

        context.drawImage(buffer, -camera.pos.x % 60 - xOffset, -camera.pos.y % 60 - yOffset);
    };
}

function createStaticBackgroundLayer(level, backgroundSprites, getGradientSteps) {
    const buffer = document.createElement('canvas');
    buffer.width = 1024 + 60;
    buffer.height = 600 + 60;

    const context = buffer.getContext('2d');

    const images = {
        SkyImage: backgroundSprites.sky,
        BackImage: backgroundSprites.back,
        FrontImage: backgroundSprites.front
    };

    function drawGradient(context, camera) {
        const gradient = context.createLinearGradient(0, 0, 0, buffer.width);

        const steps = getGradientSteps(camera.pos);

        for (const [color, step] of steps) {
            gradient.addColorStop(step, color);
        }

        context.fillStyle = gradient;
        context.fillRect(0, 0, buffer.width, buffer.height);
    }

    function drawImages(context, camera) {
        const SkyImage = images.SkyImage;
        const BackImage = images.BackImage;
        const FrontImage = images.FrontImage;

        const skyMargin = 500;
        const widthMetric = FrontImage || BackImage || SkyImage;
        const count = Math.floor(level.distance / (widthMetric ? widthMetric.width : 1)) + 5;

        const SkyCoordX = -camera.pos.x / 2.9;
        const BackCoordX = -camera.pos.x / 1.9;
        const FrontCoordX = -camera.pos.x / 0.9;

        const SkyCoordY = -camera.pos.y * 0.05;
        const BackCoordY = -camera.pos.y * 0.07;
        const FrontCoordY = -camera.pos.y * 0.2;

        for (let i = 0; i < count; i++) {
            SkyImage && context.drawImage(SkyImage, SkyCoordX + SkyImage.width * i + i * skyMargin, SkyCoordY);
            BackImage && context.drawImage(BackImage, BackCoordX + BackImage.width * i, BackCoordY + camera.size.y - BackImage.height);
            FrontImage && context.drawImage(FrontImage, FrontCoordX + FrontImage.width * i, FrontCoordY + camera.size.y - FrontImage.height);
        }
    }

    return function drawStaticBackgroundLayer(context, camera) {
        drawGradient(context, camera);
        drawImages(context, camera);
    };
}

function createSpriteLayer(entities, width = 240, height = 350) {
    const spriteBuffer = document.createElement('canvas');
    spriteBuffer.width = width;
    spriteBuffer.height = height;
    const spriteBufferContext = spriteBuffer.getContext('2d');

    return function drawSpriteLayer(context, camera) {
        entities.forEach(entity => {
            spriteBufferContext.clearRect(0, 0, width, height);

            entity.draw(spriteBufferContext);

            context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);
        });
    };
}

function createDebugLayer(editor) {
    const buffer = document.createElement('canvas');
    buffer.width = 1024 + 60;
    buffer.height = 600 + 60;

    const context = buffer.getContext('2d');

    function drawEntityBounds(camera) {
        context.clearRect(0, 0, buffer.width, buffer.height);

        const camBounds = camera.getBounds();
        const level = editor.level;

        const selectedEntity = editor.selection.selectedEntity;
        const selectedTile = editor.selection.selectedTile;

        if (selectedEntity) {
            for (const e of level.entities) {
                if (!camBounds.overlaps(e.bounds)) {
                    continue;
                }
                context.beginPath();
                context.strokeStyle = selectedEntity === e ? 'white' : 'black';
                context.lineWidth = selectedEntity === e ? 2 : 1;
                context.rect(e.bounds.left - camBounds.left, e.bounds.top - camBounds.top, e.size.x, e.size.y);
                context.stroke();
                context.closePath();
            }
        } else if (selectedTile) {
            const tile = selectedTile;

            context.beginPath();
            context.strokeStyle = 'white';
            context.lineWidth = 2;
            context.rect(tile.x1 - camera.pos.x, tile.y1 - camera.pos.y, tile.x2 - tile.x1, tile.y2 - tile.y1);
            context.stroke();
            context.closePath();
        }
    }

    function drawLayer(context, camera) {
        drawEntityBounds(camera);

        context.drawImage(buffer, 0, 0);
    }

    return function drawDebugLayer(context, camera) {
        drawLayer(context, camera);
    };
}
},{"./math":32,"./TileCreation":13}],49:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let Compositor = exports.Compositor = class Compositor {
    constructor() {
        this.layers = [];
    }

    addLayer(layer) {
        this.layers.push(layer);
    }

    draw(context, camera) {
        this.layers.forEach(layer => {
            layer(context, camera);
        });
    }
};
},{}],50:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EntityCollider = undefined;

var _Entity = require('./Entity');

let EntityCollider = exports.EntityCollider = class EntityCollider {
    constructor(entities) {
        this.entities = entities;
    }

    check(subject) {
        this.entities.forEach(candidate => {
            if (subject === candidate) {
                return;
            }

            if (subject.bounds.overlaps(candidate.bounds)) {
                const side = this.getSideY(subject, candidate) || this.getSideX(subject, candidate);
                subject.collides(candidate, side);
            }
        });
    }

    getSideX(subject, candidate) {
        if (subject.bounds.left > candidate.bounds.left && subject.bounds.left < candidate.bounds.right) {
            return _Entity.Sides.LEFT;
        }

        if (subject.bounds.right < candidate.bounds.right && subject.bounds.right > candidate.bounds.left) {
            return _Entity.Sides.RIGHT;
        }
    }

    getSideY(subject, candidate) {
        if (subject.bounds.top > candidate.bounds.top && subject.bounds.top < candidate.bounds.bottom) {
            return _Entity.Sides.TOP;
        }

        if (subject.bounds.bottom < candidate.bounds.bottom && subject.bounds.bottom > candidate.bounds.top) {
            return _Entity.Sides.BOTTOM;
        }
    }
};
},{"./Entity":33}],30:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Level = undefined;

var _Compositor = require('./Compositor');

var _EntityCollider = require('./EntityCollider');

var _TileCreation = require('./TileCreation');

let Level = exports.Level = class Level {
    constructor(name) {
        this.name = name;

        this.gravity = 1500;
        this.totalTime = 0;
        this.distance = 0;
        this.freeze = false;

        this.comp = new _Compositor.Compositor();
        this.entities = new Set();
        this.namedEntities = new Map();

        this.entityCollider = new _EntityCollider.EntityCollider(this.entities);
        this.tileCollider = undefined;

        this.tileGrid = undefined;
    }

    setTileGrid(matrix) {
        this.tileGrid = matrix;
        this.tileCollider = new _TileCreation.TileCollider(matrix);
    }

    setDistance(distance) {
        this.distance = distance;
    }

    update(deltaTime) {
        if (this.frozen) {
            return;
        }

        this.entities.forEach(entity => {
            entity.update(deltaTime, this);
        });

        this.entities.forEach(entity => {
            this.entityCollider.check(entity);
        });

        this.entities.forEach(entity => {
            entity.finalize();
        });

        this.totalTime += deltaTime;
    }
};
},{"./Compositor":49,"./EntityCollider":50,"./TileCreation":13}],53:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let Sound = exports.Sound = class Sound {
    constructor(name, buf, createSource) {
        this.name = name;
        this.buffer = buf;
        this.createSource = createSource;

        this.isPlaying = false;
        this.timeoutId = undefined;
        this.source = undefined;
        this.gainNode = undefined;
    }

    playOnce({ rate = 1, volume = 0.3 } = {}) {
        const { gainNode, source } = this.createSource(this.buffer);
        this.gainNode = gainNode;
        this.source = source;

        this.source.playbackRate.value = rate;
        this.gainNode.gain.value = volume;

        this.source.start(0);
        this.isPlaying = true;
    }

    playLoop({ rate = 1, volume = 0.3 } = {}) {
        const { gainNode, source } = this.createSource(this.buffer, {
            loop: true
        });
        this.gainNode = gainNode;
        this.source = source;

        this.source.playbackRate.value = rate;
        this.gainNode.gain.value = volume;

        this.source.start(0);
        this.isPlaying = true;
    }

    startPlaying(options) {
        const { gainNode, source } = this.createSource(this.buffer, options);
        this.gainNode = gainNode;
        this.source = source;

        this.source.start(0);
        this.isPlaying = true;
    }

    stop() {
        if (this.source) {
            this.source.stop();
        }

        this.isPlaying = false;
    }

    playing({ rate = 1, volume = 0.3 } = {}) {
        if (!this.isPlaying) {
            this.startPlaying({ loop: true, rate, volume });
        }

        this.source.playbackRate.value = rate;
        this.gainNode.gain.value = volume;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(this.stop.bind(this), 100);
    }
};
},{}],52:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SoundContext = undefined;

var _Sound = require('./Sound');

let SingleSoundContext = class SingleSoundContext {
    constructor() {
        this.context = new AudioContext();

        document.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(e) {
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
    }

    loadBuffer(url) {
        return fetch(url).then(resp => resp.arrayBuffer()).then(buf => this.context.decodeAudioData(buf));
    }

    async loadSounds(sounds) {
        const soundsMap = new Map();

        const buffers = await Promise.all(sounds.map(sound => this.loadBuffer(sound.url)));

        sounds.forEach((sound, idx) => {
            const buf = buffers[idx];
            soundsMap.set(sound.name, new _Sound.Sound(sound.name, buf, this.createSource.bind(this)));
        });

        return soundsMap;
    }

    createSource(buf, { volume = 0.5, loop = false, rate = 1 } = {}) {
        const source = this.context.createBufferSource();
        const gainNode = this.context.createGain();

        source.buffer = buf;
        source.loop = loop !== undefined ? loop : false;
        source.playbackRate.value = rate !== undefined ? rate : 1;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.context.destination);

        return { source, gainNode };
    }
};
const SoundContext = exports.SoundContext = new SingleSoundContext();
},{"./Sound":53}],51:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
let SpriteSheet = exports.SpriteSheet = class SpriteSheet {
    constructor(skinName, image, width, height) {
        this.skinName = skinName || 'default';
        this.image = image;
        this.width = width;
        this.height = height;
        this.tiles = new Map();
        this.animations = new Map();
    }

    defineAnim(name, animation) {
        this.animations.set(name, animation);
    }

    define(name, x, y, width, height) {
        const buffers = [false, true].map(() => {
            const buffer = document.createElement('canvas');
            buffer.width = width;
            buffer.height = height;

            const context = buffer.getContext('2d');

            context.drawImage(this.image, x, y, width, height, 0, 0, width, height);

            return buffer;
        });

        this.tiles.set(name, buffers);
    }

    draw(name, context, x, y) {
        const buffer = this.tiles.get(name)[0];
        context.drawImage(buffer, x, y);
    }

    drawTile(name, context, x, y) {
        this.draw(name, context, x * this.width, y * this.height);
    }
};
},{}],31:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createAnim = createAnim;
exports.loadImage = loadImage;
exports.loadImages = loadImages;
exports.loadSpriteSheet = loadSpriteSheet;
exports.loadSounds = loadSounds;

var _SoundContext = require('./SoundContext');

var _SpriteSheet = require('./SpriteSheet');

var _Sound = require('./Sound');

function createAnim(frames, frameLen) {
    return function resolveFrame(distance) {
        const frameIndex = Math.floor(distance / frameLen) % frames.length;
        const frameName = frames[frameIndex];
        return frameName;
    };
}

function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.src = url;
    });
}

function loadImages(urlMap) {
    const names = Object.keys(urlMap);
    const urls = Object.values(urlMap);

    return Promise.all(urls.map(url => loadImage(url))).then(images => images.reduce((result, image, idx) => {
        result[names[idx]] = image;
        return result;
    }, {}));
}

function loadSpriteSheet(sheetSpec) {
    return Promise.resolve(sheetSpec).then(sheetSpec => Promise.all([sheetSpec, loadImage(sheetSpec.imageURL)])).then(([sheetSpec, image]) => {
        const sprites = new _SpriteSheet.SpriteSheet(sheetSpec.skinName, image, sheetSpec.tileW, sheetSpec.tileH);

        if (sheetSpec.frames) {
            sheetSpec.frames.forEach(frameSpec => {
                sprites.define(frameSpec.name, ...frameSpec.rect);
            });
        }

        if (sheetSpec.animations) {
            sheetSpec.animations.forEach(animSpec => {
                const animation = createAnim(animSpec.frames, animSpec.frameLen);
                sprites.defineAnim(animSpec.name, animation);
            });
        }

        return sprites;
    });
}

function loadSounds(soundSpec) {
    return Promise.resolve(soundSpec).then(soundSpec => Promise.all([soundSpec, _SoundContext.SoundContext.loadSounds(soundSpec.sounds)])).then(([soundSpec, sounds]) => {
        return Object.assign(sounds, {
            skinName: soundSpec.skinName || 'default'
        });
    });
}
},{"./SoundContext":52,"./SpriteSheet":51,"./Sound":53}],12:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createLevelLoader = createLevelLoader;

var _layers = require('./layers');

var _Level = require('./Level');

var _loaders = require('./loaders');

var _math = require('./math');

function setupTileGrid(levelSpec, level) {
    const tileGrid = createTileGrid(levelSpec.tiles);
    level.setTileGrid(tileGrid);
    level.setDistance(tileGrid.width() * 60);
}

function setupBackgrounds(levelSpec, level, backgroundImages, getGradientSteps, tileSprite) {
    const backgroundLayer = (0, _layers.createBackgroundLayer)(level, tileSprite);
    const staticBackgroundLayer = (0, _layers.createStaticBackgroundLayer)(level, backgroundImages, getGradientSteps);
    level.comp.addLayer(staticBackgroundLayer);
    level.comp.addLayer(backgroundLayer);
}

function setupEntities(levelSpec, level, entityFactory) {
    levelSpec.entities.forEach((tileSpec, idx) => {
        const createEntity = entityFactory[tileSpec.name];
        const entity = createEntity(tileSpec);
        entity.pos.set(tileSpec.pos[0], tileSpec.pos[1]);
        entity.idx = idx;

        level.entities.add(entity);
        tileSpec.id && level.namedEntities.set(tileSpec.id, entity);
    });

    const spriteLayer = (0, _layers.createSpriteLayer)(level.entities);
    level.comp.addLayer(spriteLayer);
}

function setupSounds(level, sounds) {
    level.sounds = sounds;
}

function createLevelLoader(entityFactory) {
    return function loadLevel(levelSpec) {
        return Promise.resolve(levelSpec).then(levelSpec => Promise.all([levelSpec, (0, _loaders.loadImages)(levelSpec.background.images), levelSpec.background.gradient, (0, _loaders.loadSpriteSheet)(levelSpec.tileSprite), levelSpec.sounds && (0, _loaders.loadSounds)(levelSpec)])).then(([levelSpec, backgroundImages, getGradientSteps, tileSprite, sounds]) => {
            const level = new _Level.Level(levelSpec.name);

            setupTileGrid(levelSpec, level);
            setupBackgrounds(levelSpec, level, backgroundImages, getGradientSteps, tileSprite);
            setupEntities(levelSpec, level, entityFactory);
            setupSounds(level, sounds);

            return level;
        });
    };
}

function createTileGrid(tiles) {
    const grid = new _math.Matrix();

    for (const _ref of expandTiles(tiles)) {
        const { skinName, x, y } = _ref;

        const tile = {
            skinName: skinName || 'default'
        };
        grid.set(x, y, tile);
    }

    return grid;
}

function* expandSpan(skinName, xStart, xLen, yStart, yLen) {
    const xEnd = xStart + xLen;
    const yEnd = yStart + yLen;
    for (let x = xStart; x < xEnd; ++x) {
        for (let y = yStart; y < yEnd; ++y) {
            yield { skinName, x, y };
        }
    }
}

function expandRange(range) {
    const skinDeclared = typeof range[0] === 'string';
    const skinName = skinDeclared ? range[0] : undefined;

    range = skinDeclared ? range.slice(1) : range;

    if (range.length === 4) {
        const [xStart, xLen, yStart, yLen] = range;
        return expandSpan(skinName, xStart, xLen, yStart, yLen);
    } else if (range.length === 3) {
        const [xStart, xLen, yStart] = range;
        return expandSpan(skinName, xStart, xLen, yStart, 1);
    } else if (range.length === 2) {
        const [xStart, yStart] = range;
        return expandSpan(skinName, xStart, 1, yStart, 1);
    }
}

function* expandRanges(ranges) {
    for (const range of ranges) {
        yield* expandRange(range);
    }
}

function* expandTiles(tiles) {
    yield* expandRanges(tiles);
}
},{"./layers":16,"./Level":30,"./loaders":31,"./math":32}],14:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
let Timer = exports.Timer = class Timer {
    constructor(deltaTime = 1 / 60) {
        this.rafId = undefined;

        let accumulatedTime = 0;
        let lastTime = 0;

        this.updateProxy = time => {
            accumulatedTime += (time - lastTime) / 1000;

            if (accumulatedTime > 1) {
                accumulatedTime = 1;
            }

            while (accumulatedTime > deltaTime) {
                this.update(deltaTime, time);
                accumulatedTime -= deltaTime;
            }

            lastTime = time;

            this.enqueue();
        };
    }

    update() {}

    enqueue() {
        this.rafId = requestAnimationFrame(this.updateProxy);
    }

    start() {
        this.enqueue();
    }

    stop() {
        cancelAnimationFrame(this.rafId);
    }
};
},{}],24:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Mouse = exports.DragState = exports.MouseEvents = undefined;

var _dec, _class;

var _math = require('../math');

var _util = require('../util');

const MouseEvents = exports.MouseEvents = {
    CLICK: Symbol('CLICK'),
    RIGHTCLICK: Symbol('RIGHTCLICK'),
    DRAG: Symbol('DRAG'),
    MOVE: Symbol('MOVE'),
    WHEEL: Symbol('WHEEL')
};

const DragState = exports.DragState = {
    START: Symbol('START'),
    DRAGGING: Symbol('DRAGGING'),
    STOP: Symbol('STOP')
};

let Mouse = exports.Mouse = (_dec = _util.EventEmitter.decorator, _dec(_class = class Mouse {
    constructor(editor) {
        this.editor = editor;

        this.pos = new _math.Vec2(0, 0);

        this.downTime = 0;
        this.downPos = new _math.Vec2(0, 0);

        this.dragging = false;

        this.initHandlers();
    }

    toGamePos(x, y) {
        const cam = this.editor.camera;
        return new _math.Vec2(cam.pos.x + x, cam.pos.y + y);
    }

    initHandlers() {
        const canvas = this.editor.canvasSelector;

        canvas.addEventListener('mousemove', this.handleMove.bind(this));
        canvas.addEventListener('mousedown', this.handleDown.bind(this));
        canvas.addEventListener('mouseup', this.handleUp.bind(this));
        canvas.addEventListener('wheel', this.handleWheel.bind(this));
        canvas.addEventListener('contextmenu', e => {
            e.stopPropagation();
            e.preventDefault();
            return false;
        });
    }

    handleDown(e) {
        e.preventDefault();

        const { offsetX, offsetY } = e;

        this.downTime = new Date().valueOf();
        this.downPos.set(offsetX, offsetY);
    }

    handleUp(e) {
        e.preventDefault();

        const { offsetX, offsetY } = e;
        const pos = this.toGamePos(offsetX, offsetY);

        if (this.dragging) {
            this.handleDrag(e, DragState.STOP, pos);
            this.dragging = false;
            this.downTime = 0;
            return;
        }

        this.handleClick(e);
        this.downTime = 0;
        return;
    }

    handleMove(e) {
        e.preventDefault();

        const { offsetX, offsetY } = e;
        const downPos = this.toGamePos(this.downPos.x, this.downPos.y);
        const pos = this.toGamePos(offsetX, offsetY);
        const delta = new _math.Vec2(pos.x - downPos.x, pos.y - downPos.y);

        const drag = this.downTime > 0 && pos.distance(this.downPos) > 2;
        if (drag) {
            const dragState = this.dragging ? DragState.DRAGGING : DragState.START;
            this.handleDrag(e, dragState, pos, delta);
            this.dragging = true;
        }

        this.emit(MouseEvents.MOVE, pos);
        this.pos = pos;
    }

    handleClick(e) {
        e.preventDefault();

        const { offsetX, offsetY } = e;
        const pos = this.toGamePos(offsetX, offsetY);

        if (e.which === 1) {
            this.emit(MouseEvents.CLICK, pos);
        } else if (e.which === 3) {
            e.preventDefault();
            e.stopPropagation();
            this.emit(MouseEvents.RIGHTCLICK, pos);
        }
    }

    handleWheel(e) {
        e.preventDefault();

        const { deltaX, deltaY } = e;

        this.emit(MouseEvents.WHEEL, new _math.Vec2(deltaX, deltaY));
    }

    handleDrag(e, dragState, pos, delta) {
        this.emit(MouseEvents.DRAG, dragState, pos, delta);
    }
}) || _class);
},{"../math":32,"../util":29}],47:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.updateTileGrid = updateTileGrid;
exports.updateEntity = updateEntity;
exports.createEntity = createEntity;
exports.removeEntity = removeEntity;
exports.saveLocal = saveLocal;
function updateTileGrid(spec, grid) {
    spec.tiles.splice(0, spec.tiles.length);

    for (const _ref of grid) {
        const { x, y, tile } = _ref;

        spec.tiles.push([tile.skinName || 'default', x, y]);
    }
}

function updateEntity(levelSpec, idx, specUpdates) {
    const entitySpec = levelSpec.entities[idx];

    levelSpec.entities[idx] = _extends({}, entitySpec, specUpdates);
}

function createEntity(levelSpec, entitySpec) {
    const idx = levelSpec.entities.length;
    levelSpec.entities[idx] = entitySpec;
    return idx;
}

function removeEntity(levelSpec, idx) {
    delete levelSpec.entities[idx];
}

async function saveLocal(levelIdx, levelSpec) {
    // remove deleted entities and sort by x
    const entities = levelSpec.entities.filter(e => !!e).sort((a, b) => a.pos[0] < b.pos[0] ? -1 : 1);

    const specUpdate = {
        entities,
        tiles: levelSpec.tiles
    };
    const body = JSON.stringify({ specUpdate, levelIdx });

    const url = 'http://localhost:12345/spec';
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body
    });

    const result = await resp.json();
    return result;
}
},{}],23:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Interaction = exports.InteractionMode = undefined;

var _dec, _class;

var _math = require('../math');

var _util = require('../util');

var _Mouse = require('./Mouse');

var _SpecTools = require('./SpecTools');

var SpecTools = _interopRequireWildcard(_SpecTools);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const InteractionMode = exports.InteractionMode = {
    SELECT: Symbol('SELECT'),
    TILE: Symbol('TILE'),
    ENTITY: Symbol('ENTITY')
};

let Interaction = exports.Interaction = (_dec = _util.EventEmitter.decorator, _dec(_class = class Interaction {
    constructor(editor) {
        this.editor = editor;
        this.mode = InteractionMode.SELECT;

        this.editor.mouse.on(_Mouse.MouseEvents.CLICK, this.onClick.bind(this));
        this.editor.mouse.on(_Mouse.MouseEvents.RIGHTCLICK, this.onRightClick.bind(this));
        this.editor.mouse.on(_Mouse.MouseEvents.DRAG, this.onDrag.bind(this));
        this.editor.mouse.on(_Mouse.MouseEvents.MOVE, this.onMove.bind(this));
        this.editor.mouse.on(_Mouse.MouseEvents.WHEEL, this.onWheel.bind(this));

        window.addEventListener('keydown', this.onKeyPress.bind(this));

        this.dragging = {};
        this.createEntityName = undefined;
        this.createEntitySkinName = undefined;
        this.createTileSkin = undefined;
    }

    get level() {
        return this.editor.level;
    }

    get cam() {
        return this.editor.camera;
    }

    setMode(mode) {
        this.mode = mode;
        this.emit('change');
    }

    setCreateEntityName(entityName) {
        this.createEntityName = entityName;
    }

    setCreateTileSkin(skinName) {
        this.createTileSkin = skinName;
    }

    setCreateEntitySkinName(skinName) {
        this.createEntitySkinName = skinName;
    }

    onKeyPress(e) {
        switch (e.code) {
            case 'KeyT':
                this.editor.paused ? this.editor.resume() : this.editor.pause();
                break;
            case 'KeyR':
                this.editor.restart();
                break;
            case 'KeyQ':
                this.setMode(InteractionMode.SELECT);
                break;
            case 'KeyW':
                this.setMode(InteractionMode.TILE);
                break;
            case 'KeyE':
                this.setMode(InteractionMode.ENTITY);
                break;
            case 'ArrowRight':
                this.setCamPos(this.cam.pos.x + 500, this.cam.pos.y);
                break;
            case 'ArrowLeft':
                this.setCamPos(this.cam.pos.x - 500, this.cam.pos.y);
                break;
            default:
                break;
        }
    }

    onMove(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        const tile = this.editor.picker.pickTile(pos);
    }

    onDrag(dragState, pos, delta) {
        if (dragState === _Mouse.DragState.STOP) {
            this.dragging = {};
            return;
        }

        this.tryDrawTiles(dragState, pos, delta) || this.tryDragCamera(dragState, pos, delta) || this.tryDragEntity(dragState, pos, delta);
    }

    tryDrawTiles(dragState, pos) {
        const tile = this.editor.picker.pickTile(pos);

        if (!tile && this.mode !== InteractionMode.TILE) {
            return false;
        }

        if (dragState === _Mouse.DragState.START) {
            this.dragging.drawTiles = true;
            this.dragging.remove = tile ? true : false;
            return true;
        }

        if (!this.dragging.drawTiles) {
            return false;
        }

        if (dragState === _Mouse.DragState.DRAGGING) {
            if (this.dragging.remove && tile) {
                this.removeTile(pos);
            } else if (!this.dragging.remove && !tile) {
                this.createTile(pos);
            }
        }

        return true;
    }

    tryDragCamera(dragState, pos, delta) {
        if (dragState === _Mouse.DragState.START) {
            const entity = this.editor.picker.pickEntity(pos);
            const tile = this.editor.picker.pickTile(pos);

            if (!entity && !tile) {
                this.dragging.moveCamera = true;
                this.dragging.startPos = pos;
                this.dragging.offsetX = pos.x - this.cam.pos.x;
                this.dragging.offsetY = pos.y - this.cam.pos.y;
                return true;
            }
        }

        if (!this.dragging.moveCamera) {
            return false;
        }

        if (dragState === _Mouse.DragState.DRAGGING) {
            const x = this.dragging.startPos.x - this.dragging.offsetX - delta.x;
            const y = this.dragging.startPos.y - this.dragging.offsetY - delta.y;

            this.setCamPos(x, y);
        }

        return true;
    }

    tryDragEntity(dragState, pos) {
        if (dragState === _Mouse.DragState.START) {
            const entity = this.editor.picker.pickEntity(pos);

            if (entity) {
                this.editor.selection.selectEntity(entity);
                this.dragging.entity = entity;
                this.dragging.offsetX = pos.x - entity.pos.x;
                this.dragging.offsetY = pos.y - entity.pos.y;
                return true;
            }
        }

        if (!this.dragging.entity) {
            return false;
        }

        if (dragState === _Mouse.DragState.DRAGGING) {
            const x = pos.x - this.dragging.offsetX;
            const y = pos.y - this.dragging.offsetY;
            this.dragging.entity.pos.x = x;
            this.dragging.entity.pos.y = y;

            SpecTools.updateEntity(this.editor.levelSpec, this.dragging.entity.idx, {
                pos: [x, y]
            });
        }

        this.emit('change');

        return true;
    }

    onClick(pos) {
        switch (this.mode) {
            case InteractionMode.SELECT:
                this.selectInPosition(pos);
                break;
            case InteractionMode.TILE:
                this.createTile(pos);
                break;
            case InteractionMode.ENTITY:
                this.createEntity(pos);
            default:
                break;
        }
    }

    onRightClick(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        if (entity) {
            this.removeEntity(pos);
        }

        const tile = this.editor.picker.pickTile(pos);
        if (tile) {
            this.removeTile(pos);
        }
    }

    onWheel(delta) {
        const x = this.cam.pos.x + delta.x;
        const y = this.cam.pos.y + delta.y;

        this.setCamPos(x, y);
    }

    setCamPos(x, y) {
        this.cam.pos.x = (0, _math.clamp)(x, -1000, Infinity);
        this.cam.pos.y = (0, _math.clamp)(y, -1000, 0);
    }

    createEntity(pos) {
        const entityCreator = this.editor.entityFactory[this.createEntityName];
        const entity = entityCreator({ skinName: this.createEntitySkinName });

        const x = pos.x - entity.size.x / 2 - entity.offset.x;
        const y = pos.y - entity.size.y / 2 - entity.offset.y;

        const idx = SpecTools.createEntity(this.editor.levelSpec, {
            name: entity.name,
            pos: [x, y],
            skinName: this.createEntitySkinName
        });
        entity.pos.set(x, y);
        entity.idx = idx;

        this.editor.level.entities.add(entity);
    }

    removeEntity(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        SpecTools.removeEntity(this.editor.levelSpec, entity.idx);
        this.editor.level.entities.delete(entity);
    }

    createTile(pos) {
        const tileIndex = this.editor.picker.pickTileIndex(pos);

        if (tileIndex) {
            const tile = { skinName: this.createTileSkin };
            this.level.tileGrid.set(tileIndex.x, tileIndex.y, tile);
            SpecTools.updateTileGrid(this.editor.levelSpec, this.level.tileGrid);
        }
    }

    removeTile(pos) {
        const tileIndex = this.editor.picker.pickTileIndex(pos);

        if (tileIndex) {
            this.level.tileGrid.remove(tileIndex.x, tileIndex.y);
            SpecTools.updateTileGrid(this.editor.levelSpec, this.level.tileGrid);
        }
    }

    selectInPosition(pos) {
        const entity = this.editor.picker.pickEntity(pos);
        if (entity) {
            this.editor.selection.selectEntity(entity);
            return;
        }

        const tile = this.editor.picker.pickTile(pos);
        if (tile) {
            this.editor.selection.selectTile(tile);
            return;
        }

        this.editor.selection.clear();
    }

    async saveToFile() {
        const { success } = await SpecTools.saveLocal(this.editor.levelIdx, this.editor.levelSpec);

        return success;
    }
}) || _class);
},{"../math":32,"../util":29,"./Mouse":24,"./SpecTools":47}],63:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.defineGameObject = defineGameObject;

var _Entity = require('./Entity');

var _loaders = require('./loaders');

function getDrawFn(sprite, animations, bounds) {
    const routeAnim = animations(sprite);

    return function (context) {
        sprite.draw(routeAnim(this), context, 0, 0, bounds);
    };
}

const defaultOptions = {
    spriteSpecs: [],
    soundSpecs: [],

    traits: undefined,
    animations: undefined,
    sounds: undefined,

    drawBounds: false,
    afterCreate: undefined
};

function defineGameObject(name, options) {
    const {
        spriteSpecs,
        soundSpecs,
        traits,
        animations,
        sounds,
        drawBounds,
        afterCreate
    } = _extends({}, defaultOptions, options);

    return async () => {
        const [sprites, soundSets] = await Promise.all([Promise.all(spriteSpecs.map(spec => (0, _loaders.loadSpriteSheet)(spec))), Promise.all(soundSpecs.map(spec => (0, _loaders.loadSounds)(spec)))]);

        function create(options = {}) {
            const skinName = options.skinName || 'default';

            let skinSprite = sprites.find(sprite => sprite.skinName === skinName);
            let spriteSpec = spriteSpecs.find(spec => spec.skinName === skinName);

            const skinSounds = soundSets.find(sound => sound.skinName === skinName);

            if (!skinSprite) {
                console.warn(`Skin "${name} [${skinName}]" not found. Fallback to the first one.`);
                skinSprite = sprites[0];
                spriteSpec = spriteSpecs[0];
            }

            const entity = new _Entity.Entity(name);
            entity.size.set(spriteSpec.size[0], spriteSpec.size[1]);
            entity.offset.x = spriteSpec.offset[0];
            entity.offset.y = spriteSpec.offset[1];

            traits(_extends({}, options, { sounds: skinSounds })).forEach(trait => entity.addTrait(trait));

            const bounds = drawBounds ? entity.bounds.clone() : undefined;
            entity.draw = getDrawFn(skinSprite, animations, bounds);

            entity.voice = sounds ? sounds(skinSounds) : undefined;

            afterCreate && afterCreate(entity);

            return entity;
        };

        create.availableSkins = sprites.map(s => s.skinName || 'default');

        return create;
    };
}
},{"./Entity":33,"./loaders":31}],76:[function(require,module,exports) {
module.exports="/dist/559ecc53ce800c0f51b895b1ebef678f.png";
},{}],70:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    skinName: 'cactus',
    imageURL: require('../../../img/enemies/cactus.png'),
    size: [50, 51],
    offset: [5, 21],
    frames: [{
        name: 'idle-1',
        rect: [61 * 0, -8, 61, 73]
    }, {
        name: 'idle-2',
        rect: [61 * 1 + 1, -8, 61, 73]
    }, {
        name: 'idle-3',
        rect: [61 * 2 + 1, -8, 61, 73]
    }, {
        name: 'idle-4',
        rect: [61 * 3 + 1, -8, 61, 73]
    }, {
        name: 'idle-5',
        rect: [61 * 4 + 4, -7, 61, 73]
    }, {
        name: 'idle-6',
        rect: [61 * 5 + 9, -7, 61, 73]
    }, {
        name: 'attack-1',
        rect: [197, 215, 61, 73]
    }, {
        name: 'attack-2',
        rect: [110, 215, 75, 73]
    }, {
        name: 'attack-3',
        rect: [14, 215, 75, 73]
    }, {
        name: 'death-1',
        rect: [197 + 63 * 0, 216, 63, 73]
    }, {
        name: 'death-2',
        rect: [197 + 63 * 1, 216, 63, 73]
    }, {
        name: 'death-3',
        rect: [197 + 63 * 2, 216, 63, 73]
    }, {
        name: 'death-4',
        rect: [197 + 63 * 3, 216, 63, 73]
    }, {
        name: 'death-5',
        rect: [197 + 63 * 4, 216, 63, 73]
    }, {
        name: 'death-6',
        rect: [197 + 63 * 5, 216, 63, 73]
    }],
    animations: [{
        name: 'idle',
        frameLen: 0.2,
        frames: ['idle-1', 'idle-2', 'idle-3', 'idle-4', 'idle-5', 'idle-6']
    }, {
        name: 'attack',
        frameLen: 0.1,
        frames: ['attack-1', 'attack-2', 'attack-3']
    }, {
        name: 'death',
        frameLen: 0.1,
        frames: ['death-1', 'death-2', 'death-3', 'death-4', 'death-5', 'death-6']
    }]
};
},{"../../../img/enemies/cactus.png":76}],77:[function(require,module,exports) {
module.exports="/dist/7bfdf12ae8085a901da695461086a7c6.png";
},{}],71:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    imageURL: require('../../../img/enemies/targets.png'),
    skinName: 'target',
    size: [50, 75],
    offset: [25, 18],

    frames: [{
        name: 'idle-1',
        rect: [91 * 0, 0, 91, 104]
    }, {
        name: 'idle-2',
        rect: [91 * 1, 0, 91, 104]
    }, {
        name: 'idle-3',
        rect: [91 * 2, 0, 91, 104]
    }, {
        name: 'idle-4',
        rect: [91 * 3, 0, 91, 104]
    }, {
        name: 'idle-5',
        rect: [91 * 4, 0, 91, 104]
    }, {
        name: 'idle-6',
        rect: [91 * 5, 0, 91, 104]
    }, {
        name: 'idle-7',
        rect: [91 * 5, 104 * 1, 91, 104]
    }, {
        name: 'idle-8',
        rect: [91 * 4, 104 * 1, 91, 104]
    }, {
        name: 'idle-9',
        rect: [91 * 3, 104 * 1, 91, 104]
    }, {
        name: 'idle-10',
        rect: [91 * 2, 104 * 1, 91, 104]
    }, {
        name: 'idle-11',
        rect: [91 * 1, 104 * 1, 91, 104]
    }, {
        name: 'idle-12',
        rect: [91 * 0, 104 * 1, 91, 104]
    }, {
        name: 'death-1',
        rect: [91 * 5, 104 * 3, 91, 104]
    }, {
        name: 'death-2',
        rect: [91 * 4, 104 * 3, 91, 104]
    }, {
        name: 'death-3',
        rect: [91 * 3, 104 * 3, 91, 104]
    }, {
        name: 'death-4',
        rect: [91 * 2, 104 * 3, 91, 104]
    }, {
        name: 'death-5',
        rect: [91 * 1, 104 * 3, 95, 104]
    }, {
        name: 'death-6',
        rect: [91 * 0, 104 * 3, 95, 104]
    }],
    animations: [{
        name: 'idle',
        frameLen: 0.2,
        frames: ['idle-1', 'idle-2', 'idle-3', 'idle-4', 'idle-5', 'idle-6', 'idle-7', 'idle-8', 'idle-9', 'idle-10', 'idle-11', 'idle-12']
    }, {
        name: 'attack',
        frameLen: 0.1,
        frames: ['death-1', 'death-2', 'death-3', 'death-4', 'death-5', 'death-6']
    }, {
        name: 'death',
        frameLen: 0.1,
        frames: ['death-1', 'death-2', 'death-3', 'death-4', 'death-5', 'death-6']
    }]
};
},{"../../../img/enemies/targets.png":77}],34:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadEnemy = undefined;

var _Entity = require('../Entity');

var _loaders = require('../loaders');

var _Traits = require('../Traits');

var _defineGameObject = require('../defineGameObject');

var _enemy_cactus = require('./enemy_skins/enemy_cactus');

var _enemy_cactus2 = _interopRequireDefault(_enemy_cactus);

var _enemy_target = require('./enemy_skins/enemy_target');

var _enemy_target2 = _interopRequireDefault(_enemy_target);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let BehaviorEnemy = class BehaviorEnemy extends _Entity.Trait {
    constructor() {
        super('behavior');

        this.attackDuration = 0.25;
        this.cancelAttackAfter = 2;
        this.inAttack = false;
        this.startAttackTime = 0;
        this.attackTime = 0;
    }

    update(entity, deltaTime, level) {
        if (entity.killable.dead) {
            entity.vel.x += 1000;
            return;
        }

        if (!this.inAttack || this.attackTime > this.attackDuration) {
            return;
        }

        this.attackTime = entity.lifetime - this.startAttackTime;
    }

    collides(us, them) {
        if (!them.killable || us.killable.dead || us.name === them.name) {
            return;
        }

        them.killable.kill();

        if (!this.inAttack) {
            this.inAttack = true;
            this.startAttackTime = us.lifetime;

            setTimeout(() => {
                this.inAttack = false;
                this.attackTime = 0;
                this.startAttackTime = 0;
            }, this.cancelAttackAfter * 1000);
        }
    }
};
const loadEnemy = exports.loadEnemy = (0, _defineGameObject.defineGameObject)('enemy', {
    spriteSpecs: [_enemy_cactus2.default, _enemy_target2.default],
    // drawBounds: true,

    afterCreate: entity => {
        entity.killable.removeAfter = 0.6;
    },

    traits: ({ ownerEntity }) => [new _Traits.Physics(), new _Traits.Solid(), new _Traits.Killable(), new _Traits.Stackable(), new BehaviorEnemy()],
    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');
        const attackAnim = sprite.animations.get('attack');
        const deathAnim = sprite.animations.get('death');

        return enemy => {
            if (enemy.behavior.inAttack) {
                return attackAnim(enemy.behavior.attackTime);
            }

            if (enemy.killable.dead) {
                return deathAnim(enemy.killable.deadTime);
            }

            return idleAnim(enemy.lifetime);
        };
    }
});
},{"../Entity":33,"../loaders":31,"../Traits":62,"../defineGameObject":63,"./enemy_skins/enemy_cactus":70,"./enemy_skins/enemy_target":71}],56:[function(require,module,exports) {
module.exports="/dist/6913ad4532454b2a199119399f6dd859.png";
},{}],57:[function(require,module,exports) {
module.exports="/dist/67b38d0d44db1fb69c34a29462fa434c.wav";
},{}],58:[function(require,module,exports) {
module.exports="/dist/fa3e2bf7164ae937e89a42b41e3cb7f5.wav";
},{}],59:[function(require,module,exports) {
module.exports="/dist/287d525952d9a4e02bf017596997fe6f.wav";
},{}],60:[function(require,module,exports) {
module.exports="/dist/6ac39807292516b2d20924612f17b579.wav";
},{}],35:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadUnicorn = undefined;

var _defineGameObject = require('../defineGameObject');

var _Entity = require('../Entity');

var _Traits = require('../Traits');

const UNICORN_SPRITE = {
    imageURL: require('../../img/unicorn.png'),
    skinName: 'default',
    size: [90, 100],
    offset: [45, 40],
    frames: [{
        name: 'idle',
        rect: [172 * 23, 0, 172, 142]
    }, {
        name: 'run-1',
        rect: [172 * 24, 0, 172, 142]
    }, {
        name: 'run-2',
        rect: [172 * 25, 0, 172, 142]
    }, {
        name: 'run-3',
        rect: [172 * 26, 0, 172, 142]
    }, {
        name: 'run-4',
        rect: [172 * 27, 0, 172, 142]
    }, {
        name: 'run-5',
        rect: [172 * 28, 0, 172, 142]
    }, {
        name: 'run-6',
        rect: [172 * 29, 0, 172, 142]
    }, {
        name: 'run-7',
        rect: [172 * 30, 0, 172, 142]
    }, {
        name: 'run-8',
        rect: [172 * 31, 0, 172, 142]
    }, {
        name: 'break',
        rect: [172 * 23, 0, 172, 142]
    }, {
        name: 'jump-1',
        rect: [172 * 19, 0, 172, 142]
    }, {
        name: 'jump-2',
        rect: [172 * 20, 0, 172, 142]
    }, {
        name: 'jump-3',
        rect: [172 * 21, 0, 172, 142]
    }, {
        name: 'jump-4',
        rect: [172 * 22, 0, 172, 142]
    }, {
        name: 'fall-1',
        rect: [172 * 25, 0, 172, 142]
    }, {
        name: 'fall-2',
        rect: [172 * 26, 0, 172, 142]
    }, {
        name: 'death-1',
        rect: [172 * 8, 0, 172, 142]
    }, {
        name: 'death-2',
        rect: [172 * 9, 0, 172, 142]
    }, {
        name: 'death-3',
        rect: [172 * 10, 0, 172, 142]
    }, {
        name: 'death-4',
        rect: [172 * 11, 0, 172, 142]
    }, {
        name: 'death-5',
        rect: [172 * 12, 0, 172, 142]
    }, {
        name: 'death-6',
        rect: [172 * 13, 0, 172, 142]
    }, {
        name: 'death-7',
        rect: [172 * 8, 0, 172, 142]
    }, {
        name: 'death-8',
        rect: [172 * 8, 0, 172, 142]
    }, {
        name: 'death-9',
        rect: [172 * 8, 0, 172, 142]
    }, {
        name: 'cast-1',
        rect: [172 * 0, 0, 172, 142]
    }, {
        name: 'cast-2',
        rect: [172 * 1, 0, 172, 142]
    }, {
        name: 'cast-3',
        rect: [172 * 2, 0, 172, 142]
    }, {
        name: 'cast-4',
        rect: [172 * 3, 0, 172, 142]
    }, {
        name: 'cast-5',
        rect: [172 * 4, 0, 172, 142]
    }, {
        name: 'cast-6',
        rect: [172 * 5, 0, 172, 142]
    }],

    animations: [{
        name: 'run',
        frameLen: 20,
        frames: ['run-1', 'run-2', 'run-3', 'run-4', 'run-5', 'run-6', 'run-7', 'run-8']
    }, {
        name: 'jump',
        frameLen: 0.2,
        frames: ['jump-1', 'jump-2', 'jump-3', 'jump-4']
    }, {
        name: 'fall',
        frameLen: 0.2,
        frames: ['fall-1', 'fall-2']
    }, {
        name: 'cast',
        frameLen: 0.1,
        frames: [
        // 'cast-1',
        // 'cast-2',
        // 'cast-3',
        'cast-4'
        // 'cast-5',
        // 'cast-6',
        ]
    }, {
        name: 'death',
        frameLen: 0.2,
        frames: ['death-1', 'death-2', 'death-3', 'death-4', 'death-5', 'death-6', 'death-7', 'death-8', 'death-9']
    }]
};

const UNICORN_SOUNDS = {
    sounds: [{
        url: require('../../sounds/clip-clop.wav'),
        name: 'clip-clop',
        loop: true
    }, {
        url: require('../../sounds/horse-die.wav'),
        name: 'die'
    }, {
        url: require('../../sounds/jump.wav'),
        name: 'jump'
    }, {
        url: require('../../sounds/land.wav'),
        name: 'land'
    }]
};

function animations(sprite) {
    const runAnim = sprite.animations.get('run');
    const jumpAnim = sprite.animations.get('jump');
    const fallAnim = sprite.animations.get('fall');
    const deathAnim = sprite.animations.get('death');
    const castAnim = sprite.animations.get('cast');

    return unicorn => {
        if (unicorn.killable.dead) {
            return deathAnim(unicorn.killable.deadTime);
        }

        if (unicorn.striker.isStriking()) {
            // return castAnim(unicorn.striker.strikeTime);
            return castAnim(unicorn.lifetime);
        }

        if (unicorn.jump.jumpingUp) {
            return jumpAnim(unicorn.jump.engageTime);
        }

        if (unicorn.run.lastSpeed < 1000) {
            return 'idle';
        }

        if (unicorn.jump.fallingDown) {
            return fallAnim(unicorn.jump.engageTime);
        }

        if (unicorn.run.distance > 0) {
            return runAnim(unicorn.run.distance);
        }

        return 'idle';
    };
}

function sounds(sounds) {
    const runSound = sounds.get('clip-clop');
    const dieSound = sounds.get('die');

    return unicorn => {
        if (unicorn.killable.dead) {
            dieSound.playing({ volume: 0.1 });
            return;
        }

        if (unicorn.jump.jumpingUp) {
            return;
        }

        if (unicorn.jump.fallingDown) {
            return;
        }

        if (unicorn.run.distance > 0) {
            runSound.playing({ rate: unicorn.run.realSpeed / 10000, volume: 0.02 });
            return;
        }
    };
}

const loadUnicorn = exports.loadUnicorn = (0, _defineGameObject.defineGameObject)('unicorn', {
    spriteSpecs: [UNICORN_SPRITE],
    soundSpecs: [UNICORN_SOUNDS],

    traits: ({ speed }) => [new _Traits.Physics(), new _Traits.Solid(), new _Traits.Run({ speed: speed || 15000 }), new _Traits.Jump(), new _Traits.Picker(), new _Traits.Killable({ removeAfter: 1 }), new _Traits.Striker(), new _Traits.Killer()],
    animations,
    sounds
});
},{"../defineGameObject":63,"../Entity":33,"../Traits":62,"../../img/unicorn.png":56,"../../sounds/clip-clop.wav":57,"../../sounds/horse-die.wav":58,"../../sounds/jump.wav":59,"../../sounds/land.wav":60}],54:[function(require,module,exports) {
module.exports="/dist/22f6db533a9af11e09f6f3561d96976d.png";
},{}],36:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadUfo = undefined;

var _defineGameObject = require('../defineGameObject');

var _Entity = require('../Entity');

var _Traits = require('../Traits');

const UFO_SPRITE = {
    size: [240, 350],
    offset: [0, 0],
    skinName: 'default',

    imageURL: require('../../img/ufo.png'),
    frames: [{
        name: 'idle',
        rect: [0, 0, 240, 350]
    }],
    animations: [{
        name: 'idle',
        frameLen: 0.1,
        frames: ['idle']
    }]
};

let BehaviorUfo = class BehaviorUfo extends _Entity.Trait {
    constructor(napEntity) {
        super('ufoBehavior');
        this.napEntity = napEntity;

        this.catched = false;
        this.catchTime = 0;

        this.spawned = false;
    }

    spawn() {
        this.entity.pos.x = this.napEntity.pos.x - 1500;
        this.spawned = true;
    }

    catch(deltaTime) {
        this.catched = true;
        this.catchTime = deltaTime;

        this.napEntity.removeTrait('solid');
        this.napEntity.removeTrait('physics');
    }

    canCatch() {
        const ufoCenter = this.entity.bounds.left + this.entity.bounds.width / 2;
        const napCenter = this.napEntity.bounds.left + this.napEntity.bounds.width / 2;
        const canCatch = ufoCenter - napCenter > 0;
        return canCatch;
    }

    abduct() {
        const ufoCenterX = this.entity.bounds.left + this.entity.bounds.width / 2;

        this.entity.vel.y -= 50;

        if (this.entity.vel.x > 100) {
            this.entity.vel.x -= 100;
        }

        this.napEntity.pos.x = ufoCenterX - this.napEntity.bounds.width / 2;
        this.napEntity.pos.y = this.entity.bounds.bottom - this.napEntity.bounds.height;
    }

    alignTarget() {
        this.entity.vel.x += 100;
        this.entity.bounds.bottom = this.napEntity.bounds.top + this.napEntity.bounds.height / 2;
    }

    update(entity, deltaTime, level) {
        if (!this.spawned && !level.frozen) {
            this.spawn();
        }

        if (!this.catched) {
            this.alignTarget();

            this.canCatch() && this.catch(deltaTime);
        }

        if (this.catched) {
            this.abduct();
        }
    }
};
const loadUfo = exports.loadUfo = (0, _defineGameObject.defineGameObject)('ufo', {
    spriteSpecs: [UFO_SPRITE],
    // drawBounds: true,

    traits: ({ napEntity }) => [new _Traits.Physics({ applyGravity: false }), new BehaviorUfo(napEntity)],
    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');

        return entity => {
            return idleAnim(entity.lifetime);
        };
    }
});
},{"../defineGameObject":63,"../Entity":33,"../Traits":62,"../../img/ufo.png":54}],74:[function(require,module,exports) {
module.exports="/dist/d45e0f965a71453d0f3b574045203e03.png";
},{}],68:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const MANA_BUBBLES_SPRITE = exports.MANA_BUBBLES_SPRITE = {
    skinName: 'default',
    size: [70, 70],
    offset: [15, 0],

    imageURL: require('../../img/pickables/mana_bubbles.png'),
    frames: [{
        name: 'idle-1',
        rect: [0, 300, 95, 60]
    }, {
        name: 'idle-2',
        rect: [95 * 1, 300, 95, 60]
    }, {
        name: 'idle-3',
        rect: [95 * 2, 300, 95, 60]
    }, {
        name: 'idle-4',
        rect: [95 * 3, 300, 95, 60]
    }, {
        name: 'idle-5',
        rect: [95 * 4, 300, 95, 60]
    }, {
        name: 'idle-6',
        rect: [0, 400, 95, 60]
    }, {
        name: 'idle-7',
        rect: [95 * 1, 400, 95, 60]
    }, {
        name: 'idle-8',
        rect: [95 * 2, 400, 95, 60]
    }, {
        name: 'idle-9',
        rect: [95 * 3, 400, 95, 60]
    }, {
        name: 'idle-10',
        rect: [95 * 4, 400, 95, 60]
    }, {
        name: 'idle-11',
        rect: [0, 500, 95, 60]
    }, {
        name: 'idle-12',
        rect: [95 * 1, 500, 95, 60]
    }, {
        name: 'idle-13',
        rect: [95 * 2, 500, 95, 60]
    }, {
        name: 'idle-14',
        rect: [95 * 3, 500, 95, 60]
    }, {
        name: 'idle-15',
        rect: [95 * 4, 500, 95, 60]
    }],
    animations: [{
        name: 'idle',
        frameLen: 0.1,
        frames: ['idle-1', 'idle-2', 'idle-3', 'idle-4', 'idle-5', 'idle-6', 'idle-7', 'idle-8', 'idle-9', 'idle-10', 'idle-11', 'idle-12', 'idle-13', 'idle-14', 'idle-15']
    }]
};
},{"../../img/pickables/mana_bubbles.png":74}],73:[function(require,module,exports) {
module.exports="/dist/0a1c25af6e83f370db42cefcc7ec131b.png";
},{}],69:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const MANA_PYLON_SPRITE = exports.MANA_PYLON_SPRITE = {
    size: [70, 70],
    offset: [15, 0],

    skinName: 'pylon',
    imageURL: require('../../img/pickables/mana_pylon.png'),
    frames: Array.from(new Array(10)).map((val, idx) => ({
        name: `idle-${idx + 1}`,
        rect: [45 * idx, 72, 45, 53]
    })),
    animations: [{
        name: 'idle',
        frameLen: 0.1,
        frames: ['idle-1'
        // 'idle-2',
        // 'idle-3',
        // 'idle-4',
        // 'idle-5',
        // 'idle-6',
        // 'idle-7',
        // 'idle-8',
        // 'idle-9',
        // 'idle-10',
        // 'idle-11',
        // 'idle-12',
        // 'idle-13',
        // 'idle-14',
        // 'idle-15',
        ]
    }]
};
},{"../../img/pickables/mana_pylon.png":73}],55:[function(require,module,exports) {
module.exports="/dist/801a84ee4cca035d02cacad35faef296.wav";
},{}],37:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadManaPot = undefined;

var _defineGameObject = require('../defineGameObject');

var _Entity = require('../Entity');

var _Traits = require('../Traits');

var _ManaPot = require('./ManaPot.bubbles');

var _ManaPot2 = require('./ManaPot.pylon');

const SOUNDS = {
    sounds: [{
        url: require('../../sounds/picked.wav'),
        name: 'picked'
    }]
};

let Behavior = class Behavior extends _Entity.Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.pickable.picked || !them.picker) {
            return;
        }
        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;
    }
};
const loadManaPot = exports.loadManaPot = (0, _defineGameObject.defineGameObject)('manaPot', {
    spriteSpecs: [_ManaPot.MANA_BUBBLES_SPRITE, _ManaPot2.MANA_PYLON_SPRITE],
    soundSpecs: [SOUNDS],

    // drawBounds: true,

    traits: ({ sounds }) => [new _Traits.Physics({ applyGravity: false }), new _Traits.Solid(), new _Traits.Pickable({ onPick: () => sounds.get('picked').playOnce() }), new Behavior()],

    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');

        return entity => {
            return idleAnim(entity.lifetime);
        };
    }
});
},{"../defineGameObject":63,"../Entity":33,"../Traits":62,"./ManaPot.bubbles":68,"./ManaPot.pylon":69,"../../sounds/picked.wav":55}],64:[function(require,module,exports) {
module.exports="/dist/66a8edf4aa2f6df810aece7398529cad.png";
},{}],38:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadPortal = undefined;

var _Entity = require('../Entity');

var _loaders = require('../loaders');

var _Traits = require('../Traits');

var _math = require('../math');

var _defineGameObject = require('../defineGameObject');

const PORTAL = {
    skinName: 'default',
    size: [36, 72],
    offset: [0, 0],

    imageURL: require('../../img/pickables/portal.png'),
    frames: [{
        name: 'portal-1',
        rect: [36 * 0, 0, 36, 72]
    }, {
        name: 'portal-2',
        rect: [36 * 1, 0, 36, 72]
    }, {
        name: 'portal-3',
        rect: [36 * 2, 0, 36, 72]
    }, {
        name: 'portal-4',
        rect: [36 * 3, 0, 36, 72]
    }, {
        name: 'portal-5',
        rect: [36 * 4, 0, 36, 72]
    }, {
        name: 'portal-6',
        rect: [36 * 5, 0, 36, 72]
    }],
    animations: [{
        name: 'portal',
        frameLen: 0.1,
        frames: ['portal-1', 'portal-2', 'portal-3', 'portal-4', 'portal-5', 'portal-6']
    }]
};

let BehaviorPortal = class BehaviorPortal extends _Entity.Trait {
    constructor({ destintaion }) {
        super('behavior');
        this.destintaion = destintaion;
    }

    collides(us, them) {
        if (us.pickable.picked || !them.picker) {
            return;
        }

        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;

        const dest = this.destintaion || new _math.Vec2(this.pos.x + _math.rand.int(100, 1000), -100);
        them.pos.set(dest.x, dest.y);
    }
};
const loadPortal = exports.loadPortal = (0, _defineGameObject.defineGameObject)('portal', {
    spriteSpecs: [PORTAL],

    traits: ({ destintaion }) => [new _Traits.Physics({ applyGravity: false }), new _Traits.Solid(), new _Traits.Pickable(), new BehaviorPortal({ destintaion })],
    animations: sprite => {
        const portalAnim = sprite.animations.get('portal');

        return portal => {
            return portalAnim(portal.lifetime);
        };
    }
});
},{"../Entity":33,"../loaders":31,"../Traits":62,"../math":32,"../defineGameObject":63,"../../img/pickables/portal.png":64}],65:[function(require,module,exports) {
module.exports="/dist/5fdd1bbce6cd0a583455dc64a6a69018.png";
},{}],39:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadRainbow = undefined;

var _Entity = require('../Entity');

var _Traits = require('../Traits');

var _loaders = require('../loaders');

var _defineGameObject = require('../defineGameObject');

const RAINBOW_SPRITE = {
    imageURL: require('../../img/pickables/rainbow.png'),
    size: [83, 93],
    offset: [0, 0],
    skinName: 'default',

    frames: [{
        name: 'spark-1',
        rect: [0, 0, 83, 93]
    }, {
        name: 'spark-2',
        rect: [83, 0, 83, 93]
    }, {
        name: 'spark-3',
        rect: [166, 0, 83, 93]
    }, {
        name: 'spark-4',
        rect: [249, 0, 83, 93]
    }, {
        name: 'spark-5',
        rect: [332, 0, 83, 93]
    }, {
        name: 'spark-6',
        rect: [415, 0, 83, 93]
    }],
    animations: [{
        name: 'spark',
        frameLen: 0.2,
        frames: ['spark-1', 'spark-2', 'spark-3', 'spark-4', 'spark-5', 'spark-6']
    }]
};

const RAINBOW_SOUNDS = {
    sounds: [{
        url: require('../../sounds/picked.wav'),
        name: 'picked'
    }]
};

let BehaviorRainbow = class BehaviorRainbow extends _Entity.Trait {
    constructor() {
        super('behavior');
    }

    collides(us, them) {
        if (us.pickable.picked || !them.picker) {
            return;
        }

        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;
    }
};
const loadRainbow = exports.loadRainbow = (0, _defineGameObject.defineGameObject)('rainbow', {
    spriteSpecs: [RAINBOW_SPRITE],
    soundSpecs: [RAINBOW_SOUNDS],

    traits: ({ sounds }) => [new _Traits.Physics({ applyGravity: false }), new _Traits.Solid(), new _Traits.Pickable({ onPick: () => sounds.get('picked').playOnce() }), new BehaviorRainbow()],

    animations: sprite => {
        const sparkAnim = sprite.animations.get('spark');

        return rainbow => {
            return sparkAnim(rainbow.lifetime);
        };
    }
});
},{"../Entity":33,"../Traits":62,"../loaders":31,"../defineGameObject":63,"../../img/pickables/rainbow.png":65,"../../sounds/picked.wav":55}],75:[function(require,module,exports) {
module.exports="/dist/7ae2d19cd5ba43e5dd2ea3624d0b9dc3.png";
},{}],40:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadSpeedBooster = undefined;

var _Entity = require('../Entity');

var _loaders = require('../loaders');

var _Traits = require('../Traits');

var _defineGameObject = require('../defineGameObject');

const SPEED_BOOSTER = {
    imageURL: require('../../img/pickables/horseshoe.png'),
    size: [45, 49],
    offset: [0, 0],
    skinName: 'default',

    frames: [{
        name: 'horseshoe-1',
        rect: [0, 0, 36, 49]
    }, {
        name: 'horseshoe-2',
        rect: [37, 0, 38, 49]
    }, {
        name: 'horseshoe-3',
        rect: [76, 0, 35, 49]
    }, {
        name: 'horseshoe-4',
        rect: [112, 0, 37, 49]
    }, {
        name: 'horseshoe-5',
        rect: [150, 0, 42, 49]
    }, {
        name: 'horseshoe-6',
        rect: [193, 0, 43, 49]
    }, {
        name: 'horseshoe-7',
        rect: [237, 0, 44, 49]
    }, {
        name: 'horseshoe-8',
        rect: [282, 0, 45, 49]
    }, {
        name: 'horseshoe-9',
        rect: [328, 0, 35, 49]
    }, {
        name: 'horseshoe-10',
        rect: [368, 0, 40, 49]
    }, {
        name: 'horseshoe-11',
        rect: [409, 0, 41, 49]
    }, {
        name: 'horseshoe-12',
        rect: [451, 0, 45, 49]
    }],
    animations: [{
        name: 'horseshoe',
        frameLen: 0.1,
        frames: ['horseshoe-1', 'horseshoe-2', 'horseshoe-3', 'horseshoe-4', 'horseshoe-5', 'horseshoe-6', 'horseshoe-7', 'horseshoe-8', 'horseshoe-9', 'horseshoe-10', 'horseshoe-11', 'horseshoe-12']
    }]
};

let BehaviorSpeedBooster = class BehaviorSpeedBooster extends _Entity.Trait {
    constructor() {
        super('behavior');

        this.boost = 5000;
        this.boostTime = 10000;
    }

    restoreSpeed(them) {
        if (them.jump.jumpingUp || them.jump.fallingDown) {
            them.run.queue(() => this.restoreSpeed(them));
        } else {
            them.run.speed -= this.boost;
        }
    }

    collides(us, them) {
        if (us.pickable.picked || !them.picker) {
            return;
        }
        us.pickable.pick();
        us.vel.set(30, -400);
        us.solid.obstructs = false;

        them.run.speed += this.boost;

        setTimeout(() => this.restoreSpeed.call(this, them), this.boostTime);
    }
};


const SPEED_SOUNDS = {
    sounds: [{
        url: require('../../sounds/picked.wav'),
        name: 'picked'
    }]
};

const loadSpeedBooster = exports.loadSpeedBooster = (0, _defineGameObject.defineGameObject)('speedBooster', {
    spriteSpecs: [SPEED_BOOSTER],
    soundSpecs: [SPEED_SOUNDS],

    traits: ({ sounds }) => [new _Traits.Physics({ applyGravity: false }), new _Traits.Solid(), new _Traits.Pickable({ onPick: () => sounds.get('picked').playOnce() }), new BehaviorSpeedBooster()],

    animations: sprite => {
        const boosterAnim = sprite.animations.get('horseshoe');

        return speedbooster => {
            return boosterAnim(speedbooster.lifetime);
        };
    }
});
},{"../Entity":33,"../loaders":31,"../Traits":62,"../defineGameObject":63,"../../img/pickables/horseshoe.png":75,"../../sounds/picked.wav":55}],66:[function(require,module,exports) {
module.exports="/dist/978220e47212c38eae031668a1735c22.png";
},{}],61:[function(require,module,exports) {
module.exports="/dist/e7be428c06141bfb6383238051f9ddd8.wav";
},{}],41:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadBullet = undefined;

var _defineGameObject = require('../defineGameObject');

var _Entity = require('../Entity');

var _Traits = require('../Traits');

const FIREBALL_SPRITE = {
    skinName: 'default',
    imageURL: require('../../img/weapon/fireball.png'),
    size: [55, 25],
    offset: [0, 35],

    frames: [{
        name: 'idle-1',
        rect: [0, 1182, 97, 97]
    }, {
        name: 'idle-2',
        rect: [97 * 1 + 1, 1182, 97, 97]
    }, {
        name: 'idle-3',
        rect: [97 * 2 + 1, 1182, 97, 97]
    }, {
        name: 'idle-4',
        rect: [97 * 3 + 1, 1182, 97, 97]
    }, {
        name: 'idle-5',
        rect: [97 * 4 + 1, 1182, 97, 97]
    }, {
        name: 'idle-6',
        rect: [97 * 5 + 1, 1182, 97, 97]
    }, {
        name: 'idle-7',
        rect: [97 * 6 + 1, 1182, 97, 97]
    }],
    animations: [{
        name: 'idle',
        frameLen: 0.1,
        frames: [
        // 'idle-1',
        // 'idle-2',
        // 'idle-3',
        'idle-4', 'idle-5', 'idle-6', 'idle-7']
    }]
};

const FIREBALL_SOUNDS = {
    sounds: [{
        url: require('../../sounds/fireball-cast.wav'),
        name: 'cast'
    }]
};

let BehaviorBullet = class BehaviorBullet extends _Entity.Trait {
    constructor(ownerEntity, sounds) {
        super('bulletBehavior');

        this.ownerEntity = ownerEntity;
        this.sounds = sounds;
        this.destroyed = false;
    }

    destroy() {
        this.queue(() => {
            this.destroyed = true;
        });
    }

    update(entity, deltaTime, level) {
        if (this.destroyed) {
            this.queue(() => {
                level.entities.delete(entity);
            });
        }
    }

    obstruct() {
        this.destroy();
    }

    collides(us, them) {
        if (!them.killable || them.killable.dead || them === this.ownerEntity) {
            return;
        }

        this.ownerEntity.killer && this.ownerEntity.killer.kill(them);
        them.killable.kill();
    }

    striked() {
        this.sounds.get('cast').playOnce({ volume: 0.1, rate: 3 });
    }
};
const loadBullet = exports.loadBullet = (0, _defineGameObject.defineGameObject)('bullet', {
    spriteSpecs: [FIREBALL_SPRITE],
    soundSpecs: [FIREBALL_SOUNDS],

    // drawBounds: true,

    traits: ({ ownerEntity, sounds }) => [new _Traits.Physics({ applyGravity: false }), new _Traits.Solid(), new BehaviorBullet(ownerEntity, sounds)],
    animations: sprite => {
        const idleAnim = sprite.animations.get('idle');

        return portal => {
            return idleAnim(portal.lifetime);
        };
    }
});
},{"../defineGameObject":63,"../Entity":33,"../Traits":62,"../../img/weapon/fireball.png":66,"../../sounds/fireball-cast.wav":61}],67:[function(require,module,exports) {
module.exports="/dist/e95cf42e300fc82b8144de80e5aeda67.png";
},{}],42:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadDoor = undefined;

var _Entity = require('../Entity');

var _loaders = require('../loaders');

var _Traits = require('../Traits');

var _math = require('../math');

var _defineGameObject = require('../defineGameObject');

const DOOR = {
    size: [120, 165],
    offset: [0, 0],

    skinName: 'default',

    imageURL: require('../../img/other/doors.png'),
    frames: [{
        name: 'idle',
        rect: [407, 41, 120, 165]
    }, {
        name: 'open-1',
        rect: [407, 287, 120, 165]
    }, {
        name: 'open-2',
        rect: [407, 535, 120, 165]
    }, {
        name: 'open-3',
        rect: [407, 700, 120, 165]
    }],
    animations: [{
        name: 'open',
        frameLen: 0.1,
        frames: ['open-1', 'open-2', 'open-3']
    }]
};

let BehaviorDoor = class BehaviorDoor extends _Entity.Trait {
    constructor() {
        super('behavior');

        this.opened = false;
        this.openedTime = 0;
        this.openDuration = 0.3;
    }

    open() {
        this.queue(() => {
            this.opened = true;
            this.entity.impassable.deactivate();
        });
    }

    close() {
        this.queue(() => {
            this.opened = false;
            this.entity.impassable.activate();
        });
    }

    update(entity, deltaTime, level) {
        if (this.opened && this.openedTime < this.openDuration) {
            this.openedTime += deltaTime;
        }
    }

    collides(us, them, side) {
        if (!this.opened) {
            them.obstruct(them, side);
        }
    }
};
const loadDoor = exports.loadDoor = (0, _defineGameObject.defineGameObject)('door', {
    spriteSpecs: [DOOR],

    traits: () => [new _Traits.Impassable(), new BehaviorDoor()],
    animations: sprite => {
        const openAnim = sprite.animations.get('open');

        return door => {
            if (door.behavior.opened) {
                return openAnim(door.behavior.openedTime);
            }

            return 'idle';
        };
    }
});
},{"../Entity":33,"../loaders":31,"../Traits":62,"../math":32,"../defineGameObject":63,"../../img/other/doors.png":67}],15:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadEntities = loadEntities;

var _Enemy = require('./chars/Enemy');

var _Unicorn = require('./chars/Unicorn');

var _Ufo = require('./other/Ufo');

var _ManaPot = require('./pickables/ManaPot');

var _Portal = require('./pickables/Portal');

var _Rainbow = require('./pickables/Rainbow');

var _SpeedBooster = require('./pickables/SpeedBooster');

var _Bullet = require('./weapon/Bullet');

var _Door = require('./other/Door');

function loadEntities() {
    const entityFactories = {};

    function addFactory(name) {
        return factory => entityFactories[name] = factory;
    }

    return Promise.all([(0, _Unicorn.loadUnicorn)().then(addFactory('unicorn')), (0, _Enemy.loadEnemy)().then(addFactory('enemy')), (0, _Rainbow.loadRainbow)().then(addFactory('rainbow')), (0, _SpeedBooster.loadSpeedBooster)().then(addFactory('speedBooster')), (0, _Portal.loadPortal)().then(addFactory('portal')), (0, _Bullet.loadBullet)().then(addFactory('bullet')), (0, _ManaPot.loadManaPot)().then(addFactory('manaPot')), (0, _Ufo.loadUfo)().then(addFactory('ufo')), (0, _Door.loadDoor)().then(addFactory('door'))]).then(() => entityFactories);
}
},{"./chars/Enemy":34,"./chars/Unicorn":35,"./other/Ufo":36,"./pickables/ManaPot":37,"./pickables/Portal":38,"./pickables/Rainbow":39,"./pickables/SpeedBooster":40,"./weapon/Bullet":41,"./other/Door":42}],25:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Picker = undefined;

var _math = require('../math');

let Picker = exports.Picker = class Picker {
    constructor(editor) {
        this.editor = editor;
    }

    get tileResolver() {
        return this.editor.tileResolver;
    }

    get level() {
        return this.editor.level;
    }

    disableTraits(level) {
        for (const entity of this.level.entities) {
            entity.physics && entity.removeTrait('physics');
            entity.solid && entity.removeTrait('solid');
            entity.run && entity.removeTrait('run');
        }
    }

    pickEntity(pos) {
        if (!this.level) {
            return;
        }
        for (const entity of this.level.entities) {
            if (entity.bounds.contains(pos)) {
                return entity;
            }
        }
    }

    pickTile(pos) {
        if (!this.tileResolver) {
            return;
        }
        const tileIndexes = this.pickTileIndex(pos);
        const tile = this.tileResolver.getByIndex(tileIndexes.x, tileIndexes.y);
        return tile;
    }

    pickTilePos(pos) {
        if (!this.tileResolver) {
            return;
        }
        const tileIndexes = this.pickTileIndex(pos);
        const tilePos = this.tileResolver.getTilePos(tileIndexes.x, tileIndexes.y);
        return tilePos;
    }

    pickTileIndex(pos) {
        if (!this.tileResolver) {
            return;
        }
        const indexX = this.tileResolver.toIndex(pos.x);
        const indexY = this.tileResolver.toIndex(pos.y);

        return new _math.Vec2(indexX, indexY);
    }
};
},{"../math":32}],26:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Selection = undefined;

var _dec, _class;

var _util = require('../util');

let Selection = exports.Selection = (_dec = _util.EventEmitter.decorator, _dec(_class = class Selection {
    constructor(editor) {
        this.editor = editor;

        this.selectedTile = undefined;
        this.selectedEntity = undefined;
    }

    get empty() {
        return !this.selectedTile && !this.selectedEntity;
    }

    selectTile(tile) {
        this.selectedTile = tile;
        this.selectedEntity = undefined;
        this.emit('change');
    }

    selectEntity(entity) {
        if (this.selectedEntity === entity) {
            return;
        }

        this.selectedEntity = entity;
        this.selectedTile = undefined;

        this.emit('change');
    }

    getSpec() {
        if (this.empty) {
            return;
        }

        if (this.selectedEntity) {
            const entities = this.editor.levelSpec.entities;
            const spec = entities[this.selectedEntity.idx];

            return spec;
        }

        if (this.selectedTile) {
            const spec = { skinName: this.selectedTile.skinName };
            return spec;
        }
    }

    clear() {
        this.selectedEntity = undefined;
        this.selectedTile = undefined;

        this.emit('change');
    }
}) || _class);
},{"../util":29}],17:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Game = undefined;

var _Camera = require('./camera/Camera');

var _CameraController = require('./camera/CameraController');

var _CameraFocus = require('./camera/CameraFocus');

var _CameraShake = require('./camera/CameraShake');

var _LevelManager = require('./LevelManager');

var _loadEntities = require('./loadEntities');

var _loadLevel = require('./loadLevel');

var _createPlayerEnv = require('./player/createPlayerEnv');

var _Timer = require('./Timer');

var _Splash = require('./Splash');

let Game = exports.Game = class Game {
    constructor(canvasSelector) {
        this.canvasSelector = canvasSelector;
        this.context = canvasSelector.getContext('2d');

        this.camera = new _Camera.Camera();
        this.timer = new _Timer.Timer();
        this.levelManager = new _LevelManager.LevelManager(this);
        this.cameraController = new _CameraController.CameraController(this.camera, [_CameraShake.CameraShake, _CameraFocus.CameraFocus]);
        this.playerEnv = (0, _createPlayerEnv.createPlayerEnv)(this);

        this.paused = false;

        this.levelManager.on(_LevelManager.LevelEvents.FINISHED, this.onLevelFinished.bind(this));
        this.levelManager.on(_LevelManager.LevelEvents.FAILED, this.onLevelFailed.bind(this));

        this.loadResources();
    }

    async loadResources() {
        this.entityFactory = await (0, _loadEntities.loadEntities)();
        this.loadLevel = await (0, _loadLevel.createLevelLoader)(this.entityFactory);

        this.timer.start();
        this.onLoad();
    }

    async onLoad() {
        this.levelManager.runLevel();
    }

    onLevelFinished({ isLastLevel }) {
        if (isLastLevel) {
            this.onGameOver();
        } else {
            this.levelManager.nextLevel();
        }
    }

    onLevelFailed() {
        this.levelManager.restartLevel();
    }

    async onGameOver() {
        this.pause();

        const pc = this.playerEnv.playerController;

        await (0, _Splash.splash)('you win! <br> congratulations!', { size: 50, background: 'rgba(0,0,0,0.5)' });

        const html = `
            score: ${pc.totalScore} <br> 
            Deaths: ${pc.deaths}
        `;
        (0, _Splash.splash)(html, { size: 50, background: 'rgba(0,0,0,0.5)', timeout: 100000 });
    }

    pause() {
        this.levelManager.level.frozen = true;
        this.paused = true;
    }

    resume() {
        this.levelManager.level.frozen = false;
        this.paused = false;
    }
};
},{"./camera/Camera":18,"./camera/CameraController":19,"./camera/CameraFocus":20,"./camera/CameraShake":21,"./LevelManager":11,"./loadEntities":15,"./loadLevel":12,"./player/createPlayerEnv":22,"./Timer":14,"./Splash":28}],5:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Editor = undefined;

var _Camera = require('../camera/Camera');

var _CameraController = require('../camera/CameraController');

var _CameraFocus = require('../camera/CameraFocus');

var _CameraShake = require('../camera/CameraShake');

var _LevelManager = require('../LevelManager');

var _loadLevel = require('../loadLevel');

var _createPlayerEnv = require('../player/createPlayerEnv');

var _TileCreation = require('../TileCreation');

var _Timer = require('../Timer');

var _Interaction = require('./Interaction');

var _loadEntities = require('../loadEntities');

var _Mouse = require('./Mouse');

var _Picker = require('./Picker');

var _Selection = require('./Selection');

var _layers = require('../layers');

var _Game = require('../Game');

let Editor = exports.Editor = class Editor extends _Game.Game {
    constructor(canvasSelector) {
        super(canvasSelector);

        this.mouse = new _Mouse.Mouse(this);
        this.interaction = new _Interaction.Interaction(this);
        this.picker = new _Picker.Picker(this);
        this.selection = new _Selection.Selection(this);

        let lastLevel = parseInt(localStorage.getItem('levelIdx'));
        lastLevel = lastLevel > this.levelManager.levels.length - 1 ? lastLevel - 1 : lastLevel;

        const storedLevelIdx = lastLevel;
        this.levelIdx = storedLevelIdx && storedLevelIdx > 0 ? storedLevelIdx : 1;

        this.tileResolver = undefined;
        this.levelManager.showSplash = false;

        this.paused = true;

        window.editor = this;
    }

    get level() {
        return this.levelManager.level;
    }

    get levelSpec() {
        const { spec } = this.levelManager.levels[this.levelIdx];
        return spec;
    }

    addDebugLayer(level) {
        const debugLayer = (0, _layers.createDebugLayer)(this);
        level.comp.addLayer(debugLayer);
    }

    async startEditing(levelIdx) {
        this.levelIdx = levelIdx;
        const level = await this.levelManager.runLevel(this.levelIdx);
        this.tileResolver = new _TileCreation.TileResolver(level.tileGrid);

        const origUpdate = this.timer.update;

        this.timer.update = (...args) => {
            origUpdate(...args);
            this.onUpdate && this.onUpdate();
        };

        this.addDebugLayer(level);

        this.paused && this.pause();
    }

    restart() {
        this.playerEnv.playerController.resetMana();
        return this.startEditing(this.levelIdx);
    }

    onLoad() {
        return this.startEditing(this.levelIdx);
    }

    onLevelFinished() {
        this.restart();
    }

    onLevelFailed() {
        this.restart();
    }
};
},{"../camera/Camera":18,"../camera/CameraController":19,"../camera/CameraFocus":20,"../camera/CameraShake":21,"../LevelManager":11,"../loadLevel":12,"../player/createPlayerEnv":22,"../TileCreation":13,"../Timer":14,"./Interaction":23,"../loadEntities":15,"./Mouse":24,"./Picker":25,"./Selection":26,"../layers":16,"../Game":17}],90:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/**
 * JSX/hyperscript reviver.
 * @see http://jasonformat.com/wtf-is-jsx
 * Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *
 * Note: this is exported as both `h()` and `createElement()` for compatibility reasons.
 *
 * Creates a VNode (virtual DOM element). A tree of VNodes can be used as a lightweight representation
 * of the structure of a DOM tree. This structure can be realized by recursively comparing it against
 * the current _actual_ DOM structure, and applying only the differences.
 *
 * `h()`/`createElement()` accepts an element name, a list of attributes/props,
 * and optionally children to append to the element.
 *
 * @example The following DOM tree
 *
 * `<div id="foo" name="bar">Hello!</div>`
 *
 * can be constructed using this function as:
 *
 * `h('div', { id: 'foo', name : 'bar' }, 'Hello!');`
 *
 * @param {string} nodeName	An element name. Ex: `div`, `a`, `span`, etc.
 * @param {Object} attributes	Any attributes/props to set on the created element.
 * @param rest			Additional arguments are taken to be children to append. Can be infinitely nested Arrays.
 *
 * @public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

/**
 *  Copy all properties from `props` onto `obj`.
 *  @param {Object} obj		Object onto which properties should be copied.
 *  @param {Object} props	Object from which to copy properties.
 *  @returns obj
 *  @private
 */
function extend(obj, props) {
	for (var i in props) {
		obj[i] = props[i];
	}return obj;
}

/**
 * Call a function asynchronously, as soon as possible. Makes
 * use of HTML Promise to schedule the callback if available,
 * otherwise falling back to `setTimeout` (mainly for IE<11).
 *
 * @param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

/**
 * Clones the given VNode, optionally adding attributes/props and replacing its children.
 * @param {VNode} vnode		The virutal DOM element to clone
 * @param {Object} props	Attributes/props to add when cloning
 * @param {VNode} rest		Any additional arguments will be used as replacement children.
 */
function cloneElement(vnode, props) {
	return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

// DOM properties that should NOT have "px" added when numeric
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/**
 * Check if two nodes are equivalent.
 *
 * @param {Node} node			DOM Node to compare
 * @param {VNode} vnode			Virtual DOM node to compare
 * @param {boolean} [hyrdating=false]	If true, ignores component constructors when comparing.
 * @private
 */
function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

/**
 * Check if an Element has a given nodeName, case-insensitively.
 *
 * @param {Element} node	A DOM Element to inspect the name of.
 * @param {String} nodeName	Unnormalized name to compare against.
 */
function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 *
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) old(null);
		if (value) value(node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) flushMounts();
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if (component.__ref = props.ref) delete props.ref;
	if (component.__key = props.key) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) flushMounts();
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) component.__ref(null);
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) this.prevState = extend({}, s);
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		enqueueRender(this);
	},

	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		renderComponent(this, 2);
	},

	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
	return diff(merge, vnode, {}, false, parent, false);
}

var preact = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};

exports.h = h;
exports.createElement = h;
exports.cloneElement = cloneElement;
exports.Component = Component;
exports.render = render;
exports.rerender = rerender;
exports.options = options;
exports.default = preact;
//# sourceMappingURL=preact.esm.js.map
},{}],6:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.renderSidebar = renderSidebar;

var _preact = require('preact');

var _Interaction = require('./Interaction');

function renderSidebar(selector, editor) {
    (0, _preact.render)((0, _preact.h)(Sidebar, { editor: editor }), selector);
}

let Sidebar = class Sidebar extends _preact.Component {
    componentDidMount() {
        const { editor } = this.props;

        editor.interaction.on('change', () => this.forceUpdate());
        editor.selection.on('change', () => this.forceUpdate());
    }

    render() {
        const { editor } = this.props;
        const mode = editor.interaction.mode;

        return (0, _preact.h)(
            'div',
            null,
            (0, _preact.h)(Controls, null),
            (0, _preact.h)(LevelSelector, this.props),
            (0, _preact.h)(Mode, this.props),
            mode === _Interaction.InteractionMode.SELECT && (0, _preact.h)(SelectionMode, this.props),
            mode === _Interaction.InteractionMode.TILE && (0, _preact.h)(TileMode, this.props),
            mode === _Interaction.InteractionMode.ENTITY && (0, _preact.h)(EntityMode, this.props),
            (0, _preact.h)(Save, this.props)
        );
    }
};


function LevelSelector({ editor }) {
    const levels = editor.levelManager.levels;
    const level = levels[editor.levelIdx];

    const onSelect = e => {
        const levelIdx = parseInt(e.target.dataset.idx);
        editor.startEditing(levelIdx);
        editor.pause();
        this.forceUpdate();
    };

    return (0, _preact.h)(
        'div',
        null,
        (0, _preact.h)(
            'div',
            null,
            level.spec.name
        ),
        (0, _preact.h)(
            'div',
            { style: { display: 'flex' } },
            levels.map((l, idx) => {
                if (idx === 0) {
                    return;
                }
                const style = {
                    cursor: 'default',
                    padding: '5px 10px',
                    color: editor.levelIdx === idx ? 'black' : 'white',
                    backgroundColor: editor.levelIdx === idx ? 'white' : 'black'
                };
                return (0, _preact.h)(
                    'div',
                    { 'data-idx': idx, onClick: onSelect, style: style },
                    idx
                );
            })
        )
    );
}

let Save = class Save extends _preact.Component {
    async save() {
        this.success = await this.props.editor.interaction.saveToFile();
        this.forceUpdate();

        setTimeout(() => {
            this.success = undefined;
            this.forceUpdate();
        }, 1000);
    }

    render() {
        const btnStyle = {
            cursor: 'pointer',
            marginRight: 10,
            fontSize: 50
        };

        return (0, _preact.h)(
            'div',
            { style: { marginTop: 50, textAlign: 'center' } },
            (0, _preact.h)(
                'div',
                { style: btnStyle, onClick: this.save.bind(this) },
                'SAVE'
            ),
            (0, _preact.h)(
                'div',
                null,
                this.success !== undefined && (this.success ? 'ok' : 'fail')
            )
        );
    }
};


function Controls() {
    return (0, _preact.h)(
        'div',
        { style: { display: 'flex', justifyContent: 'space-between' } },
        (0, _preact.h)(
            'div',
            null,
            'Controls:'
        ),
        (0, _preact.h)(
            'div',
            null,
            (0, _preact.h)(
                'div',
                null,
                'T - pause/resume'
            ),
            (0, _preact.h)(
                'div',
                null,
                'R - restart'
            ),
            (0, _preact.h)(
                'div',
                null,
                'C-s - save'
            ),
            (0, _preact.h)(
                'div',
                { style: { 'margin-top': '5px' } },
                'Q - select mode'
            ),
            (0, _preact.h)(
                'div',
                null,
                'W - tile mode'
            ),
            (0, _preact.h)(
                'div',
                null,
                'E - entity mode'
            )
        )
    );
}

function Mode({ editor: { interaction } }) {
    const modeStyle = selected => ({
        padding: '0px 5px',
        backgroundColor: selected ? 'white' : 'transparent',
        color: selected ? 'black' : 'white',
        cursor: 'default'
    });

    const onClick = mode => () => {
        interaction.setMode(mode);
    };

    const modeLabels = {
        [_Interaction.InteractionMode.SELECT]: 'SELECT',
        [_Interaction.InteractionMode.TILE]: 'TILE',
        [_Interaction.InteractionMode.ENTITY]: 'ENTITY'
    };

    function ModeItem({ mode }) {
        const label = modeLabels[mode];
        return (0, _preact.h)(
            'div',
            { onClick: onClick(mode), style: modeStyle(interaction.mode === mode) },
            label
        );
    }

    return (0, _preact.h)(
        'div',
        {
            style: {
                display: 'flex',
                'margin-top': '15px',
                'justify-content': 'space-between'
            }
        },
        (0, _preact.h)(
            'div',
            null,
            'mode: '
        ),
        (0, _preact.h)(
            'div',
            { style: { display: 'flex' } },
            (0, _preact.h)(ModeItem, { mode: _Interaction.InteractionMode.SELECT }),
            (0, _preact.h)(ModeItem, { mode: _Interaction.InteractionMode.TILE }),
            (0, _preact.h)(ModeItem, { mode: _Interaction.InteractionMode.ENTITY })
        )
    );
}

function SelectionMode({ editor: { selection, interaction } }) {
    if (selection.empty) {
        return;
    }

    const tile = selection.selectedTile;
    const entity = selection.selectedEntity;
    const spec = selection.getSpec();

    const type = tile ? 'tile' : 'entity';
    const pos = tile ? `[${tile.indexX}, ${tile.indexY}], [${tile.x1}, ${tile.y1}]` : `[${entity.pos.x}, ${entity.pos.y}]`;

    return (0, _preact.h)(
        'div',
        {
            style: { display: 'flex', 'margin-top': '15px', 'flex-direction': 'column' }
        },
        (0, _preact.h)(
            'div',
            { style: { display: 'flex' } },
            (0, _preact.h)(
                'div',
                { style: { marginRight: '10px' } },
                'Selection:'
            ),
            (0, _preact.h)(
                'span',
                null,
                type,
                ' ',
                pos
            )
        ),
        (0, _preact.h)(
            'div',
            { style: { display: 'flex', marginTop: 10 } },
            (0, _preact.h)(Spec, { spec: _extends({}, spec) })
        )
    );
}

function Spec({ spec }) {
    const keys = Object.keys(spec);

    const rows = keys.map(key => {
        const value = spec[key];
        return [(0, _preact.h)(
            'div',
            null,
            key,
            ': '
        ), (0, _preact.h)(
            'div',
            null,
            value
        )];
    });

    const table = (0, _preact.h)(
        'div',
        { style: { display: 'grid', 'grid-template-columns': 'repeat(2, 1fr)' } },
        rows
    );

    return (0, _preact.h)(
        'div',
        null,
        table
    );
}

function TileMode({ editor }) {
    const interaction = editor.interaction;
    const tileSkinNames = editor.levelSpec.tileSprite.frames.map(f => f.name);

    function onSelect(e) {
        const value = e.target.value;
        interaction.setCreateTileSkin(value);
    }

    if (!interaction.createTileSkin) {
        interaction.setCreateTileSkin(tileSkinNames[0]);
    }

    return (0, _preact.h)(
        'div',
        { style: { display: 'flex', marginTop: '15px', 'flex-direction': 'column' } },
        (0, _preact.h)(
            'select',
            { onChange: onSelect, style: { 'min-height': '150px' }, size: '3' },
            tileSkinNames.map((name, idx) => (0, _preact.h)(
                'option',
                {
                    selected: name === interaction.setCreateTileSkin,
                    value: name
                },
                name
            ))
        )
    );
}

function EntityMode({ editor: { entityFactory, interaction } }) {
    const nameSkinCombs = Object.keys(entityFactory).reduce((acc, name) => {
        const skins = entityFactory[name].availableSkins;
        skins.forEach(skin => acc.push({ name, skin }));
        return acc;
    }, []);

    function onSelect(e) {
        const idx = e.target.value;
        const { skin, name } = nameSkinCombs[idx];

        interaction.setCreateEntityName(name);
        interaction.setCreateEntitySkinName(skin);
    }

    function isSelected(name, skin) {
        return interaction.createEntityName === name && interaction.createEntitySkinName === skin;
    }

    if (!interaction.createEntityName) {
        const { skin, name } = nameSkinCombs[0];

        interaction.setCreateEntityName(name);
        interaction.setCreateEntitySkinName(skin);
    }

    return (0, _preact.h)(
        'div',
        { style: { display: 'flex', marginTop: '15px', 'flex-direction': 'column' } },
        (0, _preact.h)(
            'select',
            { onChange: onSelect, style: { 'min-height': '150px' }, size: '3' },
            nameSkinCombs.map(({ name, skin }, idx) => (0, _preact.h)(
                'option',
                { selected: isSelected(name, skin), value: idx },
                name,
                ' ',
                skin !== 'default' && `[${skin}]`
            ))
        )
    );
}
},{"preact":90,"./Interaction":23}],3:[function(require,module,exports) {
'use strict';

var _Editor = require('./Editor');

var _Sidebar = require('./Sidebar');

const canvas = document.getElementById('screen');
const editor = new _Editor.Editor(canvas);

const sidebarSelector = document.querySelector('.sidebar');
(0, _Sidebar.renderSidebar)(sidebarSelector, editor);
},{"./Editor":5,"./Sidebar":6}]},{},[3])
//# sourceMappingURL=/dist/7d29b43bfd8bc451bcdd2a4de52c0734.map