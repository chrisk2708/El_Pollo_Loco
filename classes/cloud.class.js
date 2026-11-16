import { MoveableObject } from './moveable-object.class.js';

/** Animated cloud that continuously drifts to the left through the world. */
export class Cloud extends MoveableObject {

    /** Creates a cloud with image and start position. @param {string} imagePath Image path. @param {number} x Horizontal position. */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 20;
        this.width = 500;
        this.height = 250;

        this.offset = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        this.animate();
    }

    /** Registers the movement and resets the cloud after it leaves the world. */
    animate() {
        this.registerInterval(() => {
            this.moveLeft();
            if (this.x <= -this.width) this.x = this.width * 5;
        }, 1000 / 60);
    }
}