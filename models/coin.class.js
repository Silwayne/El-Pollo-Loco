/**
 * Represents a collectible coin item in the game world
 * Can appear either on the ground or floating in the air
 * Extends DrawableObject for basic rendering capabilities
 * Provides visual feedback for player progression and scoring
 * @class
 * @extends DrawableObject
 */
class Coin extends DrawableObject {
  /** @type {number} */ width = 100;
  /** @type {number} */ height = 100;

  /**
   * Image path for coins placed on the ground
   * Uses the same coin image but positioned at ground level
   * @type {string[]}
   */
  IMAGES_GROUND = ["img/8_coin/coin_1.png"];

  /**
   * Image path for coins floating in the air
   * Uses the same coin image but positioned at floating height
   * @type {string[]}
   */
  IMAGES_AIR = ["img/8_coin/coin_1.png"];

  /**
   * Creates a Coin instance with specified type
   * @param {string} type - The coin type: "ground" or "air"
   */
  constructor(type) {
    super();
    this.initializeCoin(type);
  }

  /**
   * Initializes the coin based on its type
   * Sets appropriate position and loads image
   * @param {string} type - The coin type: "ground" or "air"
   * @returns {void}
   */
  initializeCoin(type) {
    this.setCoinType(type);
    this.setRandomPosition();
  }

  /**
   * Configures the coin based on its type
   * @param {string} type - The coin type: "ground" or "air"
   * @returns {void}
   */
  setCoinType(type) {
    if (type === "ground") {
      this.setGroundCoin();
    } else {
      this.setAirCoin();
    }
  }

  /**
   * Configures the coin as a ground coin
   * Uses ground image and positions at ground level
   * @returns {void}
   */
  setGroundCoin() {
    this.loadImage(this.IMAGES_GROUND[0]);
    this.y = 340;
  }

  /**
   * Configures the coin as an air coin
   * Uses air image and positions at floating height
   * @returns {void}
   */
  setAirCoin() {
    this.loadImage(this.IMAGES_AIR[0]);
    this.y = 70;
  }

  /**
   * Defines the collision box for coin interactions
   * @returns {{x: number, y: number, width: number, height: number}} Collision box
   */
  getCollisionBox() {
  return {
    x: this.x + 30,    
    y: this.y + 30,    
    width: this.width - 60,  
    height: this.height - 60 
  };
}

  /**
   * Sets a random horizontal position for the coin
   * Positions between 400 and 2400 pixels from the start
   * Creates varied coin placement throughout the level
   * @returns {void}
   */
  setRandomPosition() {
    this.x = 400 + Math.random() * 1900;
  }
}