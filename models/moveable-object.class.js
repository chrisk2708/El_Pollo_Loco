import { AudioHub } from "./audio-hub.class.js";
import { DrawableObject } from "./drawable-object.class.js";
import { IntervalHub } from "./interval-hub.class.js";

/** Erweiterung eines DrawableObject um Bewegung, Gravitation und Lebenszustand. */
export class MoveableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    lastEndbossHit = 0;
    lastThrow = 0;
    bottleHitEnemy = false;

    /** Startet einen Timer, der vertikale Bewegung und Gravitation aktualisiert. */
    applyGravity() {
    IntervalHub.startInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.getRealFrame();
        } else {
            this.speedY = 0; 
        }
    }, 1000 / 25);
}

    /** Prueft, ob sich das Objekt oberhalb der definierten Bodenhoehe befindet. @returns {boolean} Ob das Objekt in der Luft ist. */
    isAboveGround() {
        return this.y <= 130;
    }

    /** Prueft, ob das Objekt sich abwaerts bewegt. @returns {boolean} Ob es faellt. */
    isFalling() {
        return (this.isAboveGround() && this.speedY < 0);
    }

    /** Prueft die Rechteck-Kollision mit einem anderen beweglichen Objekt. @param {MoveableObject} mo Vergleichsobjekt. @returns {boolean} Kollisionsstatus. */
    isColliding(mo) {
        return this.rX + this.rW > mo.rX &&
            this.rY + this.rH > mo.rY &&
            this.rX < mo.rX + mo.rW &&
            this.rY < mo.rY + mo.rH;
    }

    /** Verringert die Energie und setzt bei Schaden den Trefferzeitpunkt. */
    hit() {
        this.energy -= 10 ;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    /** Prueft, ob der letzte Treffer noch als kurzer Schadenzustand gilt. @returns {boolean} Schadenstatus. */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 0.5;
    }

    /** Prueft den laengeren Trefferzustand des Endbosses. @returns {boolean} Boss-Schadenstatus. */
    isHurtEndboss() {
        let timePassed = new Date().getTime() - this.lastEndbossHit;
        timePassed = timePassed / 1000;
        return timePassed < 1.5;
    }

    /** Prueft, ob keine Energie mehr vorhanden ist. @returns {boolean} Todesstatus. */
    isDead() {
        return this.energy == 0;
    }

    /** Bewegt das Objekt nach rechts und aktualisiert den Kollisionsrahmen. */
    moveRight() {
        this.x += this.speed;
        this.getRealFrame();
    }

    /** Bewegt das Objekt nach links und aktualisiert den Kollisionsrahmen. */
    moveLeft() {
        this.x -= this.speed;
        this.getRealFrame();
    }

    /** Setzt die vertikale Geschwindigkeit fuer einen Sprung. */
    jump() {
        this.speedY = 30;
    }

    /** Prueft, ob der letzte Wurf lange genug zurueckliegt. @returns {boolean} Ob ein neuer Treffer erlaubt ist. */
    checkLastThrow() {
        let timePassed = new Date().getTime() - this.lastThrow;
        timePassed = timePassed / 1000;
        return timePassed > 0.5;
    }
}