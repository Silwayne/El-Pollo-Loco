/**
 * Represents a cloud background element in the game world
 * Provides atmospheric depth and visual interest through parallax movement
 * Extends MovableObject for basic movement capabilities
 * @class
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  y = 20;
  width = 500;
  height = 250;

  constructor() {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.initializeCloud();
    this.animate();
  }

  /**
   * Initializes cloud properties including random positioning
   * @returns {void}
   */
  initializeCloud() {
    this.setRandomPosition();
  }

  /**
   * Sets random horizontal position within the level
   * Positions between 200 and 2200 pixels from the start
   * Creates natural cloud distribution throughout the sky
   * @returns {void}
   */
  setRandomPosition() {
    this.x = 200 + Math.random() * 2000;
  }

  /**
   * Starts all cloud animation and movement loops
   * @returns {void}
   */
  animate() {
    this.startCloudMovement();
  }

  /**
   * Starts the cloud movement processing loop (60 FPS)
   * @returns {void}
   */
  startCloudMovement() {
    setInterval(() => {
      this.moveCloud();
    }, 1000 / 60);
  }

  /**
   * Handles cloud movement - slowly drifts left for parallax effect
   * Uses inherited moveLeft() method with default speed
   * @returns {void}
   */
  moveCloud() {
    this.moveLeft();
  }
}
