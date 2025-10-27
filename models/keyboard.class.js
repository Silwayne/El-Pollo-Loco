class Keyboard {
  W = false;
  A = false;
  D = false;
  E = false;
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

  if (e.keyCode == 69) {
    keyboard.E = true;
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

  if (e.keyCode == 69) {
    keyboard.E = false;
  }
});
