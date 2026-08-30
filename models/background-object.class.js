import { MoveableObject } from "./moveable-object.class.js";

export class BackgroundObject extends MoveableObject {

    x;
    y = 0;
    width = 720;
    height = 480;

    static xPos = -720;
    static turn = 0;

    constructor(path) {
        if (BackgroundObject.turn === 4) {
            BackgroundObject.xPos += 720;
            BackgroundObject.turn = 0;
        }

        super();
        super.loadImage(path);
        this.x = BackgroundObject.xPos;
        BackgroundObject.turn++;
    }
}