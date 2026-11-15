import { DrawableObject } from "./drawable-object.class.js";

/** HUD-Anzeige aus einem Symbol und einer Zahl, z. B. fuer Muenzen oder Flaschen. */
export class CounterDisplay extends DrawableObject {
    value = 0;

    /**
     * Erzeugt eine Zaehleranzeige.
     * @param {{path: string, crop: {sx: number, sy: number, sw: number, sh: number}, width: number, height: number}} icon
     *     Symbolbild, sichtbarer Bildausschnitt ohne transparenten Rand und Anzeigegroesse.
     * @param {number} x Horizontale Position.
     * @param {number} y Vertikale Position.
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
     * Setzt den angezeigten Wert.
     * @param {number} value Neuer Wert.
     */
    setValue(value) {
        this.value = value;
    }

    /**
     * Zeichnet den Bildausschnitt des Symbols und daneben die Zahl.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     */
    draw(ctx) {
        const { sx, sy, sw, sh } = this.crop;
        ctx.drawImage(this.img, sx, sy, sw, sh, this.x, this.y, this.width, this.height);
        this.drawValue(ctx);
    }

    /**
     * Zeichnet die Zahl mit dunkler Kontur fuer gute Lesbarkeit.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
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
