let mousePos = { x: 0, y: 0 };
let canvas;
let world;
let keyboard = new Keyboard();
soundOn = localStorage.getItem("soundOn") !== "false";

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
      hoveringStart || hoveringSound || hoveringRestart || hoveringHome
        ? "pointer"
        : "default";
  });

  canvas.addEventListener("click", handleCanvasClick);

  drawStartScreen();
});

function init() {
  // entferne alte click-listener für Startscreen
  canvas.removeEventListener("click", handleCanvasClick);
  // setze world neu
  world = new World(canvas, keyboard);
  // restore sound
  if (!soundOn && world && world.audioManager && world.audioManager.sounds) {
    world.audioManager.sounds.background.pause();
  } else if (
    soundOn &&
    world &&
    world.audioManager &&
    world.audioManager.sounds
  ) {
    try {
      world.audioManager.sounds.background.currentTime = 0;
      world.audioManager.sounds.background.play();
    } catch (e) {}
  }
  // setze den Restart/Overlay handler
  canvas.removeEventListener("click", handleRestartClick);
  canvas.addEventListener("click", handleRestartClick);
}

function handleRestartClick(e) {
  if (!world) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // RESTART BUTTON?
  if (
    world.restartButtonArea &&
    x >= world.restartButtonArea.x &&
    x <= world.restartButtonArea.x + world.restartButtonArea.width &&
    y >= world.restartButtonArea.y &&
    y <= world.restartButtonArea.y + world.restartButtonArea.height
  ) {
    restartGame();
    return;
  }

  // HOME BUTTON?
  if (
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
  // 1) Alte Welt aufräumen
  if (world && world.logicInterval) {
    clearInterval(world.logicInterval);
  }

  // 2) Canvas leeren
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 3) Globale World-Referenz zurücksetzen
  world = null;
  // frisches Keyboard
  keyboard = new Keyboard();

  // 4) Soundzustand merken (wird nach Neuanlage wiederhergestellt)
  const currentSoundState = soundOn;

  // 5) Neue Welt erstellen
  world = new World(canvas, keyboard);

  // 6) Soundzustand wiederherstellen (z.B. background music pausieren, wenn soundOff)
  if (!currentSoundState) {
    // falls du einen AudioManager verwendest:
    if (
      world &&
      world.audioManager &&
      world.audioManager.sounds &&
      world.audioManager.sounds.background
    ) {
      try {
        world.audioManager.sounds.background.pause();
      } catch (e) {}
    } else {
      // fallback auf globale Variablen (falls dein alter Code so arbeitet)
      try {
        if (window.gameAudio) gameAudio.pause();
      } catch (e) {}
    }
  }
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }

  if (e.keyCode == 38) {
    keyboard.UP = true;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }

  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }

  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }

  if (e.keyCode == 38) {
    keyboard.UP = false;
  }

  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }

  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});
