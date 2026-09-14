import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Steuerbarer Spielercharakter mit Bewegung, Animation, Kamera und Sounds. */
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
    
    /** Laedt alle Charakteranimationen und startet Gravitation sowie Spielschleifen. */
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
    }

    /** Registriert die unabhaengigen Bewegungs-, Animations- und Sound-Timer. */
    animate() {
        this.registerMovement();
        this.registerAnimation();
        this.registerWalkSound();
        this.registerDeathSound();
        this.registerHurtSound();
        this.registerSnoreSound();
    }

    /** Registriert die Aktualisierung der Spielerbewegung. */
    registerMovement() {
        IntervalHub.startInterval(() => this.updateMovement(), 1000 / 60);
    }

    /** Verarbeitet Eingaben und positioniert die Kamera relativ zum Charakter. */
    updateMovement() {
        this.handleHorizontalMovement();
        this.handleJump();
        this.camera_x = Math.max(-1700, -this.x + 120);
    }

    /** Bewegt den Charakter anhand der linken und rechten Eingabe. */
    handleHorizontalMovement() {
        if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
            this.otherDirection = false;
        }
        if (Keyboard.LEFT && this.x > 0) {
            this.moveLeft();
            this.otherDirection = true;
        }
    }

    /** Loest einen Sprung aus und steuert die Sprungton-Wiederholung. */
    handleJump() {
        if (Keyboard.SPACE && !this.isAboveGround()) {
            this.speedY = 30;
            this.playJumpSound();
        }
        if (!this.isAboveGround()) this.isJumpSoundPlayed = false;
    }

    /** Spielt den Sprungton hoechstens einmal pro Sprung ab. */
    playJumpSound() {
        if (this.isJumpSoundPlayed) return;
        this.isJumpSoundPlayed = true;
        AudioHub.playOne(AudioHub.JUMP_SOUND);
    }

    /** Registriert die regelmaessige Aktualisierung der Charakteranimation. */
    registerAnimation() {
        IntervalHub.startInterval(() => this.updateAnimation(), 250);
    }

    /** Waehlt die Animation anhand von Tod, Schaden, Sprung, Bewegung oder Idle-Zeit. */
    updateAnimation() {
        const timePassed = (Date.now() - this.idleTimeStamp) / 1000;
        if (this.isDead()) return this.playAnimation(ImageHub.PEPE.dead);
        if (this.isHurt()) return this.setAnimation(ImageHub.PEPE.hurt);
        if (this.isAboveGround()) return this.playAnimation(ImageHub.PEPE.jump);
        if (Keyboard.RIGHT || Keyboard.LEFT) return this.setAnimation(ImageHub.PEPE.walk);
        this.setIdleAnimation(timePassed);
    }

    /** Setzt eine Animation und beendet den bisherigen Idle-Zeitabschnitt. @param {string[]} images Animationspfade. */
    setAnimation(images) {
        this.idleTimeStamp = Date.now();
        this.playAnimation(images);
    }

    /** Waehlt kurze oder lange Idle-Animation. @param {number} timePassed Sekunden seit letzter Aktivitaet. */
    setIdleAnimation(timePassed) {
        this.isLongIdle = timePassed > 10;
        const images = this.isLongIdle ? ImageHub.PEPE.longIdle : ImageHub.PEPE.idle;
        this.playAnimation(images);
    }

    /** Registriert die Pruefung fuer den Lauf-Sound. */
    registerWalkSound() {
        IntervalHub.startInterval(() => this.updateWalkSound(), 50);
    }

    /** Startet oder beendet den Lauf-Sound passend zum Bewegungszustand. */
    updateWalkSound() {
        const shouldPlay = (Keyboard.RIGHT || Keyboard.LEFT)
            && !this.isAboveGround() && !this.isDead();
        if (shouldPlay) return this.startWalkSound();
        this.stopWalkSound();
    }

    /** Startet den geloopten Lauf-Sound, sofern Audio aktiv ist. */
    startWalkSound() {
        if (this.isWalkingPlaying || AudioHub.isMuted) return;
        this.isWalkingPlaying = true;
        AudioHub.WALK_SOUND.file.currentTime = 0;
        AudioHub.WALK_SOUND.file.play().catch(() => {});
    }

    /** Pausiert den Lauf-Sound und setzt dessen Status zurueck. */
    stopWalkSound() {
        if (!this.isWalkingPlaying) return;
        this.isWalkingPlaying = false;
        AudioHub.WALK_SOUND.file.pause();
    }

    /** Registriert die Pruefung fuer den einmaligen Todessound. */
    registerDeathSound() {
        IntervalHub.startInterval(() => this.updateDeathSound(), 200);
    }

    /** Spielt den Todessound einmal ab und beendet den Lauf-Sound. */
    updateDeathSound() {
        if (!this.isDead() || this.hasPlayedDeathSound) return;
        this.hasPlayedDeathSound = true;
        if (!AudioHub.isMuted) AudioHub.playOne(AudioHub.DEAD_SOUND);
        this.stopWalkSound();
    }

    /** Registriert die periodische Schadenston-Pruefung. */
    registerHurtSound() {
        IntervalHub.startInterval(() => this.playHurtSound(), 200);
    }

    /** Spielt bei aktivem Schaden den Treffer-Sound ab. */
    playHurtSound() {
        if (this.isHurt() && !this.isDead() && !AudioHub.isMuted) {
            AudioHub.playOne(AudioHub.HURT_SOUND);
        }
    }

    /** Registriert die Pruefung fuer den Idle-Schnarchsound. */
    registerSnoreSound() {
        IntervalHub.startInterval(() => this.playSnoreSound(), 3500);
    }

    /** Spielt bei langem, bodengebundenem Idle den Schnarchsound ab. */
    playSnoreSound() {
        const canSnore = this.isLongIdle && !this.isAboveGround() && !this.isDead();
        if (canSnore && !AudioHub.isMuted) AudioHub.playOne(AudioHub.SNOR_SOUND);
    }
}