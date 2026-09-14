import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";

/** Sammelbare, animierte Muenze des Levels. */
export class Coin extends DrawableObject {

    offset = {
        top: 35,  
        bottom: 35,
        left: 35,
        right: 35
    };

    IMAGES = ImageHub.COIN.coin;

    /** Erzeugt eine Muenze an den angegebenen Weltkoordinaten. @param {number} x Horizontale Position. @param {number} y Vertikale Position. */
    constructor(x, y) {
        super().loadImage(ImageHub.COIN.coin[0]);
        this.loadImages(this.IMAGES);
        this.width = 100;
        this.height = 100;
        this.x = x;
        this.y = y;
        this.getRealFrame();
        this.animate();
    }

    /** Registriert die zyklische Muenzenanimation. */
    animate() {
        IntervalHub.startInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}