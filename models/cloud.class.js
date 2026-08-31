import { MoveableObject } from './moveable-object.class.js';

export class Cloud extends MoveableObject {

    // IMAGES = ImageHub.BACKGROUND.clouds;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 20;
        this.width = 500;
        this.height = 250;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.moveLeft();
            if (this.x <= -this.width) this.x = this.width * 5;
        }, 1000 / 60);
    }
}