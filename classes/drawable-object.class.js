import { IntervalHub } from "./interval-hub.class.js";

/** Basisklasse fuer sichtbare Objekte mit Bild- und Animationscache. */
export class DrawableObject {
    rX; rY; rW; rH;
    x = 100;
    y = 280;
    height = 150;
    width = 100;
    img;
    imageCache = {};
    currentImage = 0;
    otherDirection = false;
    offset = { top: 0, bottom: 0, left: 0, right: 0 };
    ownIntervals = [];

    /**
     * Laedt das aktuelle Einzelbild aus einem Asset-Pfad.
     * @param {string} path Bildpfad.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Laedt mehrere Bilder vor und speichert sie im Cache.
     * @param {string[]} arr Asset-Pfade.
     */
    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Zeichnet das aktuelle Bild auf den Canvas.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /** Berechnet den fuer Kollisionen verwendeten Rahmen unter Beruecksichtigung des Offsets. */
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Wechselt zyklisch zum naechsten Bild einer Animation.
     * @param {string[]} images Animationspfade.
     */
    playAnimation(images) {
        const path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Spielt eine Animation einmal ab und bleibt danach auf dem letzten Bild stehen.
     * @param {string[]} images Animationspfade.
     */
    playAnimationOnce(images) {
        if (this.onceImages !== images) {
            this.onceImages = images;
            this.onceFrame = 0;
        }
        const index = Math.min(this.onceFrame, images.length - 1);
        this.img = this.imageCache[images[index]];
        this.onceFrame++;
    }

    /**
     * Startet einen Timer, der beim Entfernen des Objekts mit beendet wird.
     * @param {Function} func Callback.
     * @param {number} timer Intervall in Millisekunden.
     */
    registerInterval(func, timer) {
        this.ownIntervals.push(IntervalHub.startInterval(func, timer));
    }

    /** Beendet alle eigenen Timer des Objekts. */
    dispose() {
        this.ownIntervals.forEach(entry => IntervalHub.stopInterval(entry));
        this.ownIntervals = [];
    }
}
