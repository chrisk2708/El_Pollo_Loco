import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Thrown salsa bottle with flight, rotation and splash animation. */
export class ThrowableObject extends MoveableObject {
    height = 60;
    width = 50;
    speed = 15;
    isBroken = false;

    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    /**
     * Creates and launches a bottle.
     * @param {number} x Start position.
     * @param {number} y Start height.
     * @param {boolean} direction Facing direction of the player (true = left).
     */
    constructor(x, y, direction) {
        super().loadImage(ImageHub.BOTTLE.rotation[0]);
        this.loadImages(ImageHub.BOTTLE.rotation);
        this.loadImages(ImageHub.BOTTLE.splash);
        this.x = x;
        this.y = y;
        this.otherDirection = direction;
        this.getRealFrame();
        this.throw();
    }

    /** Starts gravity, movement and animation of the bottle. */
    throw() {
        this.speedY = 26;
        this.applyGravity();
        this.registerInterval(() => this.moveBottle(), 1000 / 30);
        this.registerInterval(() => this.updateAnimation(), 80);
    }

    /** Moves the bottle in its flight direction as long as it is not broken. */
    moveBottle() {
        if (this.isBroken) return;
        this.x += (this.otherDirection ? -1 : 1) * this.speed;
        this.getRealFrame();
    }

    /** Chooses the flight or splash animation based on the bottle state. */
    updateAnimation() {
        if (this.isBroken) return this.playAnimationOnce(ImageHub.BOTTLE.splash);
        this.playAnimation(ImageHub.BOTTLE.rotation);
    }

    /** Stops the bottle in place so the splash animation plays there. */
    break() {
        this.isBroken = true;
        this.speed = 0;
        this.speedY = 0;
    }

    /**
     * Checks whether the bottle has reached the ground.
     * @returns {boolean} Ground contact.
     */
    hasHitGround() {
        return this.y >= 340;
    }

    /**
     * A flying bottle keeps falling; gravity only stops when it breaks.
     * @returns {boolean} Whether gravity should keep applying.
     */
    isAboveGround() {
        return !this.isBroken;
    }
}
