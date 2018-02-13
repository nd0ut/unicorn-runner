import { splashText } from "../Splash";
import { Striker } from "../Traits";
import { defineLevel } from "./defineLevel";
import { clamp } from "../math";

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
      return [
        ["#256bcc", 0],
        ["#2278c6", clamp(0.4 - camPos.y * 0.0001, 0, 0.8)],
        ["#00c7a4", 0.8]
      ];
    }
  },
  sounds: [
    {
      url: require("../../sounds/hooked-on-a-feeling.mp3"),
      name: "music"
    }
  ],
  tileSprite: {
    imageURL: require("../../img/tiles/y5lxj.png"),
    tileW: 60,
    tileH: 60,
    frames: [
      {
        name: "grass",
        rect: [60 * 0, 0, 60, 60]
      },
      {
        name: "stone",
        rect: [60 * 1, 0, 60, 60]
      },
      {
        name: "dirt",
        rect: [60 * 2, 0, 60, 60]
      },
      {
        name: "default",
        rect: [60 * 3, 0, 60, 60]
      },

      {
        name: "stone2",
        rect: [60 * 0, 60, 60, 60]
      },
      {
        name: "wood",
        rect: [60 * 1, 60, 60, 60]
      },
      {
        name: "sand",
        rect: [60 * 2, 60, 60, 60]
      }
    ]
  },
  tiles: [
    ["default", 1, 7],
    ["default", 2, 7],
    ["default", 3, 7],
    ["default", 4, 7],
    ["default", 5, 7],
    ["default", 6, 7],
    ["default", 7, 7],
    ["default", 8, 7],
    ["default", 9, 7],
    ["default", 10, 7],
    ["default", 11, 7],
    ["default", 12, 7],
    ["default", 13, 7],
    ["default", 14, 7],
    ["default", 15, 7],
    ["default", 16, 7],
    ["default", 17, 7],
    ["default", 18, 7],
    ["default", 19, 7],
    ["default", 20, 7],
    ["default", 21, 7],
    ["default", 22, 7],
    ["default", 23, 7],
    ["default", 24, 7],
    ["default", 25, 7],
    ["default", 26, 7],
    ["default", 42, 7],
    ["default", 43, 7],
    ["default", 44, 7],
    ["default", 45, 7],
    ["default", 46, 7],
    ["default", 47, 7],
    ["default", 48, 7],
    ["default", 49, 7],
    ["default", 50, 7],
    ["default", 79, 3],
    ["default", 79, 4],
    ["default", 80, 3],
    ["default", 80, 4]
  ],
  entities: [
    { name: "manaPot", pos: [485.6330162237009, 348], skinName: "default" },
    { name: "manaPot", pos: [605.6383789811518, 348], skinName: "default" }
  ]
};

export default defineLevel(spec, createLevelOptions());

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
      splashText("press shift to boost", { size: 50, timeout: 2000 });
    }
  };
}
