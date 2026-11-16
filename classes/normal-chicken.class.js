import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Standard enemy that walks back and forth between level start and level end. */
export class Chicken extends MoveableObject {
    y = 370;
    height = 50;
    width = 50;
    images;
    minX = 0;
    maxX = 3200;

    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    /**
     * Creates an enemy with a random start position outside the start screen.
     * @param {{walk: string[], dead: string[]}} images Animation images of the chicken.
     */
    constructor(images = ImageHub.NORMAL_CHICKEN) {
        super().loadImage(images.walk[0]);
        this.images = images;
        this.loadImages(images.walk);
        this.loadImages(images.dead);
        this.x = 900 + Math.random() * 1500;
        this.speed = 0.4 + Math.random() * 0.4;
        this.animate();
    }

    /** Registers movement and state dependent animation. */
    animate() {
        this.registerInterval(() => this.patrol(), 1000 / 60);
        this.registerInterval(() => this.updateAnimation(), 150);
    }

    /** Moves the chicken and turns around at the level bounds. */
    patrol() {
        if (this.isDead()) return;
        if (this.x <= this.minX) this.otherDirection = true;
        if (this.x >= this.maxX) this.otherDirection = false;
        if (this.otherDirection) this.moveRight();
        else this.moveLeft();
    }

    /** Shows the walk or death image according to the state. */
    updateAnimation() {
        if (this.isDead()) this.playAnimation(this.images.dead);
        else this.playAnimation(this.images.walk);
    }
}
