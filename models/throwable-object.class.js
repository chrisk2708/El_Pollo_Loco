import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

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

    throw() {
        this.speedY = 26;
        this.applyGravity();

        IntervalHub.startInterval(() => {
            if (this.otherDirection == true) {
                this.x -= this.speed;
                this.getRealFrame();
            } else {
                this.x += this.speed;
                this.getRealFrame();
            }
        }, 1000 / 30);

        IntervalHub.startInterval(() => {
            if(this.y >= 340 || this.bottleHitEnemy == true) {
                this.speedY = 0;
                this.speed = 0;
                this.playAnimation(ImageHub.BOTTLE.splash);
                setTimeout(() => {
                    this.bottleHitEnemy = false;
                }, 200);
            } else {
                this.playAnimation(ImageHub.BOTTLE.rotation);
            }
        }, 100);
    }
    
    isAboveGround() {
        return true;
    }

    checkLastThrow() {
        return true;
    }
}