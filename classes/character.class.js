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
    cameraX = 0;
    idleTimeStamp = Date.now();
    isLongIdle = false;
    isWalkingPlaying = false;
    hasPlayedDeathSound = false;
    hasDeathJumped = false;
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
        Object.values(ImageHub.PEPE).forEach(images => this.loadImages(images));
        this.getRealFrame();
        this.applyGravity();
        this.animate();
    }

    /** Registriert die unabhaengigen Bewegungs-, Animations- und Sound-Timer. */
    animate() {
        IntervalHub.startInterval(() => this.updateMovement(), 1000 / 60);
        IntervalHub.startInterval(() => this.updateAnimation(), 150);
        IntervalHub.startInterval(() => this.updateWalkSound(), 50);
        IntervalHub.startInterval(() => this.updateDeathSound(), 200);
        IntervalHub.startInterval(() => this.playSnoreSound(), 3500);
    }

    /** Verarbeitet Eingaben und positioniert die Kamera relativ zum Charakter. */
    updateMovement() {
        if (!this.isDead()) {
            this.handleHorizontalMovement();
            this.handleJump();
        } else {
            this.startDeathJump();
        }
        this.updateCamera();
    }

    /** Laesst den Charakter beim Tod einmal nach oben springen; danach faellt er durch den Boden. */
    startDeathJump() {
        if (this.hasDeathJumped) return;
        this.hasDeathJumped = true;
        this.speedY = 20;
    }

    /**
     * Ein toter Charakter gilt immer als in der Luft, damit die Gravitation ihn aus dem Bild fallen laesst.
     * @returns {boolean} Ob der Charakter in der Luft ist.
     */
    isAboveGround() {
        return this.isDead() || super.isAboveGround();
    }

    /** Laesst die Kamera dem Charakter folgen, ohne ueber die Levelgrenzen hinauszuscrollen. */
    updateCamera() {
        const maxScroll = this.world.level.levelEndX + this.width + 40 - this.world.canvas.width;
        const target = Math.min(Math.max(this.x - 120, 0), maxScroll);
        this.cameraX = -target;
    }

    /** Bewegt den Charakter anhand der linken und rechten Eingabe. */
    handleHorizontalMovement() {
        if (Keyboard.RIGHT && this.x < this.world.level.levelEndX) {
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

    /** Waehlt die Animation anhand von Tod, Schaden, Sprung, Bewegung oder Idle-Zeit. */
    updateAnimation() {
        if (this.isDead()) return this.playAnimationOnce(ImageHub.PEPE.dead);
        if (this.isHurt()) return this.setAnimation(ImageHub.PEPE.hurt);
        if (this.isAboveGround()) return this.setAnimation(ImageHub.PEPE.jump);
        if (Keyboard.RIGHT || Keyboard.LEFT) return this.setAnimation(ImageHub.PEPE.walk);
        this.setIdleAnimation((Date.now() - this.idleTimeStamp) / 1000);
    }

    /**
     * Setzt eine Animation und beendet den bisherigen Idle-Zeitabschnitt.
     * @param {string[]} images Animationspfade.
     */
    setAnimation(images) {
        this.idleTimeStamp = Date.now();
        this.isLongIdle = false;
        this.stopSnoreSound();
        this.playAnimation(images);
    }

    /**
     * Waehlt kurze oder lange Idle-Animation.
     * @param {number} timePassed Sekunden seit letzter Aktivitaet.
     */
    setIdleAnimation(timePassed) {
        this.isLongIdle = timePassed > 10;
        const images = this.isLongIdle ? ImageHub.PEPE.longIdle : ImageHub.PEPE.idle;
        this.playAnimation(images);
    }

    /** Startet oder beendet den Lauf-Sound passend zum Bewegungszustand. */
    updateWalkSound() {
        const isBusy = this.isAboveGround() || this.isDead() || this.isHurt();
        const isWalking = Keyboard.RIGHT || Keyboard.LEFT;
        if (isWalking || isBusy) this.stopSnoreSound();
        if (isWalking && !isBusy) return this.startWalkSound();
        this.stopWalkSound();
    }

    /** Startet den geloopten Lauf-Sound, sofern Audio aktiv ist. */
    startWalkSound() {
        if (this.isWalkingPlaying || AudioHub.isMuted) return;
        this.isWalkingPlaying = true;
        AudioHub.playOne(AudioHub.WALK_SOUND);
    }

    /** Pausiert den Lauf-Sound und setzt dessen Status zurueck. */
    stopWalkSound() {
        if (!this.isWalkingPlaying) return;
        this.isWalkingPlaying = false;
        AudioHub.stopOne(AudioHub.WALK_SOUND);
    }

    /** Spielt den Todessound einmal ab und beendet den Lauf-Sound. */
    updateDeathSound() {
        if (!this.isDead() || this.hasPlayedDeathSound) return;
        this.hasPlayedDeathSound = true;
        AudioHub.playOne(AudioHub.DEAD_SOUND);
        this.stopWalkSound();
    }

    /** Spielt bei langem, bodengebundenem Idle den Schnarchsound ab. */
    playSnoreSound() {
        const canSnore = this.isLongIdle && !Keyboard.RIGHT && !Keyboard.LEFT
            && !this.isAboveGround() && !this.isDead() && !this.isHurt();
        if (canSnore) AudioHub.playOne(AudioHub.SNOR_SOUND);
        else this.stopSnoreSound();
    }

    /** Beendet einen laufenden Schnarchsound, sobald Pepe nicht mehr idle ist. */
    stopSnoreSound() {
        AudioHub.stopOne(AudioHub.SNOR_SOUND);
    }
}
