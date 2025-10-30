/**
 * Represents a collectible bottle item in the game world
 * Can appear either on the ground or floating in the air
 * Extends DrawableObject for basic rendering capabilities
 * @class
 * @extends DrawableObject
 */
class Bottle extends DrawableObject {
  /**
   * Fixed height of the bottle in pixels
   * @type {number}
   */
  height = 100;

  /**
   * Image path for bottles placed on the ground
   * Shows bottle lying horizontally as if placed on surface
   * @type {string[]}
   */
  IMAGES_GROUND = ["img/6_salsa_bottle/1_salsa_bottle_on_ground.png"];

  /**
   * Image path for bottles floating in the air
   * Shows bottle standing upright as if hovering
   * @type {string[]}
   */
  IMAGES_AIR = ["img/6_salsa_bottle/salsa_bottle.png"];

  /**
   * Creates a Bottle instance with specified type
   * @param {string} type - The bottle type: "ground" or "air"
   */
  constructor(type) {
    super();
    this.initializeBottle(type);
  }

  /**
   * Initializes the bottle based on its type
   * Sets appropriate image and position
   * @param {string} type - The bottle type: "ground" or "air"
   * @returns {void}
   */
  initializeBottle(type) {
    this.setBottleType(type);
    this.setRandomPosition();
  }

  /**
   * Configures the bottle based on its type
   * @param {string} type - The bottle type: "ground" or "air"
   * @returns {void}
   */
  setBottleType(type) {
    if (type === "ground") {
      this.setGroundBottle();
    } else {
      this.setAirBottle();
    }
  }

  /**
   * Configures the bottle as a ground bottle
   * Uses ground image and positions at ground level
   * @returns {void}
   */
  setGroundBottle() {
    this.loadImage(this.IMAGES_GROUND[0]);
    this.y = 340;
  }

  /**
   * Configures the bottle as an air bottle
   * Uses air image and positions at floating height
   * @returns {void}
   */
  setAirBottle() {
    this.loadImage(this.IMAGES_AIR[0]);
    this.y = 50;
  }

  /**
   * Defines the collision box for bottle interactions
   * @returns {{x: number, y: number, width: number, height: number}} Collision box
   */
  getCollisionBox() {
    return {
      x: this.x + 30,
      y: this.y + 10,
      width: this.width - 60,
      height: this.height - 20,
    };
  }

  /**
   * Sets a random horizontal position for the bottle
   * Positions between 400 and 2400 pixels from the start
   * Creates varied bottle placement throughout the level
   * @returns {void}
   */
  setRandomPosition() {
    this.x = 400 + Math.random() * 1900;
  }
}
