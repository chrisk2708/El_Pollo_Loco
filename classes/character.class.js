import { AudioHub } from "./audio-hub.class.js";
import { ImageHub } from "./img-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { Keyboard } from "./keyboard.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Playable character with movement, animation, camera and sounds. */
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

    /** Loads all character animations and starts gravity and game loops. */
    constructor() {
        super().loadImage(ImageHub.PEPE.idle[0]);
        Object.values(ImageHub.PEPE).forEach(images => this.loadImages(images));
        this.getRealFrame();
        this.applyGravity();
        this.animate();
    }

    /** Registers the independent movement, animation and sound timers. */
    animate() {
        IntervalHub.startInterval(() => this.updateMovement(), 1000 / 60);
        IntervalHub.startInterval(() => this.updateAnimation(), 150);
        IntervalHub.startInterval(() => this.updateWalkSound(), 50);
        IntervalHub.startInterval(() => this.updateDeathSound(), 200);
        IntervalHub.startInterval(() => this.playSnoreSound(), 3500);
    }

    /** Processes input and positions the camera relative to the character. */
    updateMovement() {
        if (!this.isDead()) {
            this.handleHorizontalMovement();
            this.handleJump();
        } else {
            this.startDeathJump();
        }
        this.updateCamera();
    }

    /** Lets the character jump up once on death; afterwards it falls through the ground. */
    startDeathJump() {
        if (this.hasDeathJumped) return;
        this.hasDeathJumped = true;
        this.speedY = 20;
    }

    /**
     * A dead character always counts as airborne so gravity lets it fall out of the screen.
     * @returns {boolean} Whether the character is in the air.
     */
    isAboveGround() {
        return this.isDead() || super.isAboveGround();
    }

    /** Lets the camera follow the character without scrolling past the level bounds. */
    updateCamera() {
        const maxScroll = this.world.level.levelEndX + this.width + 40 - this.world.canvas.width;
        const target = Math.min(Math.max(this.x - 120, 0), maxScroll);
        this.cameraX = -target;
    }

    /** Moves the character based on left and right input. */
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

    /** Triggers a jump and controls the jump sound repetition. */
    handleJump() {
        if (Keyboard.SPACE && !this.isAboveGround()) {
            this.speedY = 30;
            this.playJumpSound();
        }
        if (!this.isAboveGround()) this.isJumpSoundPlayed = false;
    }

    /** Plays the jump sound at most once per jump. */
    playJumpSound() {
        if (this.isJumpSoundPlayed) return;
        this.isJumpSoundPlayed = true;
        AudioHub.playOne(AudioHub.JUMP_SOUND);
    }

    /** Chooses the animation based on death, damage, jump, movement or idle time. */
    updateAnimation() {
        if (this.isDead()) return this.playAnimationOnce(ImageHub.PEPE.dead);
        if (this.isHurt()) return this.setAnimation(ImageHub.PEPE.hurt);
        if (this.isAboveGround()) return this.setAnimation(ImageHub.PEPE.jump);
        if (Keyboard.RIGHT || Keyboard.LEFT) return this.setAnimation(ImageHub.PEPE.walk);
        this.setIdleAnimation((Date.now() - this.idleTimeStamp) / 1000);
    }

    /**
     * Sets an animation and ends the current idle period.
     * @param {string[]} images Animation paths.
     */
    setAnimation(images) {
        this.idleTimeStamp = Date.now();
        this.isLongIdle = false;
        this.stopSnoreSound();
        this.playAnimation(images);
    }

    /**
     * Chooses the short or long idle animation.
     * @param {number} timePassed Seconds since the last activity.
     */
    setIdleAnimation(timePassed) {
        this.isLongIdle = timePassed > 10;
        const images = this.isLongIdle ? ImageHub.PEPE.longIdle : ImageHub.PEPE.idle;
        this.playAnimation(images);
    }

    /** Starts or stops the walking sound according to the movement state. */
    updateWalkSound() {
        const isBusy = this.isAboveGround() || this.isDead() || this.isHurt();
        const isWalking = Keyboard.RIGHT || Keyboard.LEFT;
        if (isWalking || isBusy) this.stopSnoreSound();
        if (isWalking && !isBusy) return this.startWalkSound();
        this.stopWalkSound();
    }

    /** Starts the looped walking sound if audio is enabled. */
    startWalkSound() {
        if (this.isWalkingPlaying || AudioHub.isMuted) return;
        this.isWalkingPlaying = true;
        AudioHub.playOne(AudioHub.WALK_SOUND);
    }

    /** Pauses the walking sound and resets its state. */
    stopWalkSound() {
        if (!this.isWalkingPlaying) return;
        this.isWalkingPlaying = false;
        AudioHub.stopOne(AudioHub.WALK_SOUND);
    }

    /** Plays the death sound once and stops the walking sound. */
    updateDeathSound() {
        if (!this.isDead() || this.hasPlayedDeathSound) return;
        this.hasPlayedDeathSound = true;
        AudioHub.playOne(AudioHub.DEAD_SOUND);
        this.stopWalkSound();
    }

    /** Plays the snoring sound during long idle time on the ground. */
    playSnoreSound() {
        const canSnore = this.isLongIdle && !Keyboard.RIGHT && !Keyboard.LEFT
            && !this.isAboveGround() && !this.isDead() && !this.isHurt();
        if (canSnore) AudioHub.playOne(AudioHub.SNOR_SOUND);
        else this.stopSnoreSound();
    }

    /** Stops a running snoring sound as soon as Pepe is no longer idle. */
    stopSnoreSound() {
        AudioHub.stopOne(AudioHub.SNOR_SOUND);
    }
}
