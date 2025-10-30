/**
 * Start screen background image
 * @type {HTMLImageElement}
 */
let startScreenImg = new Image();

/**
 * Flag indicating whether the start screen image has loaded
 * @type {boolean}
 */
let startScreenImgLoaded = false;

// Load start screen image and set up load handler
startScreenImg.src = "img/9_intro_outro_screens/start/startscreen_1.png";
startScreenImg.onload = function () {
  startScreenImgLoaded = true;
  if (typeof ctx !== "undefined") drawStartScreen();
};

/**
 * Draws the complete start screen with background, buttons, and help overlay
 * Sets global showStartScreen flag and clears canvas before drawing
 * @returns {void}
 */
function drawStartScreen() {
  window.showStartScreen = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (startScreenImgLoaded) {
    this.drawBackgroundImage();
    this.drawAllButtons();
    this.drawHelpOverlay();
  }
}

/**
 * Draws the background image covering the entire canvas
 * @returns {void}
 */
function drawBackgroundImage() {
  ctx.drawImage(startScreenImg, 0, 0, canvas.width, canvas.height);
}

/**
 * Draws all interactive buttons on the start screen
 * @returns {void}
 */
function drawAllButtons() {
  drawStartButton();
  drawSoundButton();
  drawHelpButton();
  drawLegalButton();
  drawImprintButton();
}

/**
 * Draws the main start game button at the top center
 * @returns {void}
 */
function drawStartButton() {
  const buttonConfig = getButtonConfig(260, 60, 40);
  drawButton(buttonConfig, "Start game");
  setButtonArea("startButtonArea", buttonConfig);
}

/**
 * Draws the sound toggle button at the bottom row
 * Button label changes based on current sound state
 * @returns {void}
 */
function drawSoundButton() {
  const buttonConfig = getBottomButtonConfig(0);
  const label = soundOn ? "Sound ON" : "Sound OFF";
  drawButton(buttonConfig, label);
  setButtonArea("soundButtonArea", buttonConfig);
}

/**
 * Draws the help button at the bottom row
 * @returns {void}
 */
function drawHelpButton() {
  const buttonConfig = getBottomButtonConfig(1);
  drawButton(buttonConfig, "Help");
  setButtonArea("helpButtonArea", buttonConfig);
}

/**
 * Draws the legal/privacy button at the bottom row
 * @returns {void}
 */
function drawLegalButton() {
  const buttonConfig = getBottomButtonConfig(2);
  drawButton(buttonConfig, "Legal");
  setButtonArea("legalButtonArea", buttonConfig);
}

/**
 * Draws the imprint button at the bottom row
 * @returns {void}
 */
function drawImprintButton() {
  const buttonConfig = getBottomButtonConfig(3);
  drawButton(buttonConfig, "Imprint");
  setButtonArea("imprintButtonArea", buttonConfig);
}

/**
 * Creates configuration for centered buttons at the top
 * @param {number} width - Button width in pixels
 * @param {number} height - Button height in pixels
 * @param {number} yOffset - Vertical offset from top in pixels
 * @returns {{x: number, y: number, width: number, height: number}} Button configuration object
 */
function getButtonConfig(width, height, yOffset) {
  return {
    x: canvas.width / 2 - width / 2,
    y: yOffset,
    width: width,
    height: height,
  };
}

/**
 * Creates configuration for buttons in the bottom row
 * @param {number} index - Button position index (0-3) for horizontal arrangement
 * @returns {{x: number, y: number, width: number, height: number}} Button configuration object
 */
function getBottomButtonConfig(index) {
  const btnWidth = 150;
  const btnHeight = 40;
  const x = 15 + index * 180;
  const y = canvas.height - 50;

  return { x, y, width: btnWidth, height: btnHeight };
}

/**
 * Draws a complete button with background, border, and text
 * @param {{x: number, y: number, width: number, height: number}} config - Button position and size
 * @param {string} label - Button text label
 * @returns {void}
 */
function drawButton(config, label) {
  ctx.save();
  drawButtonBackground(config);
  drawButtonBorder(config);
  drawButtonText(config, label);
  ctx.restore();
}

/**
 * Draws the button background rectangle
 * @param {{x: number, y: number, width: number, height: number}} config - Button configuration
 * @returns {void}
 */
function drawButtonBackground(config) {
  ctx.fillStyle = "#a0220a";
  ctx.fillRect(config.x, config.y, config.width, config.height);
}

/**
 * Draws the button border
 * @param {{x: number, y: number, width: number, height: number}} config - Button configuration
 * @returns {void}
 */
function drawButtonBorder(config) {
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  ctx.strokeRect(config.x, config.y, config.width, config.height);
}

/**
 * Draws the button text centered within the button
 * @param {{x: number, y: number, width: number, height: number}} config - Button configuration
 * @param {string} label - Text to display on the button
 * @returns {void}
 */
