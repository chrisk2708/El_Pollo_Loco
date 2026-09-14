import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

/** Zeigt einen prozentualen Spielwert mit dem passenden Statusleistenbild an. */
export class StatusBar extends DrawableObject {

    percentage;
    images = [];

    /** Erzeugt eine Statusleiste fuer einen Asset-Typ und Startwert. @param {string} type Statusleisten-Schluessel. @param {number} x Horizontale Position. @param {number} y Vertikale Position. @param {number} percentage Anfangswert. */
    constructor(type, x, y, percentage = 100) {
        super();
        this.images = ImageHub.STATUSBAR[type]
        this.loadImages(ImageHub.STATUSBAR[type]);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 50;
        this.setPercentage(percentage);
    }

    /** Aktualisiert Wert und angezeigtes Bild. @param {number} percentage Neuer Prozentwert. */
    setPercentage(percentage) {
        this.percentage = percentage;
        let path = this.images[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /** Ordnet den Prozentwert einem der sechs Statusbilder zu. @returns {number} Bildindex von 0 bis 5. */
    resolveImageIndex() {
        if (this.percentage >= 100) return 5;
        if (this.percentage > 80) return 4;
        if (this.percentage > 60) return 3;
        if (this.percentage > 40) return 2;
        if (this.percentage > 20) return 1;
        return 0;
    }
}