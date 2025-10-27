function init() {
  setupGameEventListeners();
  initializeWorld();
  hideStartScreen();
  setupMobileGameControls();
  restoreAudioState();
}

function setupGameEventListeners() {
  canvas.removeEventListener("click", handleCanvasClick);
  canvas.addEventListener("click", handleCanvasClick);
}

function initializeWorld() {
  world = new World(canvas, keyboard);
  window.world = world;
}

function hideStartScreen() {
  window.showStartScreen = false;
}

function setupMobileGameControls() {
  if (typeof Mobile !== "undefined") Mobile.init(canvas, world);
  if (typeof world.setupMobileButtons === "function") {
    world.setupMobileButtons();
  }
}

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

function restartGame() {
  cleanupGame();
  reinitializeGame();
  restoreGameAudio();
}

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

function reinitializeGame() {
  world = null;
  keyboard = new Keyboard();
  world = new World(canvas, keyboard);
}

function restoreGameAudio() {
  if (!window.soundOn) {
    muteBackgroundMusic();
  } else {
    playBackgroundMusic();
  }
}

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
  } catch (e) {
    // Silent fail for audio
  }
}

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
  } catch (e) {
    // Silent fail for audio
  }
}
