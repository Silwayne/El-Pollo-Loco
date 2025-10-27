/**
 * Represents the health bar for the end boss character
 * Extends StatusBar to inherit percentage-based health visualization
 * Displays boss health in 6 discrete states with orange-colored indicators
 * @class
 * @extends StatusBar
 */
class BossBar extends StatusBar {
  /**
   * Creates a BossBar instance
   * Initializes position, size, and sets initial health to 100%
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 500;
    this.y = 20;
    this.width = 200;
    this.height = 60;
    this.setPercentage(100);
  }

  /**
   * Array of image paths representing different health states
   * Orange-colored status bar images in 20% increments
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
    "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
  ];

  /**
   * Updates the health percentage and refreshes the displayed image
   * @param {number} percentage - Current health percentage (0-100)
   * @returns {void}
   */
  setPercentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the appropriate image index based on current health percentage
   * Uses discrete thresholds for health state transitions
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