/**
 * Mobile UI button handler
 * Processes all UI button interactions for mobile and desktop
 * @namespace MobileUI
 */
let MobileUI = {
  /**
   * Checks and handles UI button clicks at given coordinates
   * Processes help, start screen, and game end buttons
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if a UI button was clicked and handled
   */
  checkUIButtonsAt(x, y) {
    if (this.handleHelpCloseButton(x, y)) return true;
    if (this.handleStartScreenButtons(x, y)) return true;
    if (this.handleGameEndButtons(x, y)) return true;

    return false;
  },

  /**
   * Determines if mobile controls should be active
   * @returns {boolean} True if touch controls should be enabled
   */
  shouldBeActive() {
    return this.isTouchDevice();
  },

  /**
   * Detects touch-capable devices
   * @returns {boolean} True if device supports touch input
   */
  isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  },

  /**
   * Checks if mobile controls are fully enabled and ready
   * @returns {boolean} True if controls are active and components exist
   */
  enabled() {
    return this.canvas && this.world && this.shouldBeActive();
  },

  /**
   * Handles clicks on the help overlay close button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if help close button was clicked
   */
  handleHelpCloseButton(x, y) {
    if (!window.helpCloseButtonArea || !window.showHelpOverlay) return false;

    const c = window.helpCloseButtonArea;
    if (Mobile.isPointInArea(x, y, c)) {
      window.showHelpOverlay = false;
      if (typeof drawStartScreen === "function") drawStartScreen();
      return true;
    }
    return false;
  },

  /**
   * Handles clicks on any start screen button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if any start screen button was clicked
   */
  handleStartScreenButtons(x, y) {
    if (!window.showStartScreen) return false;

    return (
      this.handleSoundButton(x, y) ||
      this.handleStartButton(x, y) ||
      this.handleHelpButton(x, y) ||
      this.handleLegalButton(x, y) ||
      this.handleImprintButton(x, y)
    );
  },

  /**
   * Handles clicks on the sound toggle button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if sound button was clicked
   */
  handleSoundButton(x, y) {
    return this.handleGenericButton(x, y, "soundButtonArea", () => {
      if (typeof toggleSound === "function") toggleSound();
      if (typeof drawStartScreen === "function") drawStartScreen();
    });
  },

  /**
   * Handles clicks on the start game button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if start button was clicked
   */
  handleStartButton(x, y) {
    return this.handleGenericButton(x, y, "startButtonArea", () => {
      if (typeof init === "function") init();
    });
  },

  /**
   * Handles clicks on the help button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if help button was clicked
   */
  handleHelpButton(x, y) {
    return this.handleGenericButton(x, y, "helpButtonArea", () => {
      if (typeof showHelp === "function") {
        showHelp();
      } else {
        window.showHelpOverlay = true;
        if (typeof drawStartScreen === "function") drawStartScreen();
      }
    });
  },

  /**
   * Handles clicks on the legal/privacy button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if legal button was clicked
   */
  handleLegalButton(x, y) {
    return this.handleGenericButton(x, y, "legalButtonArea", () => {
      window.location.href = "datenschutz.html";
    });
  },

  /**
   * Handles clicks on the imprint button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if imprint button was clicked
   */
  handleImprintButton(x, y) {
    return this.handleGenericButton(x, y, "imprintButtonArea", () => {
      window.location.href = "impressum.html";
    });
  },

  /**
   * Generic handler for UI button clicks
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @param {string} areaName - Name of the button area in window object
   * @param {Function} callback - Function to execute when button is clicked
   * @returns {boolean} True if button was clicked and callback executed
   */
  handleGenericButton(x, y, areaName, callback) {
    if (!window[areaName]) return false;

    const area = window[areaName];
    if (Mobile.isPointInArea(x, y, area)) {
      callback();
      return true;
    }
    return false;
  },

  /**
   * Handles clicks on game end buttons (restart and home)
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if any game end button was clicked
   */
  handleGameEndButtons(x, y) {
    return this.handleRestartButton(x, y) || this.handleHomeButton(x, y);
  },

  /**
   * Handles clicks on the restart game button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if restart button was clicked
   */
  handleRestartButton(x, y) {
    if (!Mobile.world || !Mobile.world.restartButtonArea) return false;

    const r = Mobile.world.restartButtonArea;
    if (Mobile.isPointInArea(x, y, r)) {
      if (typeof restartGame === "function") restartGame();
      return true;
    }
    return false;
  },

  /**
   * Handles clicks on the home/return button
   * @param {number} x - Canvas X coordinate
   * @param {number} y - Canvas Y coordinate
   * @returns {boolean} True if home button was clicked
   */
  handleHomeButton(x, y) {
    if (!Mobile.world || !Mobile.world.homeButtonArea) return false;

    const ho = Mobile.world.homeButtonArea;
    if (Mobile.isPointInArea(x, y, ho)) {
      location.reload();
      return true;
    }
    return false;
  },
};

MobileUI.isPointInArea = Mobile.isPointInArea;
