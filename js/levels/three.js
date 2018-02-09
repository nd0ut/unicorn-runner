import { splashText } from "../Splash";
import { Striker } from "../Traits";
import { defineLevel } from "./defineLevel";
import { clamp } from "../math";

const spec = {
  name: "test",
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
 
  ],
  entities: [
  
  ]
};

export default defineLevel(spec, {
  onStart: (game, level) => {
    // level.sounds.get('music').playOnce();
  }
});
