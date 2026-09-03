import { DrawableObject } from "./drawable-object.class.js";

export class MoveableObject extends DrawableObject {
    speed = 0.1;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;
    lastHit = 0;
    lastEndbossHit = 0;
    lastThrow = 0;
    bottleHitEnemy = false;

    applyGravity() {
    setInterval(() => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
            this.getRealFrame();
        } else {
            // Sobald er auf dem Boden landet, wird speedY auf 0 zurückgesetzt
            this.speedY = 0; 
        }
    }, 1000 / 25);
}
    
    // applyGravity() {
    //     setInterval(() => {
    //         if (this.isAboveGround() || this.speedY > 0) {
    //             this.y -= this.speedY;
    //             this.speedY -= this.acceleration;
    //             this.getRealFrame();
    //         }
    //     }, 1000 / 25);
    // }

    isAboveGround() {
        return this.y <= 130;
    }

    isFalling() {
        return (this.isAboveGround() && this.speedY < 0);
    }

    // character.isColliding(chicken);
    isColliding(mo) {
        return this.rX + this.rW > mo.rX &&
            this.rY + this.rH > mo.rY &&
            this.rX < mo.rX + mo.rW &&
            this.rY < mo.rY + mo.rH;
    }

    // Treffer / Energy Zähler
    hit() {
        this.energy -= 10 ;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;   // Diff in ms
        timePassed = timePassed / 1000;                         // Diff in sec
        return timePassed < 0.5;
    }

    isHurtEndboss() {
        let timePassed = new Date().getTime() - this.lastEndbossHit;
        timePassed = timePassed / 1000;
        return timePassed < 1.5;
    }

    isDead() {
        return this.energy == 0;
    }

    moveRight() {
        this.x += this.speed;
        this.getRealFrame();
    }

    moveLeft() {
        this.x -= this.speed;
        this.getRealFrame();
    }

    jump() {
        this.speedY = 30;
    }

    checkLastThrow() {
        let timePassed = new Date().getTime() - this.lastThrow;
        timePassed = timePassed / 1000;
        return timePassed > 0.5;
    }
}