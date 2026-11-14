import { ImageHub } from "./img-hub.class.js";
import { MoveableObject } from "./moveable-object.class.js";

/** Standardgegner, der zwischen Levelanfang und Levelende hin und her laeuft. */
export class Chicken extends MoveableObject {
    y = 370;
    height = 50;
    width = 50;
    images;
    minX = 0;
    maxX = 3200;

    offset = {
        top: 5,
        bottom: 5,
        left: 5,
        right: 5
    };

    /**
     * Erzeugt einen Gegner mit zufaelliger Startposition ausserhalb des Startbildschirms.
     * @param {{walk: string[], dead: string[]}} images Animationsbilder des Huhns.
     */
    constructor(images = ImageHub.NORMAL_CHICKEN) {
        super().loadImage(images.walk[0]);
        this.images = images;
        this.loadImages(images.walk);
        this.loadImages(images.dead);
        this.x = 900 + Math.random() * 1500;
        this.speed = 0.4 + Math.random() * 0.4;
        this.animate();
    }

    /** Registriert Bewegung und zustandsabhaengige Animation. */
    animate() {
        this.registerInterval(() => this.patrol(), 1000 / 60);
        this.registerInterval(() => this.updateAnimation(), 150);
    }

    /** Bewegt das Huhn und dreht an den Levelgrenzen um. */
    patrol() {
        if (this.isDead()) return;
        if (this.x <= this.minX) this.otherDirection = true;
        if (this.x >= this.maxX) this.otherDirection = false;
        if (this.otherDirection) this.moveRight();
        else this.moveLeft();
    }

    /** Zeigt Lauf- oder Todesbild passend zum Zustand. */
    updateAnimation() {
        if (this.isDead()) this.playAnimation(this.images.dead);
        else this.playAnimation(this.images.walk);
    }
}
