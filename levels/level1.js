import { BackgroundObject } from "../models/background-object.class.js";
import { Chicken } from "../models/normal-chicken.class.js";
import { Cloud } from "../models/cloud.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Level } from "../models/level.class.js";
import { SmallChicken } from "../models/small-chicken.class.js";
import { ImageHub } from "../models/img-hub.class.js";

export const level1 = new Level(
    [
        new Chicken(),
        new Chicken(),
        new Chicken(),
        new SmallChicken(),
        new SmallChicken(),
        new SmallChicken(),
        new Endboss()
    ],

    [
        new Cloud()
    ],

    [
        new BackgroundObject(ImageHub.BACKGROUND.air[0], -720),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], -720),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], -720),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], -720),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 0),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 720),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], 720),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], 720),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], 720),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 1440),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 1440),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 1440),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 1440),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 2160),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], 2160),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], 2160),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], 2160),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 2880),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 2880),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 2880),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 2880),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 3600),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], 3600),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], 3600),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], 3600),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 4320),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 4320),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 4320),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 4320),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 5040),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], 5040),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], 5040),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], 5040),
    ]
);