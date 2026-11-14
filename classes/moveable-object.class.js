import { DrawableObject } from "./drawable-object.class.js";

/** Erweiterung eines DrawableObject um Bewegung, Gravitation und Lebenszustand. */
export class MoveableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    groundY = 130;
    energy = 100;
    lastHit = 0;
    lastEndbossHit = 0;
    previousBottom = 0;

    /** Startet einen Timer, der vertikale Bewegung und Gravitation aktualisiert. */
    applyGravity() {
        this.registerInterval(() => this.updateGravity(), 1000 / 25);
    }

    /** Fuehrt einen Gravitationsschritt aus und merkt sich die vorherige Unterkante. */
    updateGravity() {
        this.previousBottom = this.getBottom();
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            if (!this.isAboveGround()) this.land();
            this.getRealFrame();
        } else {
            this.speedY = 0;
        }
    }

    /**
     * Liefert die Unterkante des Kollisionsrahmens.
     * @returns {number} Y-Koordinate der Unterkante.
     */
    getBottom() {
        return this.y + this.height - this.offset.bottom;
    }

    /**
     * Prueft, ob sich das Objekt im letzten Gravitationsschritt nach unten bewegt hat.
     * @returns {boolean} Ob es gerade abwaerts kommt.
     */
    movedDown() {
        return this.getBottom() > this.previousBottom;
    }

    /** Setzt das Objekt nach einem Sprung exakt auf die Bodenhoehe. */
    land() {
        this.y = this.groundY;
        this.speedY = 0;
    }

    /**
     * Prueft, ob sich das Objekt oberhalb der definierten Bodenhoehe befindet.
     * @returns {boolean} Ob das Objekt in der Luft ist.
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Prueft, ob das Objekt sich in der Luft abwaerts bewegt.
     * @returns {boolean} Ob es faellt.
     */
    isFalling() {
        return this.isAboveGround() && this.speedY < 0;
    }

    /**
     * Prueft die Rechteck-Kollision mit einem anderen Objekt.
     * @param {DrawableObject} mo Vergleichsobjekt.
     * @returns {boolean} Kollisionsstatus.
     */
    isColliding(mo) {
        return this.rX + this.rW > mo.rX &&
            this.rY + this.rH > mo.rY &&
            this.rX < mo.rX + mo.rW &&
            this.rY < mo.rY + mo.rH;
    }

    /**
     * Prueft, ob die 1,5-Sekunden-Unverwundbarkeit nach einem Treffer noch aktiv ist.
     * @returns {boolean} Schadenstatus.
     */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 1.5;
    }

    /**
     * Prueft den Trefferzustand des Endbosses.
     * @returns {boolean} Boss-Schadenstatus.
     */
    isHurtEndboss() {
        return (Date.now() - this.lastEndbossHit) / 1000 < 1.5;
    }

    /**
     * Prueft, ob keine Energie mehr vorhanden ist.
     * @returns {boolean} Todesstatus.
     */
    isDead() {
        return this.energy <= 0;
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
}
