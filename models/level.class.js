class Level {
    enemies;
    clouds;
    bottles;
    backgroundObjects;
    level_end_x = 2250;

    constructor(enemies, clouds, bottles, backgroundObjects) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.bottles = bottles;
        this.backgroundObjects = backgroundObjects;
    }
}