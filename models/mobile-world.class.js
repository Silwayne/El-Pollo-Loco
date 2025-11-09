/**
 * Mobile-optimized game world with integrated touch controls
 * Extends the core World class with mobile-specific features and touch input handling
 * Provides responsive button layout and visual feedback for mobile devices
 * @class
 * @extends World
 */
class MobileWorld extends World {
  mobileButtons = [];
  pressedButtons = {};

  shouldShowTouchControls() {
    return this.isTouchDevice();
  }

  /**
   * Determines whether touch control buttons should be displayed
   * Detects touch-capable devices by checking multiple browser touch APIs
   * This method provides comprehensive touch device detection covering:
   * - Modern browsers (ontouchstart)
   * - Standardized touch points API (maxTouchPoints)
   * - Microsoft legacy API (msMaxTouchPoints)
   */
  isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  /**
   * Conditionally draws mobile controls on touch devices
   * @returns {void}
   */
  drawMobileControlsIfNeeded() {
    if (this.world && this.world.paused) return;
    if (this.shouldShowTouchControls() && typeof this.drawMobileControls === "function") {
      this.drawMobileControls();
    }
  }

  /**
   * Sets up mobile control buttons for touch devices
   * Calculates optimal button positions and sizes based on canvas dimensions
   * Creates four circular buttons for movement and actions
   * @returns {void}
   */
  setupMobileButtons() {
    const { w, h } = this.getCanvasDimensions();
    const btnSize = this.calculateButtonSize(h);
    const buttonConfigs = this.getButtonConfigs(w, h, btnSize);

    this.createMobileButtons(buttonConfigs);
  }

  /**
   * Retrieves the current canvas dimensions
   * @returns {{w: number, h: number}} Object containing canvas width and height
   */
  getCanvasDimensions() {
    return { w: this.canvas.width, h: this.canvas.height };
  }

  /**
   * Calculates optimal button size based on canvas height
   * Ensures buttons are responsive and proportional to screen size
   * @param {number} canvasHeight - The height of the canvas
   * @returns {number} Calculated button size in pixels
   */
  calculateButtonSize(canvasHeight) {
    return Math.round(Math.min(80, canvasHeight * 0.12));
  }

  /**
   * Generates configuration for all mobile buttons
   * Positions buttons symmetrically on left and right sides
   * @param {number} canvasWidth - The width of the canvas
   * @param {number} canvasHeight - The height of the canvas
   * @param {number} btnSize - The calculated button size
   * @returns {Array} Array of button configuration objects
   */
  getButtonConfigs(canvasWidth, canvasHeight, btnSize) {
    const margin = 20;
    const gap = 20;

    const bottomY = canvasHeight - btnSize - margin;

    return [
      { key: "THROW", x: margin, y: bottomY, size: btnSize, label: "🧴" },
      { key: "JUMP", x: margin + btnSize + gap, y: bottomY, size: btnSize, label: "⤒" },

      { key: "LEFT", x: canvasWidth - (btnSize * 2 + gap + margin), y: bottomY, size: btnSize, label: "←" },
      { key: "RIGHT", x: canvasWidth - (btnSize + margin), y: bottomY, size: btnSize, label: "→" },
    ];
  }

  /**
   * Creates mobile button objects from configuration
   * @param {Array} buttonConfigs - Array of button configuration objects
   * @returns {void}
   */
  createMobileButtons(buttonConfigs) {
    this.mobileButtons = buttonConfigs.map((config) =>
      this.createMobileButton(
        config.key,
        config.x,
        config.y,
        config.size,
        config.label
      )
    );
  }

  /**
   * Creates a single mobile button object
   * @param {string} key - The action key (LEFT, RIGHT, JUMP, THROW)
   * @param {number} x - The x-coordinate of the button
   * @param {number} y - The y-coordinate of the button
   * @param {number} size - The size of the button
   * @param {string} label - The visual label for the button
   * @returns {{key: string, x: number, y: number, w: number, h: number, label: string}} Button object
   */
  createMobileButton(key, x, y, size, label) {
    return { key, x, y, w: size, h: size, label };
  }

  /**
   * Draws a single mobile button on the canvas
   * @param {{key: string, x: number, y: number, w: number, h: number, label: string}} btn - The button to draw
   * @returns {void}
   */
  drawMobileButton(btn) {
    const ctx = this.ctx;
    ctx.save();
    this.drawButtonBackground(ctx, btn);
    this.drawButtonLabel(ctx, btn);
    ctx.restore();
  }

  /**
   * Draws the circular background for a mobile button
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {{key: string, x: number, y: number, w: number, h: number, label: string}} btn - The button to draw
   * @returns {void}
   */
  drawButtonBackground(ctx, btn) {
    const opacity = this.getButtonOpacity(btn);
    const centerX = btn.x + btn.w / 2;
    const centerY = btn.y + btn.h / 2;
    const radius = btn.w / 2;

    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  /**
   * Determines the opacity of a button based on pressed state
   * Provides visual feedback when buttons are active
   * @param {{key: string, x: number, y: number, w: number, h: number, label: string}} btn - The button to check
   * @returns {number} Opacity value (0.45 for inactive, 0.7 for active)
   */
  getButtonOpacity(btn) {
    return this.pressedButtons && this.pressedButtons[btn.key] ? 0.7 : 0.45;
  }

  /**
   * Draws the label/text on a mobile button
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {{key: string, x: number, y: number, w: number, h: number, label: string}} btn - The button to draw
   * @returns {void}
   */
  drawButtonLabel(ctx, btn) {
    const centerX = btn.x + btn.w / 2;
    const centerY = btn.y + btn.h / 2;

    ctx.fillStyle = "#ffffffff";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(btn.label, centerX, centerY);
  }

  /**
   * Draws all mobile controls on the canvas
   * Ensures buttons exist before drawing
   * @returns {void}
   */
  drawMobileControls() {
    this.ensureButtonsExist();
    this.drawAllButtons();
  }

  /**
   * Ensures mobile buttons are initialized before drawing
   * Creates buttons if they don't exist
   * @returns {void}
   */
  ensureButtonsExist() {
    if (!this.mobileButtons || this.mobileButtons.length === 0) {
      this.setupMobileButtons();
    }
  }

  /**
   * Draws all mobile buttons in sequence
   * @returns {void}
   */
  drawAllButtons() {
    this.mobileButtons.forEach((btn) => {
      this.drawMobileButton(btn);
    });
  }
}
