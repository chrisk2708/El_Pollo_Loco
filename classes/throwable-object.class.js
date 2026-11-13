import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Geworfene Salsa-Flasche mit Flug-, Rotations- und Spritzanimation. */
export class ThrowableObject extends MoveableObject {

    height = 60;
    width = 50;
    speed = 15;

    offset = {
        top: 5,  
        bottom: 5,
        left: 5,
        right: 5
    };

    /** Erzeugt und startet eine Flasche. @param {number} x Startposition. @param {number} y Starthoehe. @param {boolean} direction Blickrichtung des Spielers. */
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
        this.startMovement();
        this.startAnimation();
    }

    /** Registriert die horizontale Flugbewegung. */
    startMovement() {
        IntervalHub.startInterval(() => {
            this.moveBottle();
        }, 1000 / 30);
    }

    /** Verschiebt die Flasche in ihre Flugrichtung. */
    moveBottle() {
        const direction = this.otherDirection ? -1 : 1;
        this.x += direction * this.speed;
        this.getRealFrame();
    }

    /** Registriert die regelmaessige Animationsaktualisierung. */
    startAnimation() {
        IntervalHub.startInterval(() => {
            this.updateAnimation();
        }, 100);
    }

    /** Waehlt Flug- oder Spritzanimation anhand des Flaschenzustands. */
    updateAnimation() {
        if (this.y >= 340 || this.bottleHitEnemy) return this.splashBottle();
        this.playAnimation(ImageHub.BOTTLE.rotation);
    }

    /** Stoppt die Flasche und spielt die Spritzanimation ab. */
    splashBottle() {
        this.speedY = 0;
        this.speed = 0;
        this.playAnimation(ImageHub.BOTTLE.splash);
        setTimeout(() => this.bottleHitEnemy = false, 200);
    }
    
    /** Ueberschreibt die Bodenpruefung fuer die geworfene Flasche. @returns {boolean} Immer wahr waehrend des Flaschenlebens. */
    isAboveGround() {
        return true;
    }

    /** Erlaubt Trefferpruefungen ohne weitere Zeitverzoegerung. @returns {boolean} Immer wahr. */
    checkLastThrow() {
        return true;
    }
}