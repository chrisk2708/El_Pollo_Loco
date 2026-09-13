import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

export class Endboss extends MoveableObject {

    height = 450;
    width = 350;
    y = 10;
    world;

    offset = {
        top: 80,  
        bottom: 20,
        left: 30,
        right: 15
    };

    constructor() {
        super();
        this.loadImage(ImageHub.BOSS_CHICKEN.walk[0]);
        this.loadImages(ImageHub.BOSS_CHICKEN.walk);
        this.loadImages(ImageHub.BOSS_CHICKEN.alert);
        this.loadImages(ImageHub.BOSS_CHICKEN.attack);
        this.loadImages(ImageHub.BOSS_CHICKEN.hurt);
        this.loadImages(ImageHub.BOSS_CHICKEN.dead);
        this.x = 2000;
        this.getRealFrame();
        this.animate();
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (this.isDead()) {
                this.speed = 0;
                this.playAnimation(ImageHub.BOSS_CHICKEN.dead);
                world.win = true;
                if (!this.isDeadSoundPlayed) {
                    AudioHub.playOne(AudioHub.BOSS_DEAD);
                    this.isDeadSoundPlayed = true; // Verhindert Intervall
                }
            } else if (this.isHurtEndboss()) {
                this.speed = 0;
                this.playAnimation(ImageHub.BOSS_CHICKEN.hurt);
            } else if (this.speed === 2.5) {
                this.playAnimation(ImageHub.BOSS_CHICKEN.attack);
            } else if (this.speed === 0) {
                this.playAnimation(ImageHub.BOSS_CHICKEN.alert);
            } else {
                this.playAnimation(ImageHub.BOSS_CHICKEN.walk);
                this.speed = 0.5;
            }
        }, 500);
    }
}