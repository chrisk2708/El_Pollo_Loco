import { Chicken } from "../models/normal-chicken.class.js";
import { Endboss } from "../models/endboss.class.js";
import { Level } from "../models/level.class.js";
import { SmallChicken } from "../models/small-chicken.class.js";
import { Coin } from "../models/coin.class.js";
import { SalsaBottle } from "../models/salsa-bottle.class.js";

/** Erstellt die konkrete Gegner- und Sammelobjektkonfiguration fuer Level 1. @returns {Level} Vollstaendig initialisiertes Level. */
export function level1() {
    return new Level(
    
    4,
    [
        new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(),
        new Chicken(), new Chicken(), new Chicken(), new Chicken(), new Chicken(),
        new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(),
        new SmallChicken(), new SmallChicken(), new SmallChicken(), new SmallChicken(),
        new Endboss()
    ],

    [
        new Coin(300, 200), new Coin(350, 150), new Coin(400, 100), new Coin(450, 150), new Coin(700, 100),
        new Coin(800, 200), new Coin(900, 250), new Coin(1300, 100), new Coin(1300, 250),
        new Coin(1400, 200), new Coin(1450, 150), new Coin(1500, 100), new Coin(1700, 300), new Coin(1700, 250),
        new Coin(1800, 300), new Coin(1850, 250), new Coin(1900, 200), new Coin(1950, 250),
        new SalsaBottle(400, 370), new SalsaBottle(450, 370), new SalsaBottle(750, 370),
        new SalsaBottle(800, 370), new SalsaBottle(1000, 370), new SalsaBottle(1200, 370),
        new SalsaBottle(1250, 370), new SalsaBottle(1270, 370), new SalsaBottle(1300, 370),
        new SalsaBottle(1500, 370), new SalsaBottle(1550, 370), new SalsaBottle(1600, 370)
    ],
);
}