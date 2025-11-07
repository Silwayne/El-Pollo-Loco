/**
 * Main UI rendering controller for the game world
 * Handles all canvas drawing operations including game objects, status bars, and end-game screens
 * Manages the game state visualization and user interface elements
 * @class
 */
class WorldUI {
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
    this.canvas = world.canvas;
    this.gameOverUI = new WorldUIGameOver(this);
  }

  /**
   * Main drawing method that orchestrates the entire rendering process
   * Clears canvas and draws either game objects or end-game screens
   * @returns {void}
   */
  draw() {
    this.clearAndDrawBackground();
    this.drawMainOrOverlay();
  }

  /**
   * Checks if touch buttons should be displayed
   * @returns {boolean} True if touch buttons should be shown
   */
  shouldShowTouchButtons() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  /**
   * Clears the canvas and draws background elements
   * @returns {void}
   */
  clearAndDrawBackground() {
    this.clearCanvas();
    this.drawBackgroundObjects();
  }

  /**
   * Clears the entire canvas for fresh rendering
   * @returns {void}
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws background objects with camera translation
   * Applies camera movement to create parallax effect
   * @returns {void}
   */
  drawBackgroundObjects() {
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToCanvas(this.world.level.backgroundObjects);
    this.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Determines what to draw based on game state
   * Shows game over, win screen, or normal game objects
   * @returns {void}
   */
  drawMainOrOverlay() {
    if (this.world.character.isDead()) {
      this.showGameOver();
    } else if (this.isEndbossDead()) {
      this.showGameWin();
    } else {
      this.drawGameObjects();
    }
  }

  /**
   * Displays the game over screen
   * @returns {void}
   */
  showGameOver() {
    this.gameOverUI.drawGameOverImage();
  }

  /**
   * Displays the game win screen
   * @returns {void}
   */
  showGameWin() {
    this.gameOverUI.drawGameWinImage();
  }

  /**
   * Checks if the end boss is defeated
   * @returns {boolean} True if end boss exists and is dead
   */
  isEndbossDead() {
    const boss = this.world.level.enemies.find((e) => e instanceof Endboss);
    return boss && boss.isDead;
  }

  /**
   * Draws all active game objects and status bars
   * @returns {void}
   */
  drawGameObjects() {
    this.drawWorldObjects();
    this.drawStatusBars();
  }

  /**
   * Draws all world entities with camera translation
   * @returns {void}
   */
  drawWorldObjects() {
    this.ctx.translate(this.world.camera_x, 0);
    this.drawAllWorldEntities();
    this.ctx.translate(-this.world.camera_x, 0);
  }

  /**
   * Draws all entities in the game world in proper z-order
   * @returns {void}
   */
  drawAllWorldEntities() {
    this.addObjectsToCanvas(this.world.level.clouds);
    this.addToCanvas(this.world.character);
    this.addObjectsToCanvas(this.world.level.enemies);
    this.addObjectsToCanvas(this.world.level.bottles);
    this.addObjectsToCanvas(this.world.level.coins);
    this.addObjectsToMap(this.world.throwableObjects);
  }

  /**
   * Draws all status bars (health, bottles, coins, boss health)
   * @returns {void}
   */
  drawStatusBars() {
    this.addToCanvas(this.world.statusBar);
    this.addToCanvas(this.world.bottleBar);
    this.addToCanvas(this.world.coinBar);
    this.addToCanvas(this.world.bossBar);
  }

  /**
   * Draws multiple objects to the canvas
   * @param {Array} objects - Array of drawable objects
   * @returns {void}
   */
  addObjectsToCanvas(objects) {
    objects.forEach((obj) => this.addToCanvas(obj));
  }

  /**
   * Draws multiple objects to the map with transformation handling
   * @param {Array} objects - Array of drawable objects
   * @returns {void}
   */
  addObjectsToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  /**
   * Adds a single object to the canvas (alias for addToMap)
   * @param {Object} obj - The object to draw
   * @returns {void}
   */
  addToCanvas(obj) {
    this.addToMap(obj);
  }

  /**
   * Draws a movable object with directional flipping support
   * Handles both normal and flipped rendering for left/right directions
   * @param {MovableObject} mo - The movable object to draw
   * @returns {void}
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.world.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.world.flipImageBack(mo);
    }
  }

  /**
   * Draws restart and home buttons for end-game screens
   * @returns {void}
   */
  drawRestartAndHomeButtons() {
    const buttonConfig = this.getButtonConfig();
    this.drawRestartButton(buttonConfig);
    this.drawHomeButton(buttonConfig);
  }

  /**
   * Calculates configuration for button positioning and sizing
   * @returns {{centerX: number, btnY: number, btnWidth: number, btnHeight: number, gap: number}} Button configuration object
   */
  getButtonConfig() {
    const centerX = this.canvas.width / 2;
    const btnY = this.canvas.height / 2 + 180;
    const btnWidth = 200;
    const btnHeight = 50;
    const gap = 30;

    return {
      centerX,
      btnY,
      btnWidth,
      btnHeight,
      gap,
    };
  }

  /**
   * Draws the restart game button
   * @param {{centerX: number, btnY: number, btnWidth: number, btnHeight: number, gap: number}} config - Button configuration
   * @returns {void}
   */
  drawRestartButton(config) {
    const restartX = config.centerX - config.btnWidth - config.gap / 2;
    this.drawButton(
      restartX,
      config.btnY,
      config.btnWidth,
      config.btnHeight,
      "New Game"
    );
    this.setRestartButtonArea(
      restartX,
      config.btnY,
      config.btnWidth,
      config.btnHeight
    );
  }

  /**
   * Sets the clickable area for the restart button in the world object
   * @param {number} x - X coordinate of the button
   * @param {number} y - Y coordinate of the button
   * @param {number} width - Width of the button
   * @param {number} height - Height of the button
   * @returns {void}
   */
  setRestartButtonArea(x, y, width, height) {
    this.world.restartButtonArea = {
      x: x,
      y: y,
      width: width,
      height: height,
    };
  }

  /**
   * Draws the home/return button
   * @param {{centerX: number, btnY: number, btnWidth: number, btnHeight: number, gap: number}} config - Button configuration
   * @returns {void}
   */
  drawHomeButton(config) {
    const homeX = config.centerX + config.gap / 2;
    this.drawButton(
      homeX,
      config.btnY,
      config.btnWidth,
      config.btnHeight,
      "Home"
    );
    this.setHomeButtonArea(
      homeX,
      config.btnY,
      config.btnWidth,
      config.btnHeight
    );
  }

  /**
   * Sets the clickable area for the home button in the world object
   * @param {number} x - X coordinate of the button
   * @param {number} y - Y coordinate of the button
   * @param {number} width - Width of the button
   * @param {number} height - Height of the button
   * @returns {void}
   */
  setHomeButtonArea(x, y, width, height) {
    this.world.homeButtonArea = {
      x: x,
      y: y,
      width: width,
      height: height,
    };
  }

  /**
   * Draws a complete button with background, border, and text
   * @param {number} x - X coordinate of the button
   * @param {number} y - Y coordinate of the button
   * @param {number} width - Width of the button
   * @param {number} height - Height of the button
   * @param {string} label - Text label for the button
   * @returns {void}
   */
  drawButton(x, y, width, height, label) {
    this.ctx.save();
    this.drawButtonBackground(x, y, width, height);
    this.drawButtonBorder(x, y, width, height);
    this.drawButtonText(x, y, width, height, label);
    this.ctx.restore();
  }

  /**
   * Draws the button background rectangle
   * @param {number} x - X coordinate of the button
   * @param {number} y - Y coordinate of the button
   * @param {number} width - Width of the button
   * @param {number} height - Height of the button
   * @returns {void}
   */
  drawButtonBackground(x, y, width, height) {
    this.ctx.fillStyle = "#a0220a";
    this.ctx.fillRect(x, y, width, height);
  }

  /**
   * Draws the button border
   * @param {number} x - X coordinate of the button
   * @param {number} y - Y coordinate of the button
   * @param {number} width - Width of the button
   * @param {number} height - Height of the button
   * @returns {void}
   */
  drawButtonBorder(x, y, width, height) {
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);
  }

  /**
   * Draws the button text centered within the button
   * @param {number} x - X coordinate of the button
   * @param {number} y - Y coordinate of the button
   * @param {number} width - Width of the button
   * @param {number} height - Height of the button
   * @param {string} label - Text to display on the button
   * @returns {void}
   */
  drawButtonText(x, y, width, height, label) {
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(label, x + width / 2, y + height / 2);
  }
}
