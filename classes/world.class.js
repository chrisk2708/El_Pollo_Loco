import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Endboss } from "./endboss.class.js";
import { Keyboard } from "./keyboard.class.js";
import { SmallChicken } from "./small-chicken.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { Coin } from "./coin.class.js";
import { SalsaBottle } from "./salsa-bottle.class.js";
import { StatusBar } from "./statusbar.class.js";
import { CounterDisplay } from "./counter-display.class.js";
import { AudioHub } from "./audio-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";
import { ImageHub } from "./img-hub.class.js";

/** Central game world for rendering, collisions, collectibles and game end. */
export class World {
    ctx;
    canvas;
    level;
    character = new Character();
    statusbarHealth = new StatusBar("health", 10, 0);
    bottleCounter = new CounterDisplay(ImageHub.STATUSBAR.counters.bottle, 24, 62);
    coinCounter = new CounterDisplay(ImageHub.STATUSBAR.counters.coin, 100, 66);
    statusbarEndboss = new StatusBar("endBoss", 740, 0);
    coins = 0;
    bottles = 0;
    throwableObjects = [];
    lastThrowTime = 0;
    isFinished = false;
    isStopped = false;
    frameId = null;

    /**
     * Initializes canvas, level, character binding, game loop and background music.
     * @param {HTMLCanvasElement} canvas Target canvas.
     */
    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.level = level1();
        this.character.world = this;
        this.draw();
        this.run();
        AudioHub.playOne(AudioHub.GAME_SOUND);
    }

    /** Draws a frame and schedules the next render frame as long as the world is running. */
    draw() {
        if (this.isStopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.character.cameraX, 0);
        this.drawLevelObjects();
        this.ctx.translate(-this.character.cameraX, 0);
        this.drawStatusBars();
        this.frameId = requestAnimationFrame(() => this.draw());
    }

    /** Draws background, enemies, collectibles, character and thrown objects. */
    drawLevelObjects() {
        [this.level.backgroundObjects, this.level.clouds, this.level.enemies,
            this.level.collectibles].forEach(objects => this.addObjectsToMap(objects));
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
    }

    /** Draws the health bar, bottle and coin count and the boss bar when the boss is visible. */
    drawStatusBars() {
        const statusbars = [this.statusbarHealth, this.bottleCounter, this.coinCounter];
        if (this.isEndbossVisible()) statusbars.push(this.statusbarEndboss);
        statusbars.forEach(statusbar => this.addToMap(statusbar));
    }

    /**
     * Checks whether the final boss is inside the current camera view.
     * @returns {boolean} Visibility of the final boss.
     */
    isEndbossVisible() {
        const cameraX = this.character.cameraX;
        return this.level.enemies.some(enemy => enemy instanceof Endboss
            && enemy.x + enemy.width + cameraX > 0
            && enemy.x + cameraX < this.canvas.width);
    }

    /**
     * Draws a list of objects one by one onto the world map.
     * @param {DrawableObject[]} objects Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(object => this.addToMap(object));
    }

    /**
     * Draws an object, updates its collision frame and mirrors it if needed.
     * @param {DrawableObject} mo Object.
     */
    addToMap(mo) {
        mo.getRealFrame();
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Mirrors the drawing context and the object position horizontally.
     * @param {DrawableObject} mo Object.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Restores mirroring and object position after drawing.
     * @param {DrawableObject} mo Object.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /** Starts the central collision, throw and game state loop. */
    run() {
        IntervalHub.startInterval(() => {
            this.checkEnemyCollisions();
            this.checkBottleThrow();
            this.checkBottles();
            this.checkCollisionCollectible();
            if (this.character.isDead()) this.finishGame(false);
        }, 1000 / 60);
    }

    /** Controls the final boss and checks all enemies for collision with the character. */
    checkEnemyCollisions() {
        this.level.enemies.forEach(enemy => {
            if (enemy instanceof Endboss) enemy.followCharacter(this.character);
            if (enemy.isDead() || this.character.isDead()) return;
            if (!this.character.isColliding(enemy)) return;
            if (this.isJumpOnEnemy(enemy)) this.stompEnemy(enemy);
            else this.damageCharacter(enemy);
        });
    }

    /**
     * Checks whether the character lands on a chicken from above. The relevant value is the foot position
     * before the last gravity step, so fast landings on small chickens count too.
     * @param {MoveableObject} enemy Enemy.
     * @returns {boolean} Whether it is a hit from above.
     */
    isJumpOnEnemy(enemy) {
        if (enemy instanceof Endboss || !this.character.movedDown()) return false;
        return this.character.previousBottom <= enemy.rY + 15;
    }

    /**
     * Defeats a chicken with a jump and lets the character bounce off.
     * @param {MoveableObject} enemy Chicken.
     */
    stompEnemy(enemy) {
        this.character.speedY = 15;
        this.killEnemy(enemy);
    }

    /**
     * Sets an enemy to dead, plays the sound and removes it with a delay.
     * @param {MoveableObject} enemy Enemy.
     */
    killEnemy(enemy) {
        enemy.energy = 0;
        AudioHub.playOne(AudioHub.CHIC_DEAD);
        setTimeout(() => this.removeFrom(this.level.enemies, enemy), 500);
    }

    /**
     * Reduces the character's energy depending on the enemy type unless it is invulnerable.
     * @param {MoveableObject} enemy Attacker.
     */
    damageCharacter(enemy) {
        if (this.character.isHurt()) return;
        const damage = enemy instanceof Endboss ? 20 : enemy instanceof SmallChicken ? 5 : 10;
        this.character.energy = Math.max(0, this.character.energy - damage);
        this.character.lastHit = Date.now();
        AudioHub.playOne(AudioHub.HURT_SOUND);
        this.statusbarHealth.setPercentage(this.character.energy);
    }

    /**
     * Removes an object from a list by reference and stops its timers.
     * @param {Array} list List of objects.
     * @param {DrawableObject} object Object to remove.
     */
    removeFrom(list, object) {
        const index = list.indexOf(object);
        if (index !== -1) list.splice(index, 1);
        if (object.dispose) object.dispose();
    }

    /** Finds collided collectibles and processes them. */
    checkCollisionCollectible() {
        this.level.collectibles
            .filter(item => this.character.isColliding(item))
            .forEach(item => this.collectItem(item));
    }

    /**
     * Removes the collected object and counts it as a coin or bottle.
     * @param {DrawableObject} item Collectible object.
     */
    collectItem(item) {
        this.removeFrom(this.level.collectibles, item);
        if (item instanceof Coin) this.collectCoin();
        else if (item instanceof SalsaBottle) this.collectBottle();
    }

    /** Increases the coin count, updates the display and plays the sound. */
    collectCoin() {
        this.coins++;
        this.coinCounter.setValue(this.coins);
        AudioHub.playOne(AudioHub.COIN_SOUND);
    }

    /** Increases the bottle count, updates the display and plays the sound. */
    collectBottle() {
        this.bottles++;
        this.updateBottleBar();
        AudioHub.playOne(AudioHub.BOTL_PICK);
    }

    /** Updates the bottle count in the HUD. */
    updateBottleBar() {
        this.bottleCounter.setValue(this.bottles);
    }

    /** Creates a thrown bottle on input if supply and cooldown allow it. */
    checkBottleThrow() {
        const canThrow = Date.now() - this.lastThrowTime > 1000;
        if (!Keyboard.B || !canThrow || this.bottles <= 0 || this.character.isDead()) return;
        this.lastThrowTime = Date.now();
        const pepe = this.character;
        const x = pepe.otherDirection ? pepe.x - 20 : pepe.x + 100;
        this.throwableObjects.push(new ThrowableObject(x, pepe.y + 150, pepe.otherDirection));
        this.bottles--;
        this.updateBottleBar();
        pepe.idleTimeStamp = Date.now();
    }

    /** Checks flying bottles for enemy hits and ground contact. */
    checkBottles() {
        this.throwableObjects.filter(bottle => !bottle.isBroken).forEach(bottle => {
            const enemy = this.level.enemies.find(e => !e.isDead() && bottle.isColliding(e));
            if (enemy) this.hitEnemyWithBottle(bottle, enemy);
            else if (bottle.hasHitGround()) this.breakBottle(bottle);
        });
    }

    /**
     * Handles a bottle hitting an enemy.
     * @param {ThrowableObject} bottle Bottle.
     * @param {MoveableObject} enemy Enemy that was hit.
     */
    hitEnemyWithBottle(bottle, enemy) {
        this.breakBottle(bottle);
        if (enemy instanceof Endboss) this.damageEndboss(enemy);
        else this.killEnemy(enemy);
    }

    /**
     * Lets a bottle burst and removes it after the splash animation.
     * @param {ThrowableObject} bottle Bottle.
     */
    breakBottle(bottle) {
        bottle.break();
        AudioHub.playOne(AudioHub.BOTL_BREAK);
        setTimeout(() => this.removeFrom(this.throwableObjects, bottle), 500);
    }

    /**
     * Handles boss damage, HUD update and the hurt or death sound.
     * @param {Endboss} boss Final boss.
     */
    damageEndboss(boss) {
        boss.energy = Math.max(0, boss.energy - 20);
        boss.lastEndbossHit = Date.now();
        this.statusbarEndboss.setPercentage(boss.energy);
        if (!boss.isDead()) return AudioHub.playOne(AudioHub.BOSS_HURT);
        AudioHub.playOne(AudioHub.BOSS_DEAD);
        this.finishGame(true);
    }

    /**
     * Schedules the end screen once after the death animation has finished.
     * @param {boolean} won Whether the game was won.
     */
    finishGame(won) {
        if (this.isFinished) return;
        this.isFinished = true;
        setTimeout(() => this.showEndScreen(won), 2000);
    }

    /**
     * Stops the world and shows the win or game over screen.
     * @param {boolean} won Whether the game was won.
     */
    showEndScreen(won) {
        if (this.isStopped) return;
        this.stop();
        AudioHub.stopAll();
        if (won) AudioHub.playOne(AudioHub.WIN_SOUND);
        const image = won ? ImageHub.INTRO_OUTRO_SCREENS.won[0] : ImageHub.INTRO_OUTRO_SCREENS.lost[0];
        const screen = document.getElementById('gameOverScreen');
        screen.style.backgroundImage = `url('${image}')`;
        screen.classList.remove('d-none');
        window.dispatchEvent(new CustomEvent('gameended'));
    }

    /** Permanently stops the render loop and all timers of this world. */
    stop() {
        this.isStopped = true;
        cancelAnimationFrame(this.frameId);
        IntervalHub.stopAllInterval();
    }
}
