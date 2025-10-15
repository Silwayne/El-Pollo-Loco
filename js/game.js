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

    canvas.style.cursor =
      hoveringStart || hoveringSound ? "pointer" : "default";
  });

  canvas.addEventListener("click", handleCanvasClick);

  drawStartScreen();
});

function init() {
  world = new World(canvas, keyboard);

  if (!soundOn) {
    world.audioManager.sounds.background.pause();
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
