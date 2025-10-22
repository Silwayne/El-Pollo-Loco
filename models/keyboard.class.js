class Keyboard {
  W = false;
  A = false;
  D = false;
  SPACE = false;
}

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

  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
});

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

  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
});
