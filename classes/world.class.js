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

/** Zentrale Spielwelt fuer Rendering, Kollisionen, Sammelobjekte und Spielende. */
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
     * Initialisiert Canvas, Level, Charakterbindung, Spielschleife und Hintergrundmusik.
     * @param {HTMLCanvasElement} canvas Ziel-Canvas.
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

    /** Zeichnet einen Frame und plant den naechsten Render-Frame, solange die Welt laeuft. */
    draw() {
        if (this.isStopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.character.cameraX, 0);
        this.drawLevelObjects();
        this.ctx.translate(-this.character.cameraX, 0);
        this.drawStatusBars();
        this.frameId = requestAnimationFrame(() => this.draw());
    }

    /** Zeichnet Hintergrund, Gegner, Sammelobjekte, Charakter und Wurfobjekte. */
    drawLevelObjects() {
        [this.level.backgroundObjects, this.level.clouds, this.level.enemies,
            this.level.collectibles].forEach(objects => this.addObjectsToMap(objects));
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
    }

    /** Zeichnet Lebensleiste, Flaschen- und Muenzzahl sowie die Bossleiste, wenn der Boss sichtbar ist. */
    drawStatusBars() {
        const statusbars = [this.statusbarHealth, this.bottleCounter, this.coinCounter];
        if (this.isEndbossVisible()) statusbars.push(this.statusbarEndboss);
        statusbars.forEach(statusbar => this.addToMap(statusbar));
    }

    /**
     * Prueft, ob der Endboss im aktuellen Kameraausschnitt liegt.
     * @returns {boolean} Sichtbarkeit des Endbosses.
     */
    isEndbossVisible() {
        const cameraX = this.character.cameraX;
        return this.level.enemies.some(enemy => enemy instanceof Endboss
            && enemy.x + enemy.width + cameraX > 0
            && enemy.x + cameraX < this.canvas.width);
    }

    /**
     * Zeichnet eine Objektliste einzeln auf die Weltkarte.
     * @param {DrawableObject[]} objects Zu zeichnende Objekte.
     */
    addObjectsToMap(objects) {
        objects.forEach(object => this.addToMap(object));
    }

    /**
     * Zeichnet ein Objekt, aktualisiert seinen Kollisionsrahmen und spiegelt es bei Bedarf.
     * @param {DrawableObject} mo Objekt.
     */
    addToMap(mo) {
        mo.getRealFrame();
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    /**
     * Spiegelt den Zeichenkontext und die Objektposition horizontal.
     * @param {DrawableObject} mo Objekt.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    /**
     * Stellt Spiegelung und Objektposition nach dem Zeichnen wieder her.
     * @param {DrawableObject} mo Objekt.
     */
    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();
    }

    /** Startet die zentrale Kollisions-, Wurf- und Spielstatusschleife. */
    run() {
        IntervalHub.startInterval(() => {
            this.checkEnemyCollisions();
            this.checkBottleThrow();
            this.checkBottles();
            this.checkCollisionCollectible();
            if (this.character.isDead()) this.finishGame(false);
        }, 1000 / 60);
    }

    /** Steuert den Endboss und prueft alle Gegner auf Kollision mit dem Charakter. */
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
     * Prueft, ob der Charakter von oben auf einem Huhn landet. Massgeblich ist die Fussposition
     * vor dem letzten Gravitationsschritt, damit schnelle Landungen auf kleinen Huehnern zaehlen.
     * @param {MoveableObject} enemy Gegner.
     * @returns {boolean} Ob es ein Treffer von oben ist.
     */
    isJumpOnEnemy(enemy) {
        if (enemy instanceof Endboss || !this.character.movedDown()) return false;
        return this.character.previousBottom <= enemy.rY + 15;
    }

    /**
     * Besiegt ein Huhn durch einen Sprung und laesst den Charakter abprallen.
     * @param {MoveableObject} enemy Huhn.
     */
    stompEnemy(enemy) {
        this.character.speedY = 15;
        this.killEnemy(enemy);
    }

    /**
     * Setzt einen Gegner auf tot, spielt den Sound und entfernt ihn zeitversetzt.
     * @param {MoveableObject} enemy Gegner.
     */
    killEnemy(enemy) {
        enemy.energy = 0;
        AudioHub.playOne(AudioHub.CHIC_DEAD);
        setTimeout(() => this.removeFrom(this.level.enemies, enemy), 500);
    }

    /**
     * Zieht dem Charakter je nach Gegnertyp Energie ab, sofern er nicht unverwundbar ist.
     * @param {MoveableObject} enemy Angreifer.
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
     * Entfernt ein Objekt per Referenz aus einer Liste und beendet seine Timer.
     * @param {Array} list Objektliste.
     * @param {DrawableObject} object Zu entfernendes Objekt.
     */
    removeFrom(list, object) {
        const index = list.indexOf(object);
        if (index !== -1) list.splice(index, 1);
        if (object.dispose) object.dispose();
    }

    /** Sucht kollidierte Sammelobjekte und verarbeitet sie. */
    checkCollisionCollectible() {
        this.level.collectibles
            .filter(item => this.character.isColliding(item))
            .forEach(item => this.collectItem(item));
    }

    /**
     * Entfernt das eingesammelte Objekt und zaehlt es als Muenze oder Flasche.
     * @param {DrawableObject} item Sammelobjekt.
     */
    collectItem(item) {
        this.removeFrom(this.level.collectibles, item);
        if (item instanceof Coin) this.collectCoin();
        else if (item instanceof SalsaBottle) this.collectBottle();
    }

    /** Erhoeht die Muenzzahl, aktualisiert die Anzeige und spielt den Sound. */
    collectCoin() {
        this.coins++;
        this.coinCounter.setValue(this.coins);
        AudioHub.playOne(AudioHub.COIN_SOUND);
    }

    /** Erhoeht die Flaschenzahl, aktualisiert die Anzeige und spielt den Sound. */
    collectBottle() {
        this.bottles++;
        this.updateBottleBar();
        AudioHub.playOne(AudioHub.BOTL_PICK);
    }

    /** Aktualisiert die Flaschenzahl im HUD. */
    updateBottleBar() {
        this.bottleCounter.setValue(this.bottles);
    }

    /** Erzeugt bei Eingabe eine Wurf-Flasche, sofern Vorrat und Abklingzeit es erlauben. */
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

    /** Prueft fliegende Flaschen auf Gegnertreffer und Bodenkontakt. */
    checkBottles() {
        this.throwableObjects.filter(bottle => !bottle.isBroken).forEach(bottle => {
            const enemy = this.level.enemies.find(e => !e.isDead() && bottle.isColliding(e));
            if (enemy) this.hitEnemyWithBottle(bottle, enemy);
            else if (bottle.hasHitGround()) this.breakBottle(bottle);
        });
    }

    /**
     * Verarbeitet den Treffer einer Flasche auf einen Gegner.
     * @param {ThrowableObject} bottle Flasche.
     * @param {MoveableObject} enemy Getroffener Gegner.
     */
    hitEnemyWithBottle(bottle, enemy) {
        this.breakBottle(bottle);
        if (enemy instanceof Endboss) this.damageEndboss(enemy);
        else this.killEnemy(enemy);
    }

    /**
     * Laesst eine Flasche zerplatzen und entfernt sie nach der Spritzanimation.
     * @param {ThrowableObject} bottle Flasche.
     */
    breakBottle(bottle) {
        bottle.break();
        AudioHub.playOne(AudioHub.BOTL_BREAK);
        setTimeout(() => this.removeFrom(this.throwableObjects, bottle), 500);
    }

    /**
     * Verarbeitet Boss-Schaden, HUD-Aktualisierung sowie Treffer- oder Todessound.
     * @param {Endboss} boss Endboss.
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
     * Plant einmalig die Anzeige des End-Bildschirms nach Ablauf der Todesanimation.
     * @param {boolean} won Ob das Spiel gewonnen wurde.
     */
    finishGame(won) {
        if (this.isFinished) return;
        this.isFinished = true;
        setTimeout(() => this.showEndScreen(won), 2000);
    }

    /**
     * Stoppt die Welt und zeigt den Sieg- oder Niederlagenbildschirm.
     * @param {boolean} won Ob das Spiel gewonnen wurde.
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

    /** Beendet Zeichenschleife und alle Timer dieser Welt endgueltig. */
    stop() {
        this.isStopped = true;
        cancelAnimationFrame(this.frameId);
        IntervalHub.stopAllInterval();
    }
}
