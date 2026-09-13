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
import { AudioHub } from "./audio-hub.class.js";
import { IntervalHub } from "./interval-hub.class.js";

export class World {
    ctx;
    canvas;
    camera_x = 0;
    muted = false;
    character = new Character();
    statusbarBottles = new StatusBar("bottles", 10, 0, 0);
    statusbarHealth = new StatusBar("health", 10, 40);
    statusbarCoins = new StatusBar("coins", 10, 80, 0);
    statusbarEndboss = new StatusBar("endBoss", 740, 0);
    coins = 0;
    bottles = 0;
    level;
    throwableObjects = [];
    isThrow = false;
    // isAttack = false;
    otherDirection = false;
    win = false;
    id;


    constructor(canvas) {
        window.world = this;
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.level = level1();
        this.draw();
        this.setWorld();
        this.run();
        // AudioHub.GAME_SOUND.file.loop = true;
        AudioHub.playOne(AudioHub.GAME_SOUND);
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.character.camera_x > 0) this.character.camera_x = 0;
        this.ctx.translate(this.character.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.collectibles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);
        
        this.character.drawFrame(this.ctx);
        this.character.drawCollideFrame(this.ctx);
        this.level.enemies.forEach(enemy => enemy.drawCollideFrame(this.ctx));
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
        if (mo instanceof Character || mo instanceof Chicken || mo instanceof SmallChicken
            || mo instanceof Endboss || mo instanceof Coin || mo instanceof SalsaBottle || mo instanceof ThrowableObject) {
            mo.getRealFrame();
        }
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo instanceof Character || mo instanceof Chicken || mo instanceof SmallChicken
            || mo instanceof Endboss || mo instanceof Coin || mo instanceof SalsaBottle || mo instanceof ThrowableObject) {
            mo.drawFrame(this.ctx);
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
    if (bottle.isCollided || enemy.energy === 0) return;
    this.stopBottle(bottle);
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
        this.handleChickenHit(enemy);
    } else if (enemy instanceof Endboss) {
        this.handleEndbossHit(enemy);
    }
    this.removeBottle(bottle);
}

stopBottle(bottle) {
    bottle.isCollided = true;
    this.lastThrow = new Date().getTime();
    bottle.speed = 0;
    bottle.speedY = 0;
    bottle.bottleHitEnemy = true;
}

handleChickenHit(enemy) {
    enemy.energy = 0;
    if (!AudioHub.isMuted) {
        AudioHub.playOne(AudioHub.CHIC_DEAD);
    }
    setTimeout(() => {
        const i = this.level.enemies.indexOf(enemy);
        if (i !== -1) this.level.enemies.splice(i, 1);
    }, 300);
}

handleEndbossHit(enemy) {
    enemy.energy -= 20;
    enemy.lastEndbossHit = new Date().getTime();
    this.statusbarEndboss.setPercentage(enemy.energy);
    if (enemy.isDead() || enemy.energy <= 0) {
        this.handleEndbossDeath(enemy);
    } else if (!AudioHub.isMuted) {
        AudioHub.playOne(AudioHub.BOSS_HURT);
    }
}

handleEndbossDeath(enemy) {
    if (!enemy.isDeadPlayed && !AudioHub.isMuted) {
        enemy.isDeadPlayed = true;
        AudioHub.playOne(AudioHub.BOSS_DEAD);
    }
    setTimeout(() => {
        const i = this.level.enemies.indexOf(enemy);
        if (i !== -1) this.level.enemies.splice(i, 1);
    }, 3000);
}

removeBottle(bottle) {
    setTimeout(() => {
        const index = this.throwableObjects.indexOf(bottle);
        if (index !== -1) {
            this.throwableObjects.splice(index, 1);
        }
    }, 200);
}


//     // hitBottle(bottle, enemy) {
//     // if (bottle.isCollided || enemy.energy === 0) return;
//     //     bottle.isCollided = true;

//     //     this.lastThrow = new Date().getTime();
//     //     bottle.speed = 0;
//     //     bottle.speedY = 0;
//     //     bottle.bottleHitEnemy = true;

//     // if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
//     //     enemy.energy = 0;
        
//     //     if (!AudioHub.isMuted) {
//     //         AudioHub.playOne(AudioHub.CHIC_DEAD);
//     //     }

//     //     setTimeout(() => {
//     //         const currentEnemyIndex = this.level.enemies.indexOf(enemy);
//     //         if (currentEnemyIndex !== -1) {
//     //             this.level.enemies.splice(currentEnemyIndex, 1);
//     //         }
//     //     }, 300);

//     // } else if (enemy instanceof Endboss) {
//     //     enemy.energy -= 20;
//     //     enemy.lastEndbossHit = new Date().getTime();
//     //     this.statusbarEndboss.setPercentage(enemy.energy);

//     //     if (enemy.isDead() || enemy.energy <= 0) {
//     //         if (!enemy.isDeadPlayed && !AudioHub.isMuted) {
//     //             enemy.isDeadPlayed = true;
//     //             AudioHub.playOne(AudioHub.BOSS_DEAD);
//     //         }

//     //         // Endboss NUR DANN nach 3 Sekunden entfernen, wenn seine Energie aufgebraucht ist
//     //         setTimeout(() => {
//     //             const currentEnemyIndex = this.level.enemies.indexOf(enemy);
//     //             if (currentEnemyIndex !== -1) {
//     //                 this.level.enemies.splice(currentEnemyIndex, 1);
//     //             }
//     //         }, 3000);
//     //     } else {
//     //         if (!AudioHub.isMuted) {
//     //             AudioHub.playOne(AudioHub.BOSS_HURT);
//     //         }
//     //     }
//     // }

//     // Flasche aus Array entfernen
//     setTimeout(() => {
//         const bottleIndex = this.throwableObjects.indexOf(bottle);
//         if (bottleIndex !== -1) {
//             this.throwableObjects.splice(bottleIndex, 1);
//         }
//     }, 200);
// }

    hit(enemy) {
    // Prüfen, ob der Charakter fällt (speedY < 0)
    if (this.character.speedY < 0 && !(enemy instanceof Endboss)) {
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
        IntervalHub.startInterval(() => {
            this.checkCollisions();
            this.checkBottleHitEnemy();
            this.checkBottleThrow();
            this.checkBottleHitGround();
            this.checkCollisionCollectible();
            this.isGameLost();
            this.isGameWin();
        }, 1000 / 60); 
    }

checkCollisions() {
    this.level.enemies.forEach(enemy => {
        if (enemy instanceof Endboss) this.handleEndboss(enemy);
        if (this.character.isColliding(enemy)) this.handleEnemyCollision(enemy);
    });
}

handleEndboss(enemy) {
    const dist = Math.abs(this.character.x - enemy.x);
    enemy.otherDirection = this.character.x > enemy.x;
    if (dist < 800) {
        if (!enemy.hasAlerted) { enemy.hasAlerted = true; if (!AudioHub.isMuted) AudioHub.playOne(AudioHub.BOSS_ALERT); }
        enemy.speed = 2.5;
        enemy.x += (this.character.x < enemy.x) ? -enemy.speed : enemy.speed;
        if (enemy.currentAlertState !== 'attack' && !AudioHub.isMuted) {
            enemy.currentAlertState = 'attack'; AudioHub.playOne(AudioHub.BOSS_ATTACK);
        }
    } else { enemy.speed = 0.5; enemy.currentAlertState = 'patrol'; }
}

handleEnemyCollision(enemy) {
    if (enemy instanceof Endboss) {
        this.damageCharacter(enemy);
    } else if (this.isJumpOnChicken(enemy)) {
        this.defeatChicken(enemy);
    } else {
        this.damageCharacter(enemy);
    }
}

isJumpOnChicken(enemy) {
    return this.character.isAboveGround() && (this.character.rY + this.character.rH) <= (enemy.rY + 30);
}

defeatChicken(enemy) {
    if (enemy.isHit) return;
    enemy.isHit = true;
    this.character.speedY = 15;
    enemy.energy = 0;
    if (!AudioHub.isMuted) AudioHub.playOne(AudioHub.CHIC_DEAD);
    setTimeout(() => {
        let i = this.level.enemies.indexOf(enemy);
        if (i !== -1) this.level.enemies.splice(i, 1);
    }, 300);
}

damageCharacter(enemy) {
    this.hit(enemy);
    if (!AudioHub.isMuted) AudioHub.playOne(AudioHub.HURT_SOUND);
    this.statusbarHealth.setPercentage(this.character.energy);
}

    checkCollisionCollectible() {
        this.level.collectibles.forEach((collectible) => {
            if (this.character.isColliding(collectible)) {
                if (collectible instanceof Coin) {
                    this.coins++;
                    let index = this.level.collectibles.indexOf(collectible);
                    this.level.collectibles.splice(index, 1);
                    this.statusbarCoins.setPercentage(this.coins * 20);
                        AudioHub.playOne(AudioHub.COIN_SOUND);
                } else if (collectible instanceof SalsaBottle) {
                    this.bottles++;
                    let index = this.level.collectibles.indexOf(collectible);
                    this.level.collectibles.splice(index, 1);
                    this.statusbarBottles.setPercentage(this.bottles * 20);
                        AudioHub.playOne(AudioHub.BOTL_PICK);
                }
            }
        });
    }

    checkBottleThrow() {
        if (Keyboard.B && !this.isThrow && this.bottles > 0) {
            this.isThrow = true;
            const i = this.character.otherDirection ? this.character.x -20 : this.character.x + 100;
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
                        AudioHub.playOne(AudioHub.BOTL_BREAK);
                    } else {
                        AudioHub.stopOne(AudioHub.BOTL_BREAK);
                    }
                });
            }
        });
    }

    checkBottleHitGround() {
        for (let i = 0; i < this.throwableObjects.length; i++) {
            const bottle = this.throwableObjects[i];
            if (bottle.y >= 340) {
                setTimeout(() => {
                    AudioHub.playOne(AudioHub.BOTL_BREAK);
                    this.throwableObjects.splice(i, 1);
                }, 200);
            }
        }
    }

    isGameLost() {
    // Verhindern, dass Game Over auslöst, wenn das Spiel bereits gewonnen wurde
    if (this.win || this.winProcessed) return; 

    if (this.character.isDead()) {
        setTimeout(() => {
            const gameOverScreen = document.getElementById('gameOverScreen');
            if (gameOverScreen) {
                gameOverScreen.classList.remove('d-none');
                // Explizit das Verlust-Bild setzen, damit kein altes Win-Bild hängen bleibt
                gameOverScreen.style.backgroundImage = "url('./assets/img/You won, you lost/Game Over.png')"; // Pfad anpassen falls nötig
            }
            AudioHub.stopAll();
            IntervalHub.stopAllInterval();
        }, 2000);
    }
}

    isGameWin() {
        if (this.win && !this.winProcessed) {
            this.winProcessed = true;
            setTimeout(() => {
                const gameOverScreen = document.getElementById('gameOverScreen');
                if (gameOverScreen) {
                    gameOverScreen.classList.remove('d-none');
                    gameOverScreen.style.backgroundImage = "url('./assets/img/You won, you lost/You Win A.png')";
                    AudioHub.stopAll();
                }
                AudioHub.playOne(AudioHub.WIN_SOUND);
                IntervalHub.stopAllInterval();
            }, 2000);
        }
    }
}