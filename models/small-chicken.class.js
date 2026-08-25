import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class SmallChicken extends MoveableObject {

    y = 390;
    height = 30;
    width = 30;

    constructor() {
        super().loadImage(ImageHub.SMALL_CHICKEN.walk[0]);
        this.loadImages(ImageHub.SMALL_CHICKEN.walk);
        this.loadImages(ImageHub.SMALL_CHICKEN.dead);

        this.x = 200 + Math.random() * 500;
        this.speed = this.speed + Math.random() * 0.3;
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