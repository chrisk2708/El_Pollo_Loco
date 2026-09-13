import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Character extends MoveableObject {
    y = 130;
    height = 300;
    width = 150;
    speed = 10;
    world;
    camera_x;
    idleTimeStamp = new Date().getTime();
    isLongIdle = false;
    isWalking = false;
    isWalkingPlaying = false;
    hasPlayedDeathSound = false;
    isJumpSoundPlayed = false;

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
        IntervalHub.startInterval(() => {
            if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.moveRight();
                this.otherDirection = false;
            }
            if (Keyboard.LEFT && this.x > 0) {
                this.moveLeft();
                this.otherDirection = true;
            }

            if (Keyboard.SPACE && !this.isAboveGround()) {
                this.speedY = 30;
                if (!this.isJumpSoundPlayed) {
                    this.isJumpSoundPlayed
                    AudioHub.playOne(AudioHub.JUMP_SOUND);
                }
            }
            if (!this.isAboveGround()) {
                this.isJumpSoundPlayed = false;
            }
            this.camera_x = -this.x + 120;
            this.camera_x = Math.max(-1700, this.camera_x);
        }, 1000 / 60);

        // Animations- und Status-Schleife
        IntervalHub.startInterval(() => {
            let timePassed = (new Date().getTime() - this.idleTimeStamp) / 1000;

            if (this.isDead()) {
                this.playAnimation(ImageHub.PEPE.dead);
            } else if (this.isHurt()) {
                this.playAnimation(ImageHub.PEPE.hurt);
                this.idleTimeStamp = new Date().getTime();
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
                    }
                    this.playAnimation(ImageHub.PEPE.longIdle);
                } else {
                    this.isLongIdle = false;
                    this.playAnimation(ImageHub.PEPE.idle);
                }
            }
        }, 250);

        // Sound-Interval für Laufgeräusch (sauber entkoppelt ohne doppelte Auslöser)
        IntervalHub.startInterval(() => {
            let walkSoundPlay = (Keyboard.RIGHT || Keyboard.LEFT) && !this.isAboveGround() && !this.isDead();

            if (walkSoundPlay) {
                if (!this.isWalkingPlaying && !AudioHub.isMuted) {
                    this.isWalkingPlaying = true;
                    AudioHub.WALK_SOUND.file.currentTime = 0;
                    AudioHub.WALK_SOUND.file.play().catch(() => {});
                }
            } else {
                if (this.isWalkingPlaying) {
                    this.isWalkingPlaying = false;
                    AudioHub.WALK_SOUND.file.pause();
                }
            }
        }, 50);

        // Sound-Interval für Tod
        IntervalHub.startInterval(() => {
            if (this.isDead() && !this.hasPlayedDeathSound) {
                this.hasPlayedDeathSound = true;
                if (!AudioHub.isMuted) {
                    AudioHub.playOne(AudioHub.DEAD_SOUND);
                }
                // Lauf-Sound direkt stoppen, falls er lief
                if (this.isWalkingPlaying) {
                    this.isWalkingPlaying = false;
                    AudioHub.WALK_SOUND.file.pause();
                }
            }
        }, 200);

        // Sound-Interval für Treffer (Schaden)
        IntervalHub.startInterval(() => {
            if (this.isHurt() && !this.isDead()) {
                if (!AudioHub.isMuted) {
                    AudioHub.playOne(AudioHub.HURT_SOUND);
                }
            }
        }, 200);

        // Sound-Interval für Schnarchen im Long-Idle
        IntervalHub.startInterval(() => {
            if (this.isLongIdle && !this.isAboveGround() && !this.isDead()) {
                if (!AudioHub.isMuted) {
                    AudioHub.playOne(AudioHub.SNOR_SOUND);
                }
            }
        }, 3500);
    }
}