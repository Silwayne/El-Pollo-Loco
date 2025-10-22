let mousePos = { x: 0, y: 0 };
let canvas;
let world;
let keyboard = new Keyboard();
window.soundOn = localStorage.getItem("soundOn") !== "false";

function stopAllGameSounds() {
  try {
    if (
      window.world &&
      world.audioManager &&
      typeof world.audioManager.stopAll === "function"
    ) {
      world.audioManager.stopAll();
    } else if (
      window.audioManager &&
      typeof window.audioManager.stopAll === "function"
    ) {
      window.audioManager.stopAll();
    } else {
      try {
        if (window.backgroundMusic) {
          window.backgroundMusic.pause();
          window.backgroundMusic.currentTime = 0;
        }
        if (window.bossSound) {
          window.bossSound.pause();
          window.bossSound.currentTime = 0;
        }
        if (window.winSound) {
          window.winSound.pause();
          window.winSound.currentTime = 0;
        }
        if (window.loseSound) {
          window.loseSound.pause();
          window.loseSound.currentTime = 0;
        }
      } catch (e) {}
    }
  } catch (e) {
    console.warn("stopAllGameSounds failed:", e);
  }
}

function toggleSound() {
  window.soundOn = !window.soundOn;
  localStorage.setItem("soundOn", window.soundOn);

  try {
    if (window.world && world.audioManager) {
      if (window.soundOn) {
        world.audioManager.play("background");
      } else {
        world.audioManager.stopAll();
      }
    } else if (window.audioManager) {
      if (window.soundOn) {
        window.audioManager.play("background");
      } else {
        window.audioManager.stopAll();
      }
    } else {
      if (!window.soundOn) {
        try {
          if (window.backgroundMusic) {
            window.backgroundMusic.pause();
            window.backgroundMusic.currentTime = 0;
          }
          if (window.bossSound) {
            window.bossSound.pause();
            window.bossSound.currentTime = 0;
          }
        } catch (e) {}
      } else {
        try {
          if (window.backgroundMusic) {
            window.backgroundMusic.currentTime = 0;
            window.backgroundMusic.play().catch(() => {});
          }
        } catch (e) {}
      }
    }
  } catch (e) {
    console.warn("toggleSound failed:", e);
  }

  if (
    window.world &&
    world.ui &&
    typeof world.ui.updateSoundIcon === "function"
  ) {
    world.ui.updateSoundIcon(window.soundOn);
  }
}

window.addEventListener("load", function () {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.x = e.clientX - rect.left;
    mousePos.y = e.clientY - rect.top;

    const hoveringStart =
      window.startButtonArea &&
      mousePos.x >= window.startButtonArea.x &&
      mousePos.x <= window.startButtonArea.x + window.startButtonArea.width &&
      mousePos.y >= window.startButtonArea.y &&
      mousePos.y <= window.startButtonArea.y + window.startButtonArea.height;

    const hoveringSound =
      window.soundButtonArea &&
      mousePos.x >= window.soundButtonArea.x &&
      mousePos.x <= window.soundButtonArea.x + window.soundButtonArea.width &&
      mousePos.y >= window.soundButtonArea.y &&
      mousePos.y <= window.soundButtonArea.y + window.soundButtonArea.height;

    const hoveringHelp =
      window.helpButtonArea &&
      mousePos.x >= window.helpButtonArea.x &&
      mousePos.x <= window.helpButtonArea.x + window.helpButtonArea.width &&
      mousePos.y >= window.helpButtonArea.y &&
      mousePos.y <= window.helpButtonArea.y + window.helpButtonArea.height;

    const hoveringRestart =
      world &&
      world.restartButtonArea &&
      mousePos.x >= world.restartButtonArea.x &&
      mousePos.x <= world.restartButtonArea.x + world.restartButtonArea.width &&
      mousePos.y >= world.restartButtonArea.y &&
      mousePos.y <= world.restartButtonArea.y + world.restartButtonArea.height;

    const hoveringHome =
      world &&
      world.homeButtonArea &&
      mousePos.x >= world.homeButtonArea.x &&
      mousePos.x <= world.homeButtonArea.x + world.homeButtonArea.width &&
      mousePos.y >= world.homeButtonArea.y &&
      mousePos.y <= world.homeButtonArea.y + world.homeButtonArea.height;

    canvas.style.cursor =
      hoveringStart || hoveringSound || hoveringHelp || hoveringRestart || hoveringHome
        ? "pointer"
        : "default";
  });

  canvas.addEventListener("click", handleCanvasClick);

  drawStartScreen();
});

function init() {
  canvas.removeEventListener("click", handleCanvasClick);
  canvas.addEventListener("click", handleCanvasClick);

  world = new World(canvas, keyboard);

  window.world = world; // macht es global referenzierbar
  Mobile.init(canvas, world); // initialisiert Touch-Handler
  if (world._setupMobileButtons) world._setupMobileButtons(); // legt Button-Rects an

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

function handleCanvasClick(e) {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (
    window.soundButtonArea &&
    x >= window.soundButtonArea.x &&
    x <= window.soundButtonArea.x + window.soundButtonArea.width &&
    y >= window.soundButtonArea.y &&
    y <= window.soundButtonArea.y + window.soundButtonArea.height
  ) {
    toggleSound();

    if (typeof drawStartScreen === "function") {
      drawStartScreen();
    }

    return;
  }

  if (
    window.startButtonArea &&
    x >= window.startButtonArea.x &&
    x <= window.startButtonArea.x + window.startButtonArea.width &&
    y >= window.startButtonArea.y &&
    y <= window.startButtonArea.y + window.startButtonArea.height
  ) {
    init();
    return;
  }

  if (
    window.helpButtonArea &&
    x >= window.helpButtonArea.x &&
    x <= window.helpButtonArea.x + window.helpButtonArea.width &&
    y >= window.helpButtonArea.y &&
    y <= window.helpButtonArea.y + window.helpButtonArea.height
  ) {
    showHelp();
    return;
  }

  if (
    world &&
    world.restartButtonArea &&
    x >= world.restartButtonArea.x &&
    x <= world.restartButtonArea.x + world.restartButtonArea.width &&
    y >= world.restartButtonArea.y &&
    y <= world.restartButtonArea.y + world.restartButtonArea.height
  ) {
    restartGame();
    return;
  }

  if (
    world &&
    world.homeButtonArea &&
    x >= world.homeButtonArea.x &&
    x <= world.homeButtonArea.x + world.homeButtonArea.width &&
    y >= world.homeButtonArea.y &&
    y <= world.homeButtonArea.y + world.homeButtonArea.height
  ) {
    location.reload();
    return;
  }
}

function restartGame() {
  stopAllGameSounds();

  if (world && world.logicInterval) {
    clearInterval(world.logicInterval);
  }

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  world = null;
  keyboard = new Keyboard();

  const currentSoundState = window.soundOn;

  world = new World(canvas, keyboard);

  if (!currentSoundState) {
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
  } else {
    try {
      if (
        world &&
        world.audioManager &&
        world.audioManager.sounds &&
        world.audioManager.sounds.background
      ) {
        const bg = world.audioManager.sounds.background;
        bg.currentTime = 0;
        bg.play().catch(() => {});
      } else if (window.backgroundMusic) {
        window.backgroundMusic.currentTime = 0;
        window.backgroundMusic.play().catch(() => {});
      }
    } catch (e) {}
  }
}
