import { IntervalHub } from './interval-hub.class.js';
import { MoveableObject } from './moveable-object.class.js';

/** Animierte Wolke, die kontinuierlich nach links durch die Welt zieht. */
export class Cloud extends MoveableObject {

    /** Erzeugt eine Wolke mit Bild und Startposition. @param {string} imagePath Bildpfad. @param {number} x Horizontale Position. */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 20;
        this.width = 500;
        this.height = 250;

        this.offset = {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        };
        this.animate();
    }

    /** Registriert die Bewegung und setzt die Wolke nach dem Verlassen der Welt zurueck. */
    animate() {
        IntervalHub.startInterval(() => {
            this.moveLeft();
            if (this.x <= -this.width) this.x = this.width * 5;
        }, 1000 / 60);
    }
}