
import { BackgroundObject } from "./background-object.class.js";
import { ImageHub } from "./img-hub.class.js";
import { Cloud } from "./cloud.class.js";

/** Beschreibt die Gegner, Sammelobjekte und Hintergrundebenen eines Levels. */
export class Level {
    enemies;
    collectibles;
    clouds = [];
    backgroundObjects = [];
    level_end_x = 3200;
    step = 960;

    /** Erzeugt ein Level und baut dessen Hintergrund anhand der Abschnittszahl auf. @param {number} sections Anzahl der Hintergrundabschnitte. @param {MoveableObject[]} enemies Gegnerliste. @param {DrawableObject[]} collectibles Sammelobjekte. */
    constructor(sections, enemies, collectibles) {
        this.addBgLayer(sections);
        this.enemies = enemies;
        this.collectibles = collectibles;
    }

    /** Fuegt pro Abschnitt Luft-, Parallaxen- und Wolkenobjekte hinzu. @param {number} sections Anzahl der Abschnitte. */
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