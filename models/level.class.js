/**
 * Represents a game level containing all game objects and environment elements
 * Serves as a container and organizer for all entities in a specific level
 * Defines the playable area and object placement for the game world
 * @class
 */
class Level {
  enemies;
  clouds;
  bottles;
  coins;
  backgroundObjects;
  level_end_x = 2250;

  /**
   * Creates a Level instance with all game objects
   * @param {Array} enemies - Array of enemy objects (chickens, endboss)
   * @param {Array} clouds - Array of cloud objects for atmospheric background
   * @param {Array} bottles - Array of collectible bottle objects
   * @param {Array} coins - Array of collectible coin objects
   * @param {Array} backgroundObjects - Array of background layer objects for parallax effect
   */
  constructor(enemies, clouds, bottles, coins, backgroundObjects) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.bottles = bottles;
    this.coins = coins;
    this.backgroundObjects = backgroundObjects;
  }
}
