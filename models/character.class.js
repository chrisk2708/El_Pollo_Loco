import { AudioHub } from "./AudioHub.class.js";
import { ImageHub } from "./img-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Character extends MoveableObject {
    y = 130;
    height = 300;
    width = 150;
    speed = 12;
    world;
    camera_x;
    idleTimeStamp = new Date().getTime();
    isLongIdle = false;
    isWalking = false;

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
        // Bewegungs- und Eingabe-Schleife (60 FPS)
        setInterval(() => {
            let isMoving = (Keyboard.RIGHT && this.x < this.world.level.level_end_x) || (Keyboard.LEFT && this.x > 0);

            if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (Keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            // Geh-Sound steuern (nur starten, wenn er sich bewegt und am Boden ist)
            if (isMoving && !this.isAboveGround()) {
                if (!this.isWalking) {
                    this.isWalking = true;
                    AudioHub.playOne(AudioHub.WALK_SOUND);
                }
            } else {
                if (this.isWalking) {
                    this.isWalking = false;
                    AudioHub.stopOne(AudioHub.WALK_SOUND);
                }
            }

            if (Keyboard.SPACE && !this.isAboveGround()) {
                this.speedY = 30;
                AudioHub.playOne(AudioHub.JUMP_SOUND);
            }

            this.camera_x = -this.x + 120;
        }, 1000 / 60);

        // Animations- und Status-Schleife
        setInterval(() => {
            let timePassed = (new Date().getTime() - this.idleTimeStamp) / 1000;

            if (this.isDead()) {
                this.playAnimation(ImageHub.PEPE.dead);
                // Dead Sound nur einmal abspielen, wenn gewünscht (oder über Flag steuern)
            } else if (this.isHurt()) {
                this.playAnimation(ImageHub.PEPE.hurt);
                this.idleTimeStamp = new Date().getTime();
                AudioHub.playOne(AudioHub.HURT_SOUND);
            } else if (this.isAboveGround()) {
                this.playAnimation(ImageHub.PEPE.jump);
            } else if (Keyboard.RIGHT || Keyboard.LEFT) {
                this.playAnimation(ImageHub.PEPE.walk);
                this.idleTimeStamp = new Date().getTime();
            } else {
                // Idle oder Long Idle
                if (timePassed > 10) {
                    if (!this.isLongIdle) {
                        this.isLongIdle = true;
                        AudioHub.playOne(AudioHub.SNOR_SOUND); // Spielt einmal ab bei Start des Long-Idle
                    }
                    this.playAnimation(ImageHub.PEPE.longIdle);
                } else {
                    this.isLongIdle = false;
                    this.playAnimation(ImageHub.PEPE.idle);
                }
            }
        }, 150);
    }
}
