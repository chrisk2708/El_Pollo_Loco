import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class SmallChicken extends MoveableObject {

    y = 385;
    height = 30;
    width = 30;

    offset = {
        top: 5,  
        bottom: 5,
        left: 5,
        right: 5
    };

    constructor() {
        super().loadImage(ImageHub.SMALL_CHICKEN.walk[0]);
        this.loadImages(ImageHub.SMALL_CHICKEN.walk);
        this.loadImages(ImageHub.SMALL_CHICKEN.dead);

        this.x = 200 + Math.random() * 1440;
        this.speed = this.speed + Math.random() * 0.3;
        this.getRealFrame();
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(ImageHub.SMALL_CHICKEN.walk);
        }, 200);
    }
}