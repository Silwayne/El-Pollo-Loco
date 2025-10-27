class WorldUIGameOver {
  constructor(worldUI) {
    this.worldUI = worldUI;
    this.world = worldUI.world;
    this.ctx = worldUI.ctx;
    this.canvas = worldUI.canvas;
  }

  drawGameOverImage() {
    this.setupGameEndState();
    this.playSound("gameOver");
    this.drawImageAndButtons("img/You won, you lost/Game over A.png");
  }

  drawGameWinImage() {
    this.setupGameEndState();
    this.playSound("win");
    this.drawImageAndButtons("img/You won, you lost/You Won B.png");
  }

  setupGameEndState() {
    this.world.paused = true;
    this.stopAllGameSounds();
  }

  playSound(soundName) {
    if (this.canPlaySound(soundName)) {
      this.world.audioManager.play(soundName);
      this.world[soundName + "Played"] = true;
    }
  }

  canPlaySound(soundName) {
    return this.world.audioManager && !this.world[soundName + "Played"];
  }

  stopAllGameSounds() {
    try {
      this.stopAudioManagerSounds();
      this.stopLegacySounds();
    } catch (e) {
      console.warn("stopAllGameSounds UI failed:", e);
    }
  }

  stopAudioManagerSounds() {
    if (this.hasAudioManager()) {
      this.stopSpecificSounds();
    }
  }

  hasAudioManager() {
    return (
      this.world && this.world.audioManager && this.world.audioManager.sounds
    );
  }

  stopSpecificSounds() {
    const sounds = this.world.audioManager.sounds;
    this.stopSound(sounds.boss);
    this.stopSound(sounds.background);
    this.stopSound(sounds.win);
    this.stopSound(sounds.gameOver);
    this.stopSound(sounds.lose);
  }

  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  stopLegacySounds() {
    this.stopLegacySound("bossSound");
    this.stopLegacySound("backgroundMusic");
  }

  stopLegacySound(soundName) {
    if (window[soundName]) {
      window[soundName].pause();
      window[soundName].currentTime = 0;
    }
  }

  drawImageAndButtons(imgPath) {
    const img = new Image();
    img.src = imgPath;
    const imageConfig = this.getImageConfig();

    this.setupImageLoadHandler(img, imageConfig);
    this.tryImmediateDraw(img, imageConfig);
  }

  getImageConfig() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const width = 400;
    const height = 200;

    return { centerX, centerY, width, height };
  }

  setupImageLoadHandler(img, imageConfig) {
    img.onload = () => {
      this.drawGameEndScreen(img, imageConfig);
    };
  }

  tryImmediateDraw(img, imageConfig) {
    if (img.complete) {
      this.drawGameEndScreen(img, imageConfig);
    }
  }

  drawGameEndScreen(img, imageConfig) {
    this.drawImage(img, imageConfig);
    this.worldUI.drawRestartAndHomeButtons();
  }

  drawImage(img, imageConfig) {
    const { centerX, centerY, width, height } = imageConfig;

    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.ctx.drawImage(
      img,
      centerX - width / 2,
      centerY - height / 2,
      width,
      height
    );
    this.ctx.restore();
  }
}
