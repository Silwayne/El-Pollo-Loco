/**
 * Represents the bottle collection status bar for the player
 * Extends StatusBar to visualize the current bottle inventory
 * Displays bottle count as a percentage-based orange status bar
 * Tracks collection progress from 0 to 5 bottles maximum
 * @class
 * @extends StatusBar
 */
class BottleBar extends StatusBar {
  /**
   * Creates a BottleBar instance
   * Initializes position, size, and sets initial bottle count to 0
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 10;
    this.y = 50;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Array of image paths representing different bottle collection states
   * Orange-colored bottle status bar images in 20% increments
   * Corresponds to 0-5 bottles in inventory
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
  ];

  /**
   * Updates the bottle count and refreshes the displayed image
   * Converts bottle count to percentage based on maximum of 5 bottles
   * @param {number} bottleCount - Current number of bottles collected (0-5)
   * @returns {void}
   */
  setPercentage(bottleCount) {
    this.percentage = (bottleCount / 5) * 100;

    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the appropriate image index based on current bottle percentage
   * Uses discrete thresholds for visual state transitions
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