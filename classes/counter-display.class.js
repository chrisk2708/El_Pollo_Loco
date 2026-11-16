import { DrawableObject } from "./drawable-object.class.js";

/** HUD display made of an icon and a number, e.g. for coins or bottles. */
export class CounterDisplay extends DrawableObject {
    value = 0;

    /**
     * Creates a counter display.
     * @param {{path: string, crop: {sx: number, sy: number, sw: number, sh: number}, width: number, height: number}} icon
     *     Icon image, visible image section without transparent border and display size.
     * @param {number} x Horizontal position.
     * @param {number} y Vertical position.
     */
    constructor(icon, x, y) {
        super().loadImage(icon.path);
        this.crop = icon.crop;
        this.width = icon.width;
        this.height = icon.height;
        this.x = x;
        this.y = y;
    }

    /**
     * Sets the displayed value.
     * @param {number} value New value.
     */
    setValue(value) {
        this.value = value;
    }

    /**
     * Draws the image section of the icon and the number next to it.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     */
    draw(ctx) {
        const { sx, sy, sw, sh } = this.crop;
        ctx.drawImage(this.img, sx, sy, sw, sh, this.x, this.y, this.width, this.height);
        this.drawValue(ctx);
    }

    /**
     * Draws the number with a dark outline for better readability.
     * @param {CanvasRenderingContext2D} ctx Drawing context.
     */
    drawValue(ctx) {
        ctx.save();
        ctx.font = '32px WestTest, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillStyle = 'white';
        const textX = this.x + this.width + 8;
        const textY = this.y + this.height / 2 + 2;
        ctx.strokeText(String(this.value), textX, textY);
        ctx.fillText(String(this.value), textX, textY);
        ctx.restore();
    }
}
