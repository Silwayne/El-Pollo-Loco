/**
 * Handles game over and win screen rendering and audio management
 * Manages end-game states, sound effects, and UI elements for game conclusion
 * @class
 */
class WorldUIGameOver {
  constructor(worldUI) {
    this.worldUI = worldUI;
    this.world = worldUI.world;
    this.ctx = worldUI.ctx;
    this.canvas = worldUI.canvas;
    this.preloadImages();
  }

  preloadImages() {
    this.gameOverImage = new Image();
    this.gameOverImage.src = "img/You won, you lost/Game over A.png";

    this.winImage = new Image();
    this.winImage.src = "img/You won, you lost/You Won B.png";
  }

  drawGameOverImage() {
    this.setupGameEndState();
    this.playSound("gameOver");
    this.drawPreloadedImage(this.gameOverImage);
  }

  drawGameWinImage() {
    this.setupGameEndState();
    this.playSound("win");
    this.drawPreloadedImage(this.winImage);
  }

  drawPreloadedImage(img) {
    const imageConfig = this.getImageConfig();

    if (img.complete && img.naturalHeight !== 0) {
      this.drawGameEndScreen(img, imageConfig);
    } else {
      this.drawImageAndButtons(img.src);
    }
  }

  /**
   * Sets up the game end state by pausing the game and stopping sounds
   * @returns {void}
   */
  setupGameEndState() {
    this.world.paused = true;
    this.stopAllGameSounds();
  }

  /**
   * Plays a specific end-game sound if available and not already played
   * @param {string} soundName - Name of the sound to play ("gameOver" or "win")
   * @returns {void}
   */
  playSound(soundName) {
    if (this.canPlaySound(soundName)) {
      this.world.audioManager.play(soundName);
      this.world[soundName + "Played"] = true;
    }
  }

  /**
   * Checks if a sound can be played based on availability and play state
   * @param {string} soundName - Name of the sound to check
   * @returns {boolean} True if sound can be played
   */
  canPlaySound(soundName) {
    return this.world.audioManager && !this.world[soundName + "Played"];
  }

  /**
   * Stops all game sounds including audio manager and legacy sounds
   * Fails gracefully if audio elements are not available
   * @returns {void}
   */
  stopAllGameSounds() {
    try {
      this.stopAudioManagerSounds();
      this.stopLegacySounds();
    } catch (e) {
      console.warn("stopAllGameSounds UI failed:", e);
    }
  }

  /**
   * Stops sounds managed by the audio manager
   * @returns {void}
   */
  stopAudioManagerSounds() {
    if (this.hasAudioManager()) {
      this.stopSpecificSounds();
    }
  }

  /**
   * Checks if the audio manager with sounds is available
   * @returns {boolean} True if audio manager with sounds exists
   */
  hasAudioManager() {
    return (
      this.world && this.world.audioManager && this.world.audioManager.sounds
    );
  }

  /**
   * Stops specific game sounds from the audio manager
   * @returns {void}
   */
  stopSpecificSounds() {
    const sounds = this.world.audioManager.sounds;
    this.stopSound(sounds.boss);
    this.stopSound(sounds.background);
    this.stopSound(sounds.win);
    this.stopSound(sounds.gameOver);
    this.stopSound(sounds.lose);
  }

  /**
   * Stops an individual sound by pausing and resetting it
   * @param {HTMLAudioElement} sound - The sound element to stop
   * @returns {void}
   */
  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Stops legacy sounds stored in the window object
   * @returns {void}
   */
  stopLegacySounds() {
    this.stopLegacySound("bossSound");
    this.stopLegacySound("backgroundMusic");
  }

  /**
   * Stops an individual legacy sound from window object
   * @param {string} soundName - Name of the sound property in window object
   * @returns {void}
   */
  stopLegacySound(soundName) {
    if (window[soundName]) {
      window[soundName].pause();
      window[soundName].currentTime = 0;
    }
  }

  /**
   * Loads and displays game end image with buttons
   * @param {string} imgPath - Path to the game end image
   * @returns {void}
   */
  drawImageAndButtons(imgPath) {
    const img = new Image();
    img.src = imgPath;
    const imageConfig = this.getImageConfig();

    this.setupImageLoadHandler(img, imageConfig);
    this.tryImmediateDraw(img, imageConfig);
  }

  /**
   * Calculates the configuration for positioning the game end image
   * @returns {{centerX: number, centerY: number, width: number, height: number}} Image configuration object
   */
  getImageConfig() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const width = 400;
    const height = 200;

    return { centerX, centerY, width, height };
  }

  /**
   * Sets up the image load handler for deferred drawing
   * @param {HTMLImageElement} img - The image element
   * @param {{centerX: number, centerY: number, width: number, height: number}} imageConfig - Image positioning configuration
   * @returns {void}
   */
  setupImageLoadHandler(img, imageConfig) {
    img.onload = () => {
      this.drawGameEndScreen(img, imageConfig);
    };
  }

  /**
   * Attempts immediate drawing if image is already loaded
   * @param {HTMLImageElement} img - The image element
   * @param {{centerX: number, centerY: number, width: number, height: number}} imageConfig - Image positioning configuration
   * @returns {void}
   */
  tryImmediateDraw(img, imageConfig) {
    if (img.complete) {
      this.drawGameEndScreen(img, imageConfig);
    }
  }

  /**
   * Draws the complete game end screen with image and buttons
   * @param {HTMLImageElement} img - The loaded image element
   * @param {{centerX: number, centerY: number, width: number, height: number}} imageConfig - Image positioning configuration
   * @returns {void}
   */
  drawGameEndScreen(img, imageConfig) {
    this.drawImage(img, imageConfig);
    this.worldUI.drawRestartAndHomeButtons();
  }

  /**
   * Draws the game end image with semi-transparent overlay
   * @param {HTMLImageElement} img - The image to draw
   * @param {{centerX: number, centerY: number, width: number, height: number}} imageConfig - Image positioning configuration
   * @returns {void}
   */
  drawImage(img, imageConfig) {
    const { centerX, centerY, width, height } = imageConfig;

    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.ctx.drawImage(
      img,
      centerX - width / 2,
      centerY - height / 2,
      width,
      height
    );
    this.ctx.restore();
  }
}
