import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Chicken extends MoveableObject {

    y = 370;
    height = 50;
    width = 50;

    offset = {
        top: 5,  
        bottom: 5,
        left: 5,
        right: 5
    };

    constructor() {
        super().loadImage(ImageHub.NORMAL_CHICKEN.walk[0]);
        this.loadImages(ImageHub.NORMAL_CHICKEN.walk);
        this.loadImages(ImageHub.NORMAL_CHICKEN.dead);

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
            if (this.isDead()) {
                this.playAnimation(ImageHub.NORMAL_CHICKEN.dead);
                this.speed = 0;
                this.getRealFrame();
            } else {
                this.playAnimation(ImageHub.NORMAL_CHICKEN.walk);
            }
        }, 200);
    }


}