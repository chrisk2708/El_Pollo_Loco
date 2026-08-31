
import { BackgroundObject } from "./background-object.class.js";
import { ImageHub } from "./img-hub.class.js";
import { Cloud } from "./cloud.class.js";

export class Level {
    enemies;
    collectibles;
    clouds = [];
    backgroundObjects = [];
    level_end_x = 3000;
    step = 720;

    constructor(sections, enemies, collectibles) {
        this.addBgLayer(sections);
        this.enemies = enemies;
        this.collectibles = collectibles;
        console.log(enemies);
        console.log(collectibles);
        
    }

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