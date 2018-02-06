import { splashText } from "../Splash";
import { Striker } from "../Traits";
import { defineLevel } from "./defineLevel";

const spec = {
  name: "Example",
  background: {
    sky: require("../../img/backgrounds/clouds.png"),
    back: require("../../img/backgrounds/mountains.png"),
    front: require("../../img/backgrounds/forest.png")
  },
  sounds: [
    {
      url: require("../../sounds/hooked-on-a-feeling.mp3"),
      name: "music"
    }
  ],
  tileSprite: {
    imageURL: require("../../img/tiles/bf2.png"),
    tileW: 60,
    tileH: 60,
    frames: [
      {
        name: "default",
        rect: [340, 375, 60, 60]
      },
      {
        name: "left",
        rect: [252, 375, 60, 60]
      }
    ]
  },
  tiles: [["default", 2, 5], ["default", 3, 5], ["default", 4, 5]],
  entities: []
};

export default defineLevel(spec, {
  onStart: (game, level) => {
    // level.sounds.get('music').playOnce();
  }
});
