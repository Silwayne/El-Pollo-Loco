/**
 * Handles keyboard input state management for game controls
 * Tracks the pressed state of WASD and E keys for character movement and actions
 * Provides a clean interface for checking key states throughout the game
 * @class
 */
class Keyboard {
  /** @type {boolean} */ W = false;
  /** @type {boolean} */ A = false;
  /** @type {boolean} */ D = false;
  /** @type {boolean} */ E = false;
}

/**
 * Global keyboard event listener for keydown events
 * Updates keyboard state when keys are pressed
 * Uses keyCode for cross-browser compatibility
 * @event window#keydown
 * @param {KeyboardEvent} e - The keyboard event object
 */
window.addEventListener("keydown", (e) => {
  if (e.keyCode == 87) {
    keyboard.W = true;
  }

  if (e.keyCode == 65) {
    keyboard.A = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }

  if (e.keyCode == 69) {
    keyboard.E = true;
  }
});

/**
 * Global keyboard event listener for keyup events
 * Updates keyboard state when keys are released
 * Uses keyCode for cross-browser compatibility
 * @event window#keyup
 * @param {KeyboardEvent} e - The keyboard event object
 */
window.addEventListener("keyup", (e) => {
  if (e.keyCode == 87) {
    keyboard.W = false;
  }

  if (e.keyCode == 65) {
    keyboard.A = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }

  if (e.keyCode == 69) {
    keyboard.E = false;
  }
});