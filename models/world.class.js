import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Chicken } from "./normal-chicken.class.js";
import { Endboss } from "./endboss.class.js";
import { Keyboard } from "./keyboard.class.js";
import { SmallChicken } from "./small-chicken.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { HealthBar } from "./health-bar.class.js";
import { CoinBar } from "./coin-bar.class.js";
import { Coin } from "./coin.class.js";
import { SalsaBottle } from "./salsa-bottle.class.js";
import { BottleBar } from "./bottle-bar.class.js";
import { EndbossBar } from "./endboss-bar.class.js";

export class World {
    ctx;
    canvas;
    camera_x = 0;
    muted = false;
    character = new Character();
    healthbar = new HealthBar();
    coinbar = new CoinBar();
    bottlebar = new BottleBar();
    endbossbar = new EndbossBar();
    level = level1;
    throwableObjects = [];

    constructor(canvas) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.draw();
        this.setWorld();
        this.run();
        
    }

    setWorld() {
        
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.character.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.collectibles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);

        this.character.drawFrame(this.ctx);
        this.character.getRealFrame();
        this.character.drawCollideFrame(this.ctx);
        this.level.enemies.forEach(enemy => enemy.drawCollideFrame(this.ctx))
        this.ctx.translate(-this.character.camera_x, 0);

        this.addToMap(this.healthbar);
        this.addToMap(this.coinbar);
        this.addToMap(this.bottlebar);
        this.addToMap(this.endbossbar);
        
        requestAnimationFrame(() => this.draw());
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(mo) {
        
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        
        mo.draw(this.ctx);
        if (mo instanceof Character || mo instanceof Chicken || mo instanceof SmallChicken
            || mo instanceof Endboss || mo instanceof Coin || mo instanceof SalsaBottle) {
            mo.drawFrame(this.ctx);
            mo.getRealFrame();
            mo.drawCollideFrame(this.ctx);
        }

        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);        // Bild spiegeln
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo) {
        mo.x = mo.x * -1;
        this.ctx.restore();         // Spiegeln rückgängig machen
    }

    run() {
        setInterval(() => {
            // this.checkBottleAttack();
            this.checkBottleHitGround();
            this.checkCollisionCollectible();
        }, 50);

        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 100);
    }

    checkThrowObjects() {
        if (Keyboard.B) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 120)
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach(enemy => {
            if (this.character.isColliding(enemy)) {
                this.character.hit(enemy);
                if (this.character.isAboveGround() && !(enemy instanceof Endboss)) {
                    this.character.speedY = 15;
                }
                this.healthbar.setPercentage(this.character.energy);
            }
        });
    }

    checkCollisionCollectible() {
        this.level.collectibles.forEach(collectible => {
            if (this.character.isColliding(collectible)) {
                if (collectible instanceof Coin) {
                    this.character.coins++;
                    let index = this.level.collectibles.indexOf(collectible);
                    this.level.collectibles.splice(index, 1);
                    if (!this.muted) {
                        this.pickupCoinSound.volume = 0.6;
                        this.pickupCoinSound.play();
                    }
                    this.coinbar.setPercentage(this.character.coins * 20);
                } else if (collectible instanceof SalsaBottle) {
                    this.character.bottles++;
                    let index = this.level.collectibles.indexOf(collectible);
                    this.level.collectibles.splice(index, 1);
                    if (!this.muted) {
                        this.pickupBottleSound.volume = 0.5;
                        this.pickupBottleSound.play();
                    }
                    this.bottlebar.setPercentage(this.character.bottles * 20);
                }
            }
        });
    }

    checkBottleHitGround() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            const element = this.throwableObjects[i];
            if (element.y >= 400) {
                setTimeout(() => {
                    this.throwableObjects.splice(element, 1);
                }, 100);
            }
        }
    }
}