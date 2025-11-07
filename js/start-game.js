/**
 * Handles canvas click events and routes to appropriate button handlers
 * Processes sound and start button clicks on the start screen
 * @param {MouseEvent} event - The mouse click event object
 * @returns {void}
 */
function handleCanvasClick(event) {
  const clickPosition = getClickPosition(event);

  if (isSoundButtonClicked(clickPosition)) {
    handleSoundButtonClick();
    return;
  }

  if (isStartButtonClicked(clickPosition)) {
    handleStartButtonClick();
    return;
  }
}

/**
 * Calculates the click position relative to the canvas coordinates
 * @param {MouseEvent} event - The mouse event object
 * @returns {{x: number, y: number}} Object with canvas-relative coordinates
 */
function getClickPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return { x, y };
}

/**
 * Checks if the sound button was clicked
 * @param {{x: number, y: number}} clickPosition - The click coordinates
 * @returns {boolean} True if sound button area was clicked
 */
function isSoundButtonClicked(clickPosition) {
  return this.isButtonClicked(clickPosition, window.soundButtonArea);
}

/**
 * Checks if the start button was clicked
 * @param {{x: number, y: number}} clickPosition - The click coordinates
 * @returns {boolean} True if start button area was clicked
 */
function isStartButtonClicked(clickPosition) {
  return this.isButtonClicked(clickPosition, window.startButtonArea);
}

/**
 * Generic function to check if a click occurred within a button area
 * @param {{x: number, y: number}} clickPosition - The click coordinates
 * @param {{x: number, y: number, width: number, height: number}} buttonArea - The button area to check
 * @returns {boolean} True if click is within the button area
 */
function isButtonClicked(clickPosition, buttonArea) {
  if (!buttonArea) return false;

  return (
    clickPosition.x >= buttonArea.x &&
    clickPosition.x <= buttonArea.x + buttonArea.width &&
    clickPosition.y >= buttonArea.y &&
    clickPosition.y <= buttonArea.y + buttonArea.height
  );
}

/**
 * Handles sound button click - toggles sound and updates UI
 * @returns {void}
 */
function handleSoundButtonClick() {
  toggleSound();
  drawStartScreen();
}

/**
 * Handles start button click - begins the game
 * @returns {void}
 */
function handleStartButtonClick() {
  this.startGame();
}

/**
 * Toggles sound on/off and manages audio state
 * Saves preference, handles background music, and updates UI
 * @returns {void}
 */
function toggleSound() {
  soundOn = !soundOn;
  this.saveSoundPreference();
  this.handleBackgroundMusic();
  drawStartScreen();
}

/**
 * Saves sound preference to localStorage for persistence
 * @returns {void}
 */
function saveSoundPreference() {
  localStorage.setItem("soundOn", soundOn);
}

/**
 * Manages background music based on sound preference
 * Plays or pauses background music depending on sound state
 * @returns {void}
 */
function handleBackgroundMusic() {
  if (!world) return;

  if (soundOn) {
    this.playBackgroundMusic();
  } else {
    this.pauseBackgroundMusic();
  }
}

/**
 * Plays the background music from the world's audio manager
 * @returns {void}
 */
function playBackgroundMusic() {
  world.audioManager.sounds.background.play();
}

/**
 * Pauses the background music
 * @returns {void}
 */
function pauseBackgroundMusic() {
  world.audioManager.sounds.background.pause();
}

/**
 * Handles game audio based on sound preference
 * Starts or stops game audio when toggling sound
 * @returns {void}
 */
function handleSoundToggle() {
  if (soundOn) {
    this.startGameAudio();
  } else {
    this.stopGameAudio();
  }
}

/**
 * Starts playing the game audio from the beginning
 * Fails silently if audio playback is blocked
 * @returns {void}
 */
function startGameAudio() {
  gameAudio.currentTime = 0;
  gameAudio.play().catch(() => {});
}

/**
 * Stops the game audio
 * @returns {void}
 */
function stopGameAudio() {
  gameAudio.pause();
}

/**
 * Starts the game by removing click listener and initializing
 * @returns {void}
 */
function startGame() {
  canvas.removeEventListener("click", handleCanvasClick);
  init();
}