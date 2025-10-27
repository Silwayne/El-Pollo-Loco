/**
 * Global mouse position tracking
 * @type {{x: number, y: number}}
 */
let mousePos = { x: 0, y: 0 };

/**
 * Canvas element for game rendering
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Main game world instance
 * @type {World}
 */
let world;

/**
 * Keyboard input handler instance
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Sound preference loaded from localStorage
 * Defaults to true if not explicitly set to false
 * @type {boolean}
 */
window.soundOn = localStorage.getItem("soundOn") !== "false";

/**
 * Initializes the game when window finishes loading
 * Sets up canvas, controls, event listeners and displays start screen
 * @returns {void}
 */
window.addEventListener("load", function () {
  initializeCanvas();
  setupMobileControls();
  setupMouseTracking();
  setupEventListeners();
  drawStartScreen();
});

/**
 * Initializes the canvas and 2D rendering context
 * Must be called before any drawing operations
 * @returns {void}
 */
function initializeCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
}

/**
 * Sets up mobile-specific controls if Mobile class is available
 * @returns {void}
 */
function setupMobileControls() {
  if (typeof Mobile !== "undefined") {
    Mobile.init(canvas, null);
  }
}

/**
 * Sets up mouse position tracking and cursor updates
 * @returns {void}
 */
function setupMouseTracking() {
  canvas.addEventListener("mousemove", (e) => {
    updateMousePosition(e);
    updateCursorStyle();
  });
}

/**
 * Updates global mouse position relative to canvas
 * @param {MouseEvent} e - Mouse move event
 * @returns {void}
 */
function updateMousePosition(e) {
  const rect = canvas.getBoundingClientRect();
  mousePos.x = e.clientX - rect.left;
  mousePos.y = e.clientY - rect.top;
}

/**
 * Updates cursor style based on hover state over interactive elements
 * Changes to pointer cursor when hovering over buttons
 * @returns {void}
 */
function updateCursorStyle() {
  const hovering = isAnyButtonHovered();
  canvas.style.cursor = hovering ? "pointer" : "default";
}

/**
 * Checks if mouse is currently hovering over any interactive button
 * @returns {boolean} True if mouse is over any button
 */
function isAnyButtonHovered() {
  return (
    isHelpCloseButtonHovered() ||
    isStartScreenButtonHovered() ||
    isGameEndButtonHovered()
  );
}

/**
 * Checks if mouse is hovering over help overlay close button
 * Only active when help overlay is visible
 * @returns {boolean} True if hovering over help close button
 */
function isHelpCloseButtonHovered() {
  if (!window.showHelpOverlay || !window.helpCloseButtonArea) return false;
  return isPointInArea(mousePos.x, mousePos.y, window.helpCloseButtonArea);
}

/**
 * Checks if mouse is hovering over any start screen button
 * Only active when start screen is visible
 * @returns {boolean} True if hovering over any start screen button
 */
function isStartScreenButtonHovered() {
  if (!window.showStartScreen) return false;
  return (
    isButtonHovered("startButtonArea") ||
    isButtonHovered("soundButtonArea") ||
    isButtonHovered("helpButtonArea") ||
    isButtonHovered("legalButtonArea") ||
    isButtonHovered("imprintButtonArea")
  );
}

/**
 * Checks if mouse is hovering over game end buttons (restart/home)
 * Only active when game has ended and start screen is not shown
 * @returns {boolean} True if hovering over game end buttons
 */
function isGameEndButtonHovered() {
  if (window.showStartScreen) return false;
  return (
    isWorldButtonHovered("restartButtonArea") ||
    isWorldButtonHovered("homeButtonArea")
  );
}

/**
 * Generic function to check if mouse is hovering over a window-level button area
 * @param {string} areaName - Name of the button area in window object
 * @returns {boolean} True if hovering over the specified button area
 */
function isButtonHovered(areaName) {
  return (
    window[areaName] && isPointInArea(mousePos.x, mousePos.y, window[areaName])
  );
}

/**
 * Generic function to check if mouse is hovering over a world-level button area
 * @param {string} areaName - Name of the button area in world object
 * @returns {boolean} True if hovering over the specified world button area
 */
function isWorldButtonHovered(areaName) {
  return (
    world &&
    world[areaName] &&
    isPointInArea(mousePos.x, mousePos.y, world[areaName])
  );
}

/**
 * Sets up main canvas click event listener
 * @returns {void}
 */
function setupEventListeners() {
  canvas.addEventListener("click", handleCanvasClick);
}
