import { DrawableObject } from "./drawable-object.class.js";

/** Extends a DrawableObject with movement, gravity and life state. */
export class MoveableObject extends DrawableObject {
    speed = 0.15;
    speedY = 0;
    acceleration = 2.5;
    groundY = 130;
    energy = 100;
    lastHit = 0;
    lastEndbossHit = 0;
    previousBottom = 0;

    /** Starts a timer that updates vertical movement and gravity. */
    applyGravity() {
        this.registerInterval(() => this.updateGravity(), 1000 / 25);
    }

    /** Performs one gravity step and remembers the previous bottom edge. */
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
     * Returns the bottom edge of the collision frame.
     * @returns {number} Y coordinate of the bottom edge.
     */
    getBottom() {
        return this.y + this.height - this.offset.bottom;
    }

    /**
     * Checks whether the object moved downwards in the last gravity step.
     * @returns {boolean} Whether it is currently moving down.
     */
    movedDown() {
        return this.getBottom() > this.previousBottom;
    }

    /** Places the object exactly on ground level after a jump. */
    land() {
        this.y = this.groundY;
        this.speedY = 0;
    }

    /**
     * Checks whether the object is above the defined ground level.
     * @returns {boolean} Whether the object is in the air.
     */
    isAboveGround() {
        return this.y < this.groundY;
    }

    /**
     * Checks whether the object is moving downwards in the air.
     * @returns {boolean} Whether it is falling.
     */
    isFalling() {
        return this.isAboveGround() && this.speedY < 0;
    }

    /**
     * Checks the rectangle collision with another object.
     * @param {DrawableObject} mo Object to compare with.
     * @returns {boolean} Collision state.
     */
    isColliding(mo) {
        return this.rX + this.rW > mo.rX &&
            this.rY + this.rH > mo.rY &&
            this.rX < mo.rX + mo.rW &&
            this.rY < mo.rY + mo.rH;
    }

    /**
     * Checks whether the 1.5 second invulnerability after a hit is still active.
     * @returns {boolean} Hurt state.
     */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 1.5;
    }

    /**
     * Checks the hurt state of the final boss.
     * @returns {boolean} Boss hurt state.
     */
    isHurtEndboss() {
        return (Date.now() - this.lastEndbossHit) / 1000 < 1.5;
    }

    /**
     * Checks whether no energy is left.
     * @returns {boolean} Dead state.
     */
    isDead() {
        return this.energy <= 0;
    }

    /** Moves the object to the right and updates the collision frame. */
    moveRight() {
        this.x += this.speed;
        this.getRealFrame();
    }

    /** Moves the object to the left and updates the collision frame. */
    moveLeft() {
        this.x -= this.speed;
        this.getRealFrame();
    }
}
