import { Chicken } from "../classes/normal-chicken.class.js";
import { Endboss } from "../classes/endboss.class.js";
import { Level } from "../classes/level.class.js";
import { SmallChicken } from "../classes/small-chicken.class.js";
import { Coin } from "../classes/coin.class.js";
import { SalsaBottle } from "../classes/salsa-bottle.class.js";

const COIN_POSITIONS = [
    [300, 200], [350, 150], [400, 100], [450, 150], [700, 100], [800, 200], [900, 250],
    [1300, 100], [1300, 250], [1400, 200], [1450, 150], [1500, 100], [1700, 300], [1700, 250],
    [1800, 300], [1850, 250], [1900, 200], [1950, 250]
];

const BOTTLE_X_POSITIONS = [400, 450, 750, 800, 1000, 1200, 1250, 1270, 1300, 1500, 1550, 1600];

/**
 * Creates all enemies for level 1.
 * @returns {Array<Chicken|SmallChicken|Endboss>} List of enemies.
 */
function createEnemies() {
    const chickens = Array.from({ length: 10 }, () => new Chicken());
    const smallChickens = Array.from({ length: 8 }, () => new SmallChicken());
    return [...chickens, ...smallChickens, new Endboss()];
}


/**
 * Creates all coins and bottles for level 1.
 * @returns {Array<Coin|SalsaBottle>} Collectible objects.
 */
function createCollectibles() {
    const coins = COIN_POSITIONS.map(([x, y]) => new Coin(x, y));
    const bottles = BOTTLE_X_POSITIONS.map(x => new SalsaBottle(x, 370));
    return [...coins, ...bottles];
}


/**
 * Creates the concrete enemy and collectible configuration for level 1.
 * @returns {Level} Fully initialized level.
 */
export function level1() {
    return new Level(4, createEnemies(), createCollectibles());
}
