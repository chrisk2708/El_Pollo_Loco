import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

export class Coin extends DrawableObject {

    IMAGES = ImageHub.COIN.coin;

    constructor(x, y) {
        super().loadImage(ImageHub.COIN.coin[0]);
        this.loadImages(this.IMAGES);
        this.width = 100;
        this.height = 100;
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 300);
    }
}