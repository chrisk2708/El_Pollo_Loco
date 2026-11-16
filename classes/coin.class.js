import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

/** Collectible animated coin of the level. */
export class Coin extends DrawableObject {

    offset = {
        top: 35,  
        bottom: 35,
        left: 35,
        right: 35
    };

    IMAGES = ImageHub.COIN.coin;

    /** Creates a coin at the given world coordinates. @param {number} x Horizontal position. @param {number} y Vertical position. */
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

    /** Registers the cyclic coin animation. */
    animate() {
        this.registerInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}