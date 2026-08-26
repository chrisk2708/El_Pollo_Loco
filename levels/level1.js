import { BackgroundObject } from "../models/background-object.class.js";
import { Chicken } from "../models/normal-chicken.class.js";
import { Cloud } from "../models/cloud.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Level } from "../models/level.class.js";
import { SmallChicken } from "../models/small-chicken.class.js";
import { ImageHub } from "../models/img-hub.class.js";
import { Coin } from "../models/coin.class.js";

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
        new Coin(300, 200), new Coin(350, 150), new Coin(400, 100), new Coin(450, 150)
    ],

    [
        new Cloud(), new Cloud(), new Cloud(), new Cloud(),
        
        // new Cloud(ImageHub.BACKGROUND.clouds[0], 0),
        // new Cloud(ImageHub.BACKGROUND.clouds[1], 720),
        // new Cloud(ImageHub.BACKGROUND.clouds[0], 1440),
        // new Cloud(ImageHub.BACKGROUND.clouds[1], 2160),
        // new Cloud(ImageHub.BACKGROUND.clouds[0], 2880),
    ],

    [
        new BackgroundObject(ImageHub.BACKGROUND.air[0]),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], -720),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], -720),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], -720),
        // new Cloud(ImageHub.BACKGROUND.clouds[1], -720),

        new BackgroundObject(ImageHub.BACKGROUND.air[ 0]),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 0),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 0),
        // new Cloud(ImageHub.BACKGROUND.clouds[0], 0),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 720),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], 720),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], 720),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], 720),
        // new Cloud(ImageHub.BACKGROUND.clouds[1], 720),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 1440),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 1440),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 1440),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 1440),
        // new Cloud(ImageHub.BACKGROUND.clouds[0], 1440),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 2160),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[1], 2160),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[1], 2160),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[1], 2160),
        // new Cloud(ImageHub.BACKGROUND.clouds[1], 2160),

        new BackgroundObject(ImageHub.BACKGROUND.air[0], 2880),
        new BackgroundObject(ImageHub.BACKGROUND.thirdLayer[0], 2880),
        new BackgroundObject(ImageHub.BACKGROUND.secondLayer[0], 2880),
        new BackgroundObject(ImageHub.BACKGROUND.firstLayer[0], 2880),
        // new Cloud(ImageHub.BACKGROUND.clouds[0], 2880),
    ],
);