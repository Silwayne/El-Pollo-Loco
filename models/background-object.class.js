/**
 * Represents a background object in the game world
 * Extends MovableObject to inherit basic rendering and transformation capabilities
 * Used for creating parallax scrolling background layers
 * @class
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  /**
   * Fixed width of the background object in pixels
   * @type {number}
   */
  width = 720;

  /**
   * Fixed height of the background object in pixels  
   * @type {number}
   */
  height = 480;

  /**
   * Creates a BackgroundObject instance
   * @param {string} imagePath - Path to the background image file
   * @param {number} x - Horizontal position in the game world
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}