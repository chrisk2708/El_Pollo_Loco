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

    /** Laedt das aktuelle Einzelbild aus einem Asset-Pfad. @param {string} path Bildpfad. @returns {void} */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /** Laedt mehrere Bilder vor und speichert sie im Cache. @param {string[]} arr Asset-Pfade. @returns {void} */
    loadImages(arr) {
        arr.forEach(path => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /** Zeichnet das aktuelle Bild auf den Canvas. @param {CanvasRenderingContext2D} ctx Zeichenkontext. */
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

    /** Wechselt zyklisch zum naechsten Bild einer Animation. @param {string[]} images Animationspfade. */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

}