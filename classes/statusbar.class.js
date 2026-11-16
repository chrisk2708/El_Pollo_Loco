import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

/** Shows a percentage game value with the matching status bar image. */
export class StatusBar extends DrawableObject {
    percentage;
    images = [];

    /**
     * Creates a status bar for an asset type and start value.
     * @param {string} type Status bar key.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     * @param {number} percentage Initial value.
     */
    constructor(type, x, y, percentage = 100) {
        super();
        this.images = ImageHub.STATUSBAR[type];
        this.loadImages(this.images);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 50;
        this.setPercentage(percentage);
    }

    /**
     * Updates the value and the displayed image.
     * @param {number} percentage New percentage.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.img = this.imageCache[this.images[this.resolveImageIndex()]];
    }

    /**
     * Draws the health bar exactly by percentage, all other bars in 20% steps.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     */
    draw(ctx) {
        const emptyImage = this.imageCache[this.images[0]];
        const fullImage = this.imageCache[this.images[5]];
        const isHealthBar = this.images === ImageHub.STATUSBAR.health;
        if (!isHealthBar || !this.isLoaded(emptyImage) || !this.isLoaded(fullImage)) return super.draw(ctx);
        ctx.drawImage(emptyImage, this.x, this.y, this.width, this.height);
        this.drawFilledPart(ctx, fullImage);
    }

    /**
     * Draws the filled part of the bar using clipping.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     * @param {HTMLImageElement} fullImage Image of the full bar.
     */
    drawFilledPart(ctx, fullImage) {
        const barX = this.x + this.width * 0.13;
        const barWidth = this.width * 0.85 * this.percentage / 100;
        if (barWidth <= 0) return;
        ctx.save();
        ctx.beginPath();
        ctx.rect(barX, this.y, barWidth, this.height);
        ctx.clip();
        ctx.drawImage(fullImage, this.x, this.y, this.width, this.height);
        ctx.restore();
    }

    /**
     * Checks whether an image is fully loaded.
     * @param {HTMLImageElement} image Image.
     * @returns {boolean} Load state.
     */
    isLoaded(image) {
        return image.complete && image.naturalWidth > 0;
    }

    /**
     * Maps the percentage to one of the six status images.
     * @returns {number} Image index from 0 to 5.
     */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage > 0) return 1;
        return 0;
    }
}
