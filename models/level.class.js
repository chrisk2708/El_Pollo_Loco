export class Level {
    enemies;
    subjects;
    clouds;
    backgroundObjects;
    level_end_x = 5160;

    constructor(enemies, subjects, clouds, backgroundObjects) {
        this.enemies = enemies;
        this.subjects = subjects;
        this.clouds = clouds;
        this.backgroundObjects = backgroundObjects;
    }
}