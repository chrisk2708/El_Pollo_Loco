import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class ThrowableObject extends MoveableObject {

    height = 60;
    width = 50;
    speedX = 30;

    offset = {
        top: 5,  
        bottom: 5,
        left: 5,
        right: 5
    };

    constructor(x, y) {
        super().loadImage(ImageHub.BOTTLE.rotation[0]);
        this.loadImages(ImageHub.BOTTLE.rotation);
        this.x = x;    
        this.y = y;
        this.getRealFrame();
        this.throw();
        console.log(this);
    }

    throw() {
        this.speedY = 25;
        this.applyGravity();
        setInterval(() => {
            this.x += this.speedX;
        this.playAnimation(ImageHub.BOTTLE.rotation);
        }, 60);
    }
    
    isAboveGround() {
        return true;
    }
}