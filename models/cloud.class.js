import { ImageHub } from './img-hub.class.js';
import { MoveableObject } from './moveable-object.class.js';

export class Cloud extends MoveableObject {
    y = 20;
    width = 500;
    height = 250;

    constructor() {
        super();
        this.loadImage(ImageHub.BACKGROUND.clouds[0]);
        this.loadImages(ImageHub.BACKGROUND.clouds);
        this.x = Math.random() * 500;
        this.animate();
    }

    animate() {
        this.moveLeft();
    }

}