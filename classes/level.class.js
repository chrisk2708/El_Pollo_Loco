
import { BackgroundObject } from "./background-object.class.js";
import { ImageHub } from "./img-hub.class.js";
import { Cloud } from "./cloud.class.js";

/** Describes the enemies, collectibles and background layers of a level. */
export class Level {
    enemies;
    collectibles;
    clouds = [];
    backgroundObjects = [];
    levelEndX = 3200;
    step = 960;

    /** Creates a level and builds its background based on the number of sections. @param {number} sections Number of background sections. @param {MoveableObject[]} enemies List of enemies. @param {DrawableObject[]} collectibles Collectible objects. */
    constructor(sections, enemies, collectibles) {
        this.addBgLayer(sections);
        this.enemies = enemies;
        this.collectibles = collectibles;
    }

    /** Adds air, parallax and cloud objects for each section. @param {number} sections Number of sections. */
    addBgLayer(sections) {
        for (let i = 0; i < sections; i++) {
            const imgThirdLayer = ImageHub.BACKGROUND.thirdLayer[i % 2];
            const imgSecondLayer = ImageHub.BACKGROUND.secondLayer[i % 2];
            const imgFirstLayer = ImageHub.BACKGROUND.firstLayer[i % 2];
            const imgCloud = ImageHub.BACKGROUND.clouds[i % 2];
            
            this.backgroundObjects.push(new BackgroundObject(ImageHub.BACKGROUND.air, this.step * i));
            this.backgroundObjects.push(new BackgroundObject(imgThirdLayer, this.step * i));
            this.backgroundObjects.push(new BackgroundObject(imgSecondLayer, this.step * i));
            this.backgroundObjects.push(new BackgroundObject(imgFirstLayer, this.step * i));
            this.clouds.push(new Cloud(imgCloud, this.step * i));
        }
        
    }
}