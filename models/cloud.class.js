import { ImageHub } from './img-hub.class.js';
import { MoveableObject } from './moveable-object.class.js';

export class Cloud extends MoveableObject {

    IMAGES = ImageHub.BACKGROUND.clouds;

    constructor() {
        super().loadImage(this.IMAGES[0]);
        this.loadImages(this.IMAGES);
        this.x = 0;
        this.y = 20;
        this.width = 500;
        this.height = 250;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
        }, 1000 / 60);

        // setInterval(() => {
        //     this.playAnimation(ImageHub.BACKGROUND.clouds);
        // }, 300);
    }
}