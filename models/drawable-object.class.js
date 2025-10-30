/**
 * Base class for all drawable objects in the game
 * Provides fundamental rendering, image loading, and collision visualization capabilities
 * Serves as the foundation for all visual game entities
 * @class
 */
class DrawableObject {
  /** @type {HTMLImageElement} */ img;
  /** @type {Object<string, HTMLImageElement>} */ imageCache = {};
  /** @type {number} */ currentImage = 0;
  /** @type {number} */ x = 120;
  /** @type {number} */ y = 280;
  /** @type {number} */ height = 150;
  /** @type {number} */ width = 100;

  /**
   * Loads a single image from the specified path
   * @param {string} path - The file path to the image
   * @returns {void}
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Preloads multiple images into the image cache
   * Essential for smooth animation playback
   * @param {string[]} arr - Array of image paths to load
   * @returns {void}
   */
  loadImages(arr) {
    arr.forEach((path) => {
      this.loadSingleImage(path);
    });
  }

  /**
   * Loads a single image into the image cache
   * @param {string} path - The file path to the image
   * @returns {void}
   */
  loadSingleImage(path) {
    let img = new Image();
    img.src = path;
    this.imageCache[path] = img;
  }

  /**
   * Draws the object onto the canvas context
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @returns {void}
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws collision frame for debugging purposes
   * Currently disabled but structure ready for development
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @returns {void}
   */
  drawFrame(ctx) {
    if (this.shouldDrawFrame()) {
      this.drawCollisionBox(ctx);
    }
  }

  /**
   * Determines if collision frame should be drawn
   * Currently targets Character, Chicken, and Endboss for debugging
   * @returns {boolean} True if collision frame should be drawn
   */
  shouldDrawFrame() {
    return (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof LittleChicken ||
      this instanceof Endboss ||
      this instanceof Bottle ||
      this instanceof Coin
    );
  }

  /**
   * Draws collision box visualization for debugging
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @returns {void}
   */
  drawCollisionBox(ctx) {
    if (this.getCollisionBox) {
      const box = this.getCollisionBox();
      this.setupCollisionBox(ctx);
      this.drawCollisionPath(ctx, box);
    }
  }

  /**
   * Draws the collision path for visualization
   * Currently commented out but ready for debug activation
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {{x: number, y: number, width: number, height: number}} box - The collision box to draw
   * @returns {void}
   */
  drawCollisionPath(ctx, box) {
    // Zum Debuggen Kollisionsboxen anzeigen:
    // ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();
  }

  setupCollisionBox(ctx) {
    ctx.beginPath();
    ctx.lineWidth = "2";

    if (this instanceof Coin || this instanceof Bottle) {
      ctx.strokeStyle = "yellow";
    } else if (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof LittleChicken ||
      this instanceof Endboss
    ) {
      ctx.strokeStyle = "red";
    }
  }
}
