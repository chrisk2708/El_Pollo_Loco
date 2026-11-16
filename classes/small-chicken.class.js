import { ImageHub } from "./img-hub.class.js";
import { Chicken } from "./normal-chicken.class.js";

/** Small, faster variant of the standard enemy. */
export class SmallChicken extends Chicken {
    y = 385;
    height = 30;
    width = 30;

    /** Creates a small chicken with its own images and a slightly higher speed. */
    constructor() {
        super(ImageHub.SMALL_CHICKEN);
        this.speed += 0.3;
    }
}
