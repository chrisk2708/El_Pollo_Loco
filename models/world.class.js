import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Chicken } from "./normal-chicken.class.js";
import { Endboss } from "./endboss.class.js";
import { Keyboard } from "./keyboard.class.js";
import { SmallChicken } from "./small-chicken.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { Coin } from "./coin.class.js";
import { SalsaBottle } from "./salsa-bottle.class.js";
import { StatusBar } from "./statusbar.class.js";

export class World {
    ctx;
    canvas;
    camera_x = 0;
    muted = false;
    character = new Character();
    statusbarBottles = new StatusBar("bottles", 0, 0, 0);
    statusbarHealth = new StatusBar("health", 0, 40);
    statusbarCoins = new StatusBar("coins", 0, 80, 0);
    statusbarEndboss = new StatusBar("endBoss", 510, 0);
    coins = 0;
    bottles = 0;
    level = level1;
    throwableObjects = [];
    isThrow = false;
    otherDirection = false;
    id;

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
        // this.character.getRealFrame();
        this.character.drawCollideFrame(this.ctx);
        this.level.enemies.forEach(enemy => enemy.drawCollideFrame(this.ctx))
        this.character.getRealFrame();
        this.ctx.translate(-this.character.camera_x, 0);

        this.addToMap(this.statusbarCoins);
        this.addToMap(this.statusbarBottles);
        this.addToMap(this.statusbarHealth);
        this.addToMap(this.statusbarEndboss);
        
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

    hitBottle(bottle, enemy) {
    // Verhindern, dass dieselbe Flasche mehrfach trifft
    if (bottle.isCollided) return;
    bottle.isCollided = true;

    // Gegner-Index ermitteln
    let bottleIndex = this.throwableObjects.indexOf(bottle);

    this.lastThrow = new Date().getTime();
    this.bottleHitEnemy = true;

    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
        enemy.energy = 0;
    } else if (enemy instanceof Endboss) {
        enemy.energy -= 20;
        this.statusbarEndboss.setPercentage(enemy.energy);
        this.lastEndbossHit = new Date().getTime();
    }

    // Flasche sofort aus dem Array entfernen
    if (bottleIndex !== -1) {
        this.throwableObjects.splice(bottleIndex, 1);
    }

    // Gegner entfernen
    if (enemy.isDead()) {
        setTimeout(() => {
            let currentEnemyIndex = this.level.enemies.indexOf(enemy);
            if (currentEnemyIndex !== -1) {
                this.level.enemies.splice(currentEnemyIndex, 1);
            }
        }, 400);
    }
}

    hit(enemy) {
    // Prüfen, ob der Charakter fällt (speedY < 0)
    if (this.character.speedY < 0 && !(enemy instanceof Endboss)) {
        // if(!world.muted) {
        //     world.jumpOnEnemySound.volume = 0.5;
        //     world.jumpOnEnemySound.play();
        // }
        enemy.energy = 0;
        
        let enemyIndex = this.level.enemies.indexOf(enemy);
        setTimeout(() => {
            if (enemyIndex !== -1) {
                this.level.enemies.splice(enemyIndex, 1);
            }
        }, 500);
    } else {
        // Seitlicher Zusammenstoß -> Charakter nimmt Schaden
        if (enemy instanceof Chicken && enemy.energy > 0) {
            this.character.energy -= 1;
        } else if (enemy instanceof SmallChicken && enemy.energy > 0) {
            this.character.energy -= 0.5;
        } else if (enemy instanceof Endboss && enemy.energy > 0) {
            this.character.energy -= 1;
        }
    }

    if (this.character.energy <= 0) {
        this.character.energy = 0;
    } else {
        this.lastHit = new Date().getTime();
    }
}

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkBottleHitEnemy();
            this.checkBottleThrow();
            this.checkBottleHitGround();
            this.checkCollisionCollectible();
        }, 1000 / 60); 
    }

    checkCollisions() {
    this.level.enemies.forEach(enemy => {
        if (this.character.isColliding(enemy)) {
            // Füße (rY + rH) befinden sich im oberen Bereich des Gegners
            if (this.character.speedY < 0 && !(enemy instanceof Endboss) && (this.character.rY + this.character.rH) <= (enemy.rY + 40)) {
                console.log("Auf Gegner gesprungen!");
                
                // Charakter hüpft nach oben ab
                this.character.speedY = 15; 

                // Gegner töten und nach kurzer Verzögerung löschen
                enemy.energy = 0;
                let enemyIndex = this.level.enemies.indexOf(enemy);
                setTimeout(() => {
                    if (enemyIndex !== -1) {
                        this.level.enemies.splice(enemyIndex, 1);
                    }
                }, 300);
            } 
            // Seitlicher Zusammenstoß
            else {
                this.hit(enemy);
                this.statusbarHealth.setPercentage(this.character.energy);
            }
        }
    });
}

    checkCollisionCollectible() {
        this.level.collectibles.forEach((collectible) => {
            if (this.character.isColliding(collectible)) {
                if (collectible instanceof Coin) {
                    this.coins++;
                    let index = this.level.collectibles.indexOf(collectible);
                    this.level.collectibles.splice(index, 1);
                    this.statusbarCoins.setPercentage(this.coins * 20);
                    // if (!this.muted) {
                    //     this.pickupCoinSound.volume = 0.6;
                    //     this.pickupCoinSound.play();
                    // }
                    
                } else if (collectible instanceof SalsaBottle) {
                    this.bottles++;
                    let index = this.level.collectibles.indexOf(collectible);
                    this.level.collectibles.splice(index, 1);
                    this.statusbarBottles.setPercentage(this.bottles * 20);
                    // if (!this.muted) {
                    //     this.pickupBottleSound.volume = 0.5;
                    //     this.pickupBottleSound.play();
                    // }
                    
                }
            }
        });
    }

    checkBottleThrow() {
        if (Keyboard.B && !this.isThrow && this.bottles > 0) {
            this.isThrow = true;
            const i = this.character.otherDirection ? this.character.x : this.character.x + 100;
            let bottle = new ThrowableObject(i , this.character.y + 150, this.character.otherDirection);
            this.throwableObjects.push(bottle);
            this.bottles--;
            this.statusbarBottles.setPercentage(this.bottles * 20);
            setTimeout(() => {
                this.isThrow = false;
            }, 1500);
        }
    }

    checkBottleHitEnemy() {
        this.throwableObjects.forEach(bottle => {
            if (!bottle.isCollided) {
                this.level.enemies.forEach(enemy => {
                    if (bottle.isColliding(enemy) && bottle.checkLastThrow()) {
                        this.hitBottle(bottle, enemy);
                    }
                })
            };
        })
    }

    checkBottleHitGround() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            const element = this.throwableObjects[i];
            if (element.y >= 360) {
                setTimeout(() => {
                    this.throwableObjects.splice(i, 1);
                }, 200);
            }
        }
    }
}