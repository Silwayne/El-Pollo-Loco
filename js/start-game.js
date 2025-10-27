function handleCanvasClick(event) {
  const clickPosition = getClickPosition(event);

  if (this.isSoundButtonClicked(clickPosition)) {
    this.handleSoundButtonClick();
    return;
  }

  if (this.isStartButtonClicked(clickPosition)) {
    this.handleStartButtonClick();
    return;
  }
}

function getClickPosition(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return { x, y };
}

function isSoundButtonClicked(clickPosition) {
  return this.isButtonClicked(clickPosition, window.soundButtonArea);
}

function isStartButtonClicked(clickPosition) {
  return this.isButtonClicked(clickPosition, window.startButtonArea);
}

function isButtonClicked(clickPosition, buttonArea) {
  if (!buttonArea) return false;

  return (
    clickPosition.x >= buttonArea.x &&
    clickPosition.x <= buttonArea.x + buttonArea.width &&
    clickPosition.y >= buttonArea.y &&
    clickPosition.y <= buttonArea.y + buttonArea.height
  );
}

function handleSoundButtonClick() {
  this.toggleSound();
  drawStartScreen();
}

function handleStartButtonClick() {
  this.startGame();
}

function toggleSound() {
  soundOn = !soundOn;
  this.saveSoundPreference();
  this.handleBackgroundMusic();
  drawStartScreen();
}

function saveSoundPreference() {
  localStorage.setItem("soundOn", soundOn);
}

function handleBackgroundMusic() {
  if (!world) return;

  if (soundOn) {
    this.playBackgroundMusic();
  } else {
    this.pauseBackgroundMusic();
  }
}

function playBackgroundMusic() {
  world.audioManager.sounds.background.play();
}

function pauseBackgroundMusic() {
  world.audioManager.sounds.background.pause();
}

function handleSoundToggle() {
  if (soundOn) {
    this.startGameAudio();
  } else {
    this.stopGameAudio();
  }
}

function startGameAudio() {
  gameAudio.currentTime = 0;
  gameAudio.play().catch(() => {});
}

function stopGameAudio() {
  gameAudio.pause();
}

function startGame() {
  canvas.removeEventListener("click", handleCanvasClick);
  init();
}
