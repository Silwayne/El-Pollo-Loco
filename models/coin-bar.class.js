/**
 * Represents the coin collection status bar for the player
 * Extends StatusBar to visualize the current coin inventory
 * Displays coin count as a percentage-based blue status bar
 * Tracks collection progress from 0 to 5 coins maximum
 * @class
 * @extends StatusBar
 */
class CoinBar extends StatusBar {
  /**
   * Creates a CoinBar instance
   * Initializes position, size, and sets initial coin count to 0
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 10;
    this.y = 100;
    this.width = 200;
    this.height = 60;
    this.setPercentage(0);
  }

  /**
   * Array of image paths representing different coin collection states
   * Blue-colored coin status bar images in 20% increments
   * Corresponds to 0-5 coins in inventory
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /**
   * Updates the coin count and refreshes the displayed image
   * Converts coin count to percentage based on maximum of 5 coins
   * @param {number} coinCount - Current number of coins collected (0-5)
   * @returns {void}
   */
  setPercentage(coinCount) {
    this.percentage = (coinCount / 5) * 100;

    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the appropriate image index based on current coin percentage
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