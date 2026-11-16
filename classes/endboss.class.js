import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Final boss that follows and attacks Pepe from a certain distance. */
export class Endboss extends MoveableObject {
    height = 450;
    width = 350;
    y = 10;
    speed = 2.5;
    state = 'alert';
    hasAlerted = false;

    offset = {
        top: 80,
        bottom: 20,
        left: 30,
        right: 15
    };

    /** Loads the boss animations and starts the animation loop. */
    constructor() {
        super().loadImage(ImageHub.BOSS_CHICKEN.walk[0]);
        Object.values(ImageHub.BOSS_CHICKEN).forEach(images => this.loadImages(images));
        this.x = 2500;
        this.getRealFrame();
        this.registerInterval(() => this.updateAnimation(), 200);
    }

    /**
     * Turns the boss towards Pepe and chooses between waiting, chasing and attacking.
     * @param {Character} character Player character.
     */
    followCharacter(character) {
        if (this.isDead() || character.isDead()) return;
        const distance = Math.abs(character.x - this.x);
        this.otherDirection = character.x > this.x;
        if (distance > 800) {
            this.state = 'alert';
            return;
        }
        this.playAlertSoundOnce();
        this.state = distance < 250 ? 'attack' : 'walk';
        if (this.isHurtEndboss()) return;
        this.x += character.x < this.x ? -this.speed : this.speed;
    }

    /** Plays the alert and attack scream once on first contact. */
    playAlertSoundOnce() {
        if (this.hasAlerted) return;
        this.hasAlerted = true;
        AudioHub.playOne(AudioHub.BOSS_ALERT);
        setTimeout(() => AudioHub.playOne(AudioHub.BOSS_ATTACK), 1200);
    }

    /** Chooses the death, hurt, attack, walk or alert animation. */
    updateAnimation() {
        if (this.isDead()) return this.playAnimationOnce(ImageHub.BOSS_CHICKEN.dead);
        if (this.isHurtEndboss()) return this.playAnimation(ImageHub.BOSS_CHICKEN.hurt);
        if (this.state === 'attack') return this.playAnimation(ImageHub.BOSS_CHICKEN.attack);
        if (this.state === 'walk') return this.playAnimation(ImageHub.BOSS_CHICKEN.walk);
        this.playAnimation(ImageHub.BOSS_CHICKEN.alert);
    }
}
