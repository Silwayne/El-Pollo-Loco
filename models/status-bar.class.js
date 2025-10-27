/**
 * Base class for all status bar UI elements displaying percentage-based information
 * Provides visual representation of game states like health, resources, and progress
 * Uses discrete image states for performance and consistent visual feedback
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /**
   * Current percentage value displayed by the status bar (0-100)
   * @type {number}
   */
  percentage = 100;

  /**
   * Array of image paths representing different percentage states
   * Green-colored health bar images in 20% increments
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
  ];

  /**
   * Creates a StatusBar instance with default position and full percentage
   * Preloads all status bar images for smooth visual updates
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 10;
    this.y = 0;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Updates the status bar percentage and refreshes the displayed image
   * Automatically selects the appropriate visual state based on percentage value
   * @param {number} percentage - The new percentage value (0-100)
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the appropriate image index based on current percentage
   * Uses discrete thresholds for clear visual state transitions
   * @returns {number} Index of the image in IMAGES array (0-5)
   */
  resolveImageIndex() {
    if (this.percentage == 100) return 5;
    if (this.percentage > 80) return 4;
    if (this.percentage > 60) return 3;
    if (this.percentage > 40) return 2;
    if (this.percentage > 20) return 1;
    return 0;
  }
}