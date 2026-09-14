import { MoveableObject } from "./moveable-object.class.js";

/** Statisches beziehungsweise scrollendes Hintergrundbild eines Levelabschnitts. */
export class BackgroundObject extends MoveableObject {

    x;
    y = 0;
    width = 960;
    height = 480;

    static xPos = -960;
    static turn = 0;

    /** Erzeugt ein Hintergrundobjekt an einer Weltposition. @param {string} path Bildpfad. @param {number} x Horizontale Position. */
    constructor(path, x) {
        super();
        this.x = x;
        super.loadImage(path);
    }
}