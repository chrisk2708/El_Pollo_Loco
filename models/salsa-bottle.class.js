import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

export class SalsaBottle extends DrawableObject {

    offset = {
        top: 10,  
        bottom: 10,
        left: 10,
        right: 10
    };

    IMAGES = ImageHub.BOTTLE.onGround;

    constructor(x, y) {
        super().loadImage(ImageHub.BOTTLE.onGround[0]);
        this.loadImages(this.IMAGES);
        this.width = 60;
        this.height = 60;
        this.x = x;
        this.y = y;
        this.getRealFrame();
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES);
        }, 700);
    }
}