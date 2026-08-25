import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Chicken extends MoveableObject {

    y = 370;
    height = 50;
    width = 50;

    constructor() {
        super().loadImage(ImageHub.NORMAL_CHICKEN.walk[0]);
        this.loadImages(ImageHub.NORMAL_CHICKEN.walk);
        this.loadImages(ImageHub.NORMAL_CHICKEN.dead);

        this.x = 200 + Math.random() * 500;
        this.speed = this.speed + Math.random() * 0.3;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        setInterval(() => {
            this.playAnimation(ImageHub.NORMAL_CHICKEN.walk);
        }, 200);
    }


}