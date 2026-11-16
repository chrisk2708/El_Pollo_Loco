import { IntervalHub } from "./interval-hub.class.js";

/** Base class for visible objects with image and animation cache. */
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
     * Loads the current single image from an asset path.
     * @param {string} path Image path.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Preloads multiple images and stores them in the cache.
     * @param {string[]} arr Asset paths.
     */
    loadImages(arr) {
        arr.forEach(path => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the current image on the canvas.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /** Calculates the collision frame including the offset. */
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rW = this.width - this.offset.left - this.offset.right;
        this.rH = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Cycles to the next image of an animation.
     * @param {string[]} images Animation paths.
     */
    playAnimation(images) {
        const path = images[this.currentImage % images.length];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Plays an animation once and then stays on the last image.
     * @param {string[]} images Animation paths.
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
     * Starts a timer that is stopped together with the object when it is removed.
     * @param {Function} func Callback.
     * @param {number} timer Interval in milliseconds.
     */
    registerInterval(func, timer) {
        this.ownIntervals.push(IntervalHub.startInterval(func, timer));
    }

    /** Stops all timers of this object. */
    dispose() {
        this.ownIntervals.forEach(entry => IntervalHub.stopInterval(entry));
        this.ownIntervals = [];
    }
}
