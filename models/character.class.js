import { ImageHub } from "./img-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Character extends MoveableObject {
    y = 130; //140
    height = 300;
    speed = 10;
    coins = 0;
    bottles = 0;
    world;
    camera_x;
    isLongIdle = false;
    // walking_sound = new Audio('audio/running.mp3');

    offset = {
        top: 110,  
        bottom: 10,
        left: 15,
        right: 20
    };
    
    constructor() {
        super().loadImage(ImageHub.PEPE.idle[0]);
        this.loadImages(ImageHub.PEPE.idle);
        this.loadImages(ImageHub.PEPE.longIdle);
        this.loadImages(ImageHub.PEPE.walk);
        this.loadImages(ImageHub.PEPE.jump);
        this.loadImages(ImageHub.PEPE.hurt);
        this.loadImages(ImageHub.PEPE.dead);
        this.getRealFrame();
        this.applyGravity();
        this.animate();
        console.log(this);
        
    }

    animate() {
        setInterval(() => {
            // this.walking_sound.pause();

            if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
                // this.walking_sound.play();
            }

            if (Keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
                // this.walking_sound.play();
            }

            if (Keyboard.SPACE && !this.isAboveGround()) {
                this.jump();
            }
            
            this.camera_x = -this.x + 120;
        }, 1000 / 50);

        setInterval(() => {

            if (this.isDead()) {
                this.playAnimation(ImageHub.PEPE.dead);
            } else if (this.isHurt()) {
                this.playAnimation(ImageHub.PEPE.hurt);
            } else if (this.isAboveGround()) {
                this.playAnimation(ImageHub.PEPE.jump);
            // } else if (this.isLongIdle()) {
                // this.playAnimation(ImageHub.PEPE.longIdle);
            } else {

                if (Keyboard.RIGHT || Keyboard.LEFT) {
                    // Walk Animaton
                    this.playAnimation(ImageHub.PEPE.walk);
                } else {
                    this.playAnimation(ImageHub.PEPE.idle);
                }
            }
        }, 250);
    }

    jump() {
        this.speedY = 30;
    }
}