/**
 * Unified status bar system for all game UI elements
 * Handles health, coins, bottles, and boss health with different behaviors
 * @class
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  percentage = 100;
  barType = "health";

  IMAGES = {
    health: [
      "img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
      "img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
    ],
    coin: [
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
      "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
    ],
    bottle: [
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/40.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/60.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/80.png",
      "img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/100.png",
    ],
    boss: [
      "img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange40.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange60.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange80.png",
      "img/7_statusbars/2_statusbar_endboss/orange/orange100.png",
    ],
  };

  /**
   * Creates a new status bar
   * @param {string} type - Type of status bar ('health', 'coin', 'bottle', 'boss')
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} initialValue - Starting value (count or percentage)
   */
  constructor(type, x, y, initialValue = null) {
    super();
    this.barType = type;

    const imageArray = this.IMAGES[type];
    this.loadImages(imageArray);

    this.x = x;
    this.y = y;
    this.width = 200;
    this.height = 60;

    if (initialValue !== null) {
      this.setPercentage(initialValue);
    } else {
      const startValue = type === "health" || type === "boss" ? 100 : 0;
      this.setPercentage(startValue);
    }
  }

  /**
   * Updates the status bar percentage and refreshes the displayed image
   * Handles different value types (direct percentage vs item count)
   * @param {number} value - The new value (percentage 0-100 or item count 0-5)
   * @returns {void}
   */
  setPercentage(value) {
    if (this.barType === "coin" || this.barType === "bottle") {
      this.percentage = (value / 5) * 100;
    } else {
      this.percentage = value;
    }

    let path = this.IMAGES[this.barType][this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Resolves the appropriate image index based on current percentage
   * Uses discrete thresholds for clear visual state transitions
   * @returns {number} Index of the image in IMAGES array (0-5)
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  /**
   * Factory method to create specific status bar types with predefined positions
   * @param {string} type - Type of status bar to create
   * @returns {StatusBar} Configured status bar instance
   */
  static create(type) {
    switch (type) {
      case "health":
        return new StatusBar("health", 10, 0, 100);
      case "coin":
        return new StatusBar("coin", 10, 100, 0);
      case "bottle":
        return new StatusBar("bottle", 10, 50, 0);
      case "boss":
        return new StatusBar("boss", 500, 20, 100);
      default:
        return new StatusBar("health", 10, 0, 100);
    }
  }
}
