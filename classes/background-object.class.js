import { MoveableObject } from "./moveable-object.class.js";

/** Static or scrolling background image of a level section. */
export class BackgroundObject extends MoveableObject {

    x;
    y = 0;
    width = 960;
    height = 480;

    static xPos = -960;
    static turn = 0;

    /** Creates a background object at a world position. @param {string} path Image path. @param {number} x Horizontal position. */
    constructor(path, x) {
        super();
        this.x = x;
        super.loadImage(path);
    }
}