import { MoveableObject } from "./moveable-object.class.js";

export class BackgroundObject extends MoveableObject {

    x;
    y = 0;
    width = 960;
    height = 480;

    static xPos = -960;
    static turn = 0;

    constructor(path, x) {
        // if (BackgroundObject.turn === 4) {
        //     BackgroundObject.xPos += 960;
        //     BackgroundObject.turn = 0;
        // }

        super();
        this.x = x;
        super.loadImage(path);
        // this.x = BackgroundObject.xPos;
        // BackgroundObject.turn++;
    }
}