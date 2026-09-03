import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Endboss extends MoveableObject {

    height = 450;
    width = 350;
    y = 10;

    offset = {
        top: 80,  
        bottom: 20,
        left: 30,
        right: 15
    };

    constructor() {
        super();
        this.loadImage(ImageHub.BOSS_CHICKEN.walk[0]);
        this.loadImages(ImageHub.BOSS_CHICKEN.walk);
        this.loadImages(ImageHub.BOSS_CHICKEN.alert);
        this.loadImages(ImageHub.BOSS_CHICKEN.attack);
        this.loadImages(ImageHub.BOSS_CHICKEN.hurt);
        this.loadImages(ImageHub.BOSS_CHICKEN.dead);
        this.x = 2000;
        this.getRealFrame();
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(ImageHub.BOSS_CHICKEN.alert);
        }, 200);
    }

}