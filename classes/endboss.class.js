import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Endgegner, der Pepe ab einer bestimmten Distanz verfolgt und angreift. */
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

    /** Laedt die Bossanimationen und startet die Animationsschleife. */
    constructor() {
        super().loadImage(ImageHub.BOSS_CHICKEN.walk[0]);
        Object.values(ImageHub.BOSS_CHICKEN).forEach(images => this.loadImages(images));
        this.x = 2500;
        this.getRealFrame();
        this.registerInterval(() => this.updateAnimation(), 200);
    }

    /**
     * Richtet den Boss auf Pepe aus und waehlt zwischen Warten, Verfolgen und Angreifen.
     * @param {Character} character Spielercharakter.
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

    /** Spielt beim ersten Kontakt einmalig den Alarm- und Angriffsschrei. */
    playAlertSoundOnce() {
        if (this.hasAlerted) return;
        this.hasAlerted = true;
        AudioHub.playOne(AudioHub.BOSS_ALERT);
        setTimeout(() => AudioHub.playOne(AudioHub.BOSS_ATTACK), 1200);
    }

    /** Waehlt Todes-, Treffer-, Angriffs-, Lauf- oder Alarmanimation. */
    updateAnimation() {
        if (this.isDead()) return this.playAnimationOnce(ImageHub.BOSS_CHICKEN.dead);
        if (this.isHurtEndboss()) return this.playAnimation(ImageHub.BOSS_CHICKEN.hurt);
        if (this.state === 'attack') return this.playAnimation(ImageHub.BOSS_CHICKEN.attack);
        if (this.state === 'walk') return this.playAnimation(ImageHub.BOSS_CHICKEN.walk);
        this.playAnimation(ImageHub.BOSS_CHICKEN.alert);
    }
}
