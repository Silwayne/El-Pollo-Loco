/**
 * Main canvas click handler that processes all game interactions
 * Routes clicks to appropriate handlers based on current game state
 * @param {MouseEvent} e - The mouse event object
 * @returns {void}
 */
function handleCanvasClick(e) {
  if (!canvas) return;

  const clickPos = getClickPosition(e);

  if (handleHelpOverlayClick(clickPos)) return;
  if (handleStartScreenClick(clickPos)) return;
  if (handleGameEndClick(clickPos)) return;
}

/**
 * Calculates the relative click position within the canvas
 * @param {MouseEvent} e - The mouse event object
 * @returns {{x: number, y: number}} Object with x and y coordinates relative to canvas
 */
function getClickPosition(e) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

/**
 * Handles clicks when help overlay is visible
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if click was handled, false otherwise
 */
function handleHelpOverlayClick(clickPos) {
  if (!window.showHelpOverlay) return false;

  if (isHelpCloseButtonClicked(clickPos)) {
    closeHelpOverlay();
    return true;
  }

  return window.showHelpOverlay;
}

/**
 * Checks if the help overlay close button was clicked
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if close button was clicked
 */
function isHelpCloseButtonClicked(clickPos) {
  return (
    window.helpCloseButtonArea &&
    isPointInArea(clickPos.x, clickPos.y, window.helpCloseButtonArea)
  );
}

/**
 * Closes the help overlay and returns to start screen
 * @returns {void}
 */
function closeHelpOverlay() {
  window.showHelpOverlay = false;
  if (typeof drawStartScreen === "function") drawStartScreen();
}

/**
 * Handles clicks on the start screen buttons
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if a start screen button was clicked
 */
function handleStartScreenClick(clickPos) {
  if (!window.showStartScreen) return false;

  return (
    handleSoundButtonClick(clickPos) ||
    handleStartButtonClick(clickPos) ||
    handleHelpButtonClick(clickPos) ||
    handleLegalButtonClick(clickPos) ||
    handleImprintButtonClick(clickPos)
  );
}

/**
 * Handles clicks on the sound toggle button
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if sound button was clicked
 */
function handleSoundButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "soundButtonArea", () => {
    toggleSound();
    if (typeof drawStartScreen === "function") drawStartScreen();
  });
}

/**
 * Handles clicks on the start game button
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if start button was clicked
 */
function handleStartButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "startButtonArea", () => {
    init();
  });
}

/**
 * Handles clicks on the help button
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if help button was clicked
 */
function handleHelpButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "helpButtonArea", () => {
    showHelp();
  });
}

/**
 * Handles clicks on the legal/privacy button
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if legal button was clicked
 */
function handleLegalButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "legalButtonArea", () => {
    window.location.href = "./datenschutz.html";
  });
}

/**
 * Handles clicks on the imprint button
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if imprint button was clicked
 */
function handleImprintButtonClick(clickPos) {
  return handleGenericButtonClick(clickPos, "imprintButtonArea", () => {
    window.location.href = "./impressum.html";
  });
}

/**
 * Generic button click handler for reusable click detection logic
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @param {string} areaName - The name of the button area in window object
 * @param {Function} callback - The function to execute when button is clicked
 * @returns {boolean} True if button was clicked and callback executed
 */
function handleGenericButtonClick(clickPos, areaName, callback) {
  if (!window[areaName]) return false;

  if (isPointInArea(clickPos.x, clickPos.y, window[areaName])) {
    callback();
    return true;
  }
  return false;
}

/**
 * Handles clicks when game has ended (restart/home buttons)
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if a game end button was clicked
 */
function handleGameEndClick(clickPos) {
  return handleRestartButtonClick(clickPos) || handleHomeButtonClick(clickPos);
}

/**
 * Handles clicks on the restart game button
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if restart button was clicked
 */
function handleRestartButtonClick(clickPos) {
  return handleWorldButtonClick(clickPos, "restartButtonArea", () => {
    restartGame();
  });
}

/**
 * Handles clicks on the home/return button
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @returns {boolean} True if home button was clicked
 */
function handleHomeButtonClick(clickPos) {
  return handleWorldButtonClick(clickPos, "homeButtonArea", () => {
    location.reload();
  });
}

/**
 * Generic button click handler for world-specific buttons
 * @param {{x: number, y: number}} clickPos - The click position coordinates
 * @param {string} areaName - The name of the button area in world object
 * @param {Function} callback - The function to execute when button is clicked
 * @returns {boolean} True if button was clicked and callback executed
 */
function handleWorldButtonClick(clickPos, areaName, callback) {
  if (!world || !world[areaName]) return false;

  if (isPointInArea(clickPos.x, clickPos.y, world[areaName])) {
    callback();
    return true;
  }
  return false;
}

/**
 * Checks if a point is within a rectangular area
 * @param {number} x - The x coordinate of the point
 * @param {number} y - The y coordinate of the point
 * @param {{x: number, y: number, width: number, height: number}} area - The area to check against
 * @returns {boolean} True if point is within the area
 */
function isPointInArea(x, y, area) {
  return (
    x >= area.x &&
    x <= area.x + area.width &&
    y >= area.y &&
    y <= area.y + area.height
  );
}