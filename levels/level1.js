import { Chicken } from "../models/normal-chicken.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Level } from "../models/level.class.js";
import { SmallChicken } from "../models/small-chicken.class.js";
import { Coin } from "../models/coin.class.js";
import { SalsaBottle } from "../models/salsa-bottle.class.js";

export const level1 = new Level(
    
    8,
    [
        new Chicken(1), new Chicken(2), new Chicken(3), new SmallChicken(4),
        new SmallChicken(5), new SmallChicken(6), new Endboss(7)
    ],

    [
        new Coin(300, 200), new Coin(350, 150), new Coin(400, 100), new Coin(450, 150), new Coin(700, 100),
        new Coin(800, 200), new Coin(900, 250), new Coin(1300, 100), new Coin(1300, 250),
        new SalsaBottle(400, 370), new SalsaBottle(450, 370), new SalsaBottle(750, 370),new SalsaBottle(800, 370),
        new SalsaBottle(1000, 370), new SalsaBottle(1200, 370)
    ],

    

);