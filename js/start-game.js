function handleCanvasClick(event) {
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  if (
    window.soundButtonArea &&
    x >= window.soundButtonArea.x &&
    x <= window.soundButtonArea.x + window.soundButtonArea.width &&
    y >= window.soundButtonArea.y &&
    y <= window.soundButtonArea.y + window.soundButtonArea.height
  ) {
    toggleSound();
    drawStartScreen();
    return;
  }

  if (
    window.startButtonArea &&
    x >= window.startButtonArea.x &&
    x <= window.startButtonArea.x + window.startButtonArea.width &&
    y >= window.startButtonArea.y &&
    y <= window.startButtonArea.y + window.startButtonArea.height
  ) {
    startGame();
    return;
  }
}

function toggleSound() {
  soundOn = !soundOn;
  localStorage.setItem("soundOn", soundOn);

  if (soundOn) {
    if (world) world.audioManager.sounds.background.play();
  } else {
    if (world) world.audioManager.sounds.background.pause();
  }

  drawStartScreen();
}

function handleSoundToggle() {
  if (soundOn) {
    gameAudio.currentTime = 0;
    gameAudio.play().catch(() => {});
  } else {
    gameAudio.pause();
  }
}

function startGame() {
  canvas.removeEventListener("click", handleCanvasClick);
  init();
}