function drawButtonText(config, label) {
  const centerX = config.x + config.width / 2;
  const centerY = config.y + config.height / 2;
  const fontSize = config.width > 200 ? "bold 32px" : "20px";

  ctx.fillStyle = "#fff";
  ctx.font = `${fontSize} Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, centerX, centerY);
}

/**
 * Stores button area coordinates in global window object for click detection
 * @param {string} areaName - Name of the button area property
 * @param {{x: number, y: number, width: number, height: number}} config - Button configuration
 * @returns {void}
 */
function setButtonArea(areaName, config) {
  window[areaName] = {
    x: config.x,
    y: config.y,
    width: config.width,
    height: config.height,
  };
}

/**
 * Shows the help overlay by setting global flag and redrawing start screen
 * @returns {void}
 */
function showHelp() {
  window.showHelpOverlay = true;
  if (typeof drawStartScreen === "function") drawStartScreen();
}

/**
 * Draws the help overlay if it should be visible
 * Includes background, content, and close button
 * @returns {void}
 */
function drawHelpOverlay() {
  if (!window.showHelpOverlay) return;

  const overlayConfig = getOverlayConfig();
  drawOverlayBackground(overlayConfig);
  drawHelpContent(overlayConfig);
  drawCloseButton(overlayConfig);
}

/**
 * Creates configuration for the help overlay dimensions and position
 * @returns {{x: number, y: number, width: number, height: number}} Overlay configuration
 */
function getOverlayConfig() {
  const margin = 40;
  return {
    x: margin,
    y: margin,
    width: canvas.width - margin * 2,
    height: canvas.height - margin * 2,
  };
}

/**
 * Draws the semi-transparent background for the help overlay
 * @param {{x: number, y: number, width: number, height: number}} config - Overlay configuration
 * @returns {void}
 */
function drawOverlayBackground(config) {
  ctx.save();
  ctx.globalAlpha = 0.95;
  ctx.fillStyle = "#111";
  ctx.fillRect(config.x, config.y, config.width, config.height);
  ctx.globalAlpha = 1;
}

/**
 * Draws the help content including title and instructions
 * @param {{x: number, y: number, width: number, height: number}} config - Overlay configuration
 * @returns {void}
 */
function drawHelpContent(config) {
  this.drawHelpTitle(config);
  this.drawHelpInstructions(config);
}

/**
 * Draws the help overlay title
 * @param {{x: number, y: number, width: number, height: number}} config - Overlay configuration
 * @returns {void}
 */
function drawHelpTitle(config) {
  ctx.fillStyle = "#fff";
  ctx.font = "bold 36px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Spielanleitung / Cómo jugar", canvas.width / 2, config.y + 50);
}

/**
 * Draws the game instructions in both German and Spanish
 * @param {{x: number, y: number, width: number, height: number}} config - Overlay configuration
 * @returns {void}
 */
function drawHelpInstructions(config) {
  const instructions = getHelpInstructions();
  const colWidth = config.width / 3;
  const baseY = config.y + 110;

  drawGermanInstructions(instructions.german, config.x, baseY);
  drawSpanishInstructions(instructions.spanish, config.x, colWidth, baseY);
}

/**
 * Returns the game instructions in both German and Spanish
 * @returns {{german: string[], spanish: string[]}} Object containing instruction arrays
 */
function getHelpInstructions() {
  return {
    german: [
      "Steuerung:",
      "• Links bewegen: A",
      "• Rechts bewegen: D",
      "• Springen: W",
      "• Flasche werfen: E",
      "",
      "Tippe 'Schließen' um zurückzukehren.",
    ],
    spanish: [
      "Controles:",
      "• Mover a la izquierda: A",
      "• Mover a la derecha: D",
      "• Saltar: W",
      "• Lanzar botella: E",
      "",
      "Toca 'Cerrar' para volver.",
    ],
  };
}

/**
 * Draws German instructions in the left column
 * @param {string[]} lines - Array of instruction lines
 * @param {number} x - Starting X position
 * @param {number} baseY - Starting Y position
 * @returns {void}
 */
function drawGermanInstructions(lines, x, baseY) {
  ctx.font = "18px Arial";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";

  let currentY = baseY;
  for (let line of lines) {
    ctx.fillText(line, x + 30, currentY);
    currentY += 28;
  }
}

/**
 * Draws Spanish instructions in the right column
 * @param {string[]} lines - Array of instruction lines
 * @param {number} x - Starting X position
 * @param {number} colWidth - Width of each column
 * @param {number} baseY - Starting Y position
 * @returns {void}
 */
function drawSpanishInstructions(lines, x, colWidth, baseY) {
  ctx.font = "18px Arial";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";

  let currentY = baseY;
  for (let line of lines) {
    ctx.fillText(line, x + colWidth * 2, currentY);
    currentY += 28;
  }
}

/**
 * Draws the close button for the help overlay
 * @param {{x: number, y: number, width: number, height: number}} overlayConfig - Overlay configuration
 * @returns {void}
 */
function drawCloseButton(overlayConfig) {
  const buttonConfig = getCloseButtonConfig(overlayConfig);
  drawButton(buttonConfig, "Schließen / Cerrar");
  setButtonArea("helpCloseButtonArea", buttonConfig);
  ctx.restore(); // Close the save from drawOverlayBackground
}

/**
 * Creates configuration for the help overlay close button
 * @param {{x: number, y: number, width: number, height: number}} overlayConfig - Overlay configuration
 * @returns {{x: number, y: number, width: number, height: number}} Close button configuration
 */
function getCloseButtonConfig(overlayConfig) {
  const btnWidth = 180;
  const btnHeight = 48;
  const btnX = canvas.width / 2 - btnWidth / 2;
  const btnY = overlayConfig.y + overlayConfig.height - 80;

  return { x: btnX, y: btnY, width: btnWidth, height: btnHeight };
}