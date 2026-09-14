import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Endgegner mit Distanzsteuerung, Zustandsanimationen und Sieg-Seiteneffekt. */
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

    /** Laedt die Bossanimationen und startet die Animationsschleife. */
    constructor() {
        super();
        this.loadImage(ImageHub.BOSS_CHICKEN.walk[0]);
        this.loadImages(ImageHub.BOSS_CHICKEN.walk);
        this.loadImages(ImageHub.BOSS_CHICKEN.alert);
        this.loadImages(ImageHub.BOSS_CHICKEN.attack);
        this.loadImages(ImageHub.BOSS_CHICKEN.hurt);
        this.loadImages(ImageHub.BOSS_CHICKEN.dead);
        this.x = 2500;
        this.getRealFrame();
        this.animate();
    }

    /** Registriert die zeitgesteuerte Bossanimationsaktualisierung. */
    animate() {
        IntervalHub.startInterval(() => this.updateAnimation(), 500);
    }

    /** Waehlt Todes-, Treffer-, Angriffs-, Alarm- oder Laufanimation. */
    updateAnimation() {
        if (this.isDead()) return this.playDeadAnimation();
        if (this.isHurtEndboss()) return this.playHurtAnimation();
        if (this.speed === 2.5) return this.playAnimation(ImageHub.BOSS_CHICKEN.attack);
        if (this.speed === 0) return this.playAnimation(ImageHub.BOSS_CHICKEN.alert);
        this.playWalkAnimation();
    }

    /** Spielt die Todesanimation, markiert den Sieg und loest den Todessound aus. */
    playDeadAnimation() {
        this.speed = 0;
        this.playAnimation(ImageHub.BOSS_CHICKEN.dead);
        world.win = true;
        this.playDeathSound();
    }

    /** Spielt die Trefferanimation und stoppt voruebergehend die Bewegung. */
    playHurtAnimation() {
        this.speed = 0;
        this.playAnimation(ImageHub.BOSS_CHICKEN.hurt);
    }

    /** Spielt die Laufanimation und setzt die normale Bossgeschwindigkeit. */
    playWalkAnimation() {
        this.playAnimation(ImageHub.BOSS_CHICKEN.walk);
        this.speed = 0.5;
    }

    /** Spielt den Boss-Todessound einmalig ab. */
    playDeathSound() {
        if (this.isDeadSoundPlayed) return;
        AudioHub.playOne(AudioHub.BOSS_DEAD);
        this.isDeadSoundPlayed = true;
    }
}