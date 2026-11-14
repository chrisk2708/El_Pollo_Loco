import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Geworfene Salsa-Flasche mit Flug-, Rotations- und Spritzanimation. */
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
     * Erzeugt und startet eine Flasche.
     * @param {number} x Startposition.
     * @param {number} y Starthoehe.
     * @param {boolean} direction Blickrichtung des Spielers (true = links).
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

    /** Startet Gravitation, Bewegung und Animation der Flasche. */
    throw() {
        this.speedY = 26;
        this.applyGravity();
        this.registerInterval(() => this.moveBottle(), 1000 / 30);
        this.registerInterval(() => this.updateAnimation(), 80);
    }

    /** Verschiebt die Flasche in ihre Flugrichtung, solange sie nicht zerbrochen ist. */
    moveBottle() {
        if (this.isBroken) return;
        this.x += (this.otherDirection ? -1 : 1) * this.speed;
        this.getRealFrame();
    }

    /** Waehlt Flug- oder Spritzanimation anhand des Flaschenzustands. */
    updateAnimation() {
        if (this.isBroken) return this.playAnimationOnce(ImageHub.BOTTLE.splash);
        this.playAnimation(ImageHub.BOTTLE.rotation);
    }

    /** Stoppt die Flasche an Ort und Stelle, damit die Spritzanimation dort ablaeuft. */
    break() {
        this.isBroken = true;
        this.speed = 0;
        this.speedY = 0;
    }

    /**
     * Prueft, ob die Flasche den Boden erreicht hat.
     * @returns {boolean} Bodenkontakt.
     */
    hasHitGround() {
        return this.y >= 340;
    }

    /**
     * Eine fliegende Flasche faellt immer weiter; erst beim Zerbrechen stoppt die Gravitation.
     * @returns {boolean} Ob die Gravitation weiter wirken soll.
     */
    isAboveGround() {
        return !this.isBroken;
    }
}
