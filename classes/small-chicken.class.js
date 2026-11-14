import { ImageHub } from "./img-hub.class.js";
import { Chicken } from "./normal-chicken.class.js";

/** Kleine, schnellere Variante des Standardgegners. */
export class SmallChicken extends Chicken {
    y = 385;
    height = 30;
    width = 30;

    /** Erzeugt ein kleines Huhn mit eigenen Bildern und etwas hoeherer Geschwindigkeit. */
    constructor() {
        super(ImageHub.SMALL_CHICKEN);
        this.speed += 0.3;
    }
}
