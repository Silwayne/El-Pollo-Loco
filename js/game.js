/**
 * Initializes the entire game application
 * Sets up event listeners, world, UI and audio
 * @returns {void}
 */
function init() {
  setupGameEventListeners();
  initializeWorld();
  hideStartScreen();
  setupMobileGameControls();
  restoreAudioState();
}

/**
 * Sets up canvas click event listener for game interactions
 * Removes existing listener before adding new one to prevent duplicates
 * @returns {void}
 */
function setupGameEventListeners() {
  canvas.removeEventListener("click", handleCanvasClick);
  canvas.addEventListener("click", handleCanvasClick);
}

/**
 * Creates and initializes the game world
 * Makes world globally accessible via window object
 * @returns {void}
 */
function initializeWorld() {
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;

  world = isTouchDevice
    ? new MobileWorld(canvas, keyboard)
    : new World(canvas, keyboard);
  window.world = world;
}

/**
 * Hides the start screen to reveal the game canvas
 * @returns {void}
 */
function hideStartScreen() {
  window.showStartScreen = false;
}

/**
 * Initializes mobile-specific game controls if available
 * Sets up touch controls and mobile UI buttons
 * @returns {void}
 */
function setupMobileGameControls() {
  if (typeof Mobile !== "undefined") Mobile.init(canvas, world);
  if (typeof world.setupMobileButtons === "function") {
    world.setupMobileButtons();
  }
}

/**
 * Restores audio state based on user preferences
 * Plays background music if sound is enabled, stops all if muted
 * @returns {void}
 */
function restoreAudioState() {
  try {
    if (world && world.audioManager) {
      if (window.soundOn) {
        world.audioManager.play("background");
      } else {
        world.audioManager.stopAll();
      }
    }
  } catch (e) {
    console.warn("init audio restore failed:", e);
  }
}

/**
 * Completely restarts the game
 * Performs cleanup, reinitialization and audio restoration
 * @returns {void}
 */
function restartGame() {
  cleanupGame();
  reinitializeGame();
  setupMobileGameControls();
  restoreGameAudio();
}

/**
 * Cleans up game resources before restart
 * Stops audio, clears intervals and cleans canvas
 * @returns {void}
 */
function cleanupGame() {
  if (world && world.audioManager) {
    world.audioManager.stopAll();
  }

  if (world && world.logicInterval) {
    clearInterval(world.logicInterval);
  }

  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Checks if the current device is a mobile/touch-enabled device
 * @returns {boolean} True if mobile device detected
 */
function isMobileDevice() {
  return navigator.maxTouchPoints > 0;
}

/**
 * Reinitializes the game world and keyboard controls
 * Creates fresh instances for a clean restart
 * @returns {void}
 */
function reinitializeGame() {
  world = null;
  keyboard = new Keyboard();

  if (isMobileDevice()) {
    world = new MobileWorld(canvas, keyboard);
    if (typeof world.setupMobileButtons === "function") {
      world.setupMobileButtons();
    }
  } else {
    world = new World(canvas, keyboard);
  }
}

/**
 * Restores audio settings after game restart
 * Applies user's sound preference (muted/unmuted)
 * @returns {void}
 */
function restoreGameAudio() {
  if (!window.soundOn) {
    muteBackgroundMusic();
  } else {
    playBackgroundMusic();
  }
}

/**
 * Mutes and resets the background music
 * Fails silently if audio is not available
 * @returns {void}
 */
function muteBackgroundMusic() {
  try {
    if (
      world &&
      world.audioManager &&
      world.audioManager.sounds &&
      world.audioManager.sounds.background
    ) {
      world.audioManager.sounds.background.pause();
      world.audioManager.sounds.background.currentTime = 0;
    }
  } catch (e) {}
}

/**
 * Plays background music from the beginning
 * Attempts multiple audio sources if available
 * Fails silently if audio playback fails
 * @returns {void}
 */
function playBackgroundMusic() {
  try {
    if (
      world &&
      world.audioManager &&
      world.audioManager.sounds &&
      world.audioManager.sounds.background
    ) {
      let bg = world.audioManager.sounds.background;
      bg.currentTime = 0;
      bg.play().catch(() => {});
    } else if (window.backgroundMusic) {
      window.backgroundMusic.currentTime = 0;
      window.backgroundMusic.play().catch(() => {});
    }
  } catch (e) {}
}
