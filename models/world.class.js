import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Chicken } from "./normal-chicken.class.js";
import { Endboss } from "./endboss.class.js";
import { Keyboard } from "./keyboard.class.js";
import { SmallChicken } from "./small-chicken.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { HealthBar } from "./health-bar.class.js";
import { CoinBar } from "./coin-bar.class.js";

export class World {
    ctx;
    canvas;
    camera_x = 0;
    character = new Character();
    healthbar = new HealthBar();
    coinbar = new CoinBar();
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
        this.ctx.translate(-this.character.camera_x, 0);

        this.addToMap(this.healthbar);
        this.addToMap(this.coinbar);

        this.ctx.translate(this.character.camera_x, 0);
        
        this.addObjectsToMap(this.level.enemies);
        this.addToMap(this.character);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.character.camera_x, 0);
        
        requestAnimationFrame(() => this.draw());
        
        // let self = this;
        // requestAnimationFrame(function() {
        //     self.draw();
        // });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
            // o.draw(this.ctx);
        });
    }

    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        
        mo.draw(this.ctx);
        if (mo instanceof Character || mo instanceof Chicken 
            || mo instanceof SmallChicken || mo instanceof Endboss) mo.drawFrame(this.ctx);

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
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }

    checkThrowObjects() {
        if (Keyboard.B) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 120)
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
            if (this.character.isColliding(enemy) ) {
                this.character.hit();
                this.healthbar.setPercentage(this.character.energy);
            }
        });
    }

    checkCollisionSubject() {

    }
}