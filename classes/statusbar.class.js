import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

/** Zeigt einen prozentualen Spielwert mit dem passenden Statusleistenbild an. */
export class StatusBar extends DrawableObject {
    percentage;
    images = [];

    /**
     * Erzeugt eine Statusleiste fuer einen Asset-Typ und Startwert.
     * @param {string} type Statusleisten-Schluessel.
     * @param {number} x Horizontale Position.
     * @param {number} y Vertikale Position.
     * @param {number} percentage Anfangswert.
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
     * Aktualisiert Wert und angezeigtes Bild.
     * @param {number} percentage Neuer Prozentwert.
     */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        this.img = this.imageCache[this.images[this.resolveImageIndex()]];
    }

    /**
     * Zeichnet die Lebensleiste prozentgenau, alle anderen Leisten in 20%-Stufen.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
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
     * Zeichnet den gefuellten Anteil der Leiste per Clipping.
     * @param {CanvasRenderingContext2D} ctx Zeichenkontext.
     * @param {HTMLImageElement} fullImage Bild der vollen Leiste.
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
     * Prueft, ob ein Bild vollstaendig geladen ist.
     * @param {HTMLImageElement} image Bild.
     * @returns {boolean} Ladestatus.
     */
    isLoaded(image) {
        return image.complete && image.naturalWidth > 0;
    }

    /**
     * Ordnet den Prozentwert einem der sechs Statusbilder zu.
     * @returns {number} Bildindex von 0 bis 5.
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
