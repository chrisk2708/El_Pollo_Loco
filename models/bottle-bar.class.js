import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./img-hub.class.js";

export class BottleBar extends DrawableObject {

percentage = 0;
IMAGES = ImageHub.STATUSBAR.bottles;

constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 0;
    this.y = 0;
    this.width = 200;
    this.height = 50;
    this.setPercentage(0);
}

setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
}

resolveImageIndex() {
        if (this.percentage > 80) {
            return 5;
        } else if (this.percentage > 60) {
            return 4;
        } else if (this.percentage > 40) {
            return 3;
        } else if (this.percentage > 20) {
            return 2;
        } else if (this.percentage > 0) {
            return 1;
        } else {
            return 0;
        }
    }
}