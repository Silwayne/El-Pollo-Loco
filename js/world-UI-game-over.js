class WorldUIGameOver {
  constructor(worldUI) {
    this.worldUI = worldUI;
    this.world = worldUI.world;
    this.ctx = worldUI.ctx;
    this.canvas = worldUI.canvas;
  }

  drawGameOverImage() {
    this.world.paused = true;
    this.stopAllGameSounds();
    this.playSound("gameOver");
    this.drawImageAndButtons("img/You won, you lost/Game over A.png");
  }

  drawGameWinImage() {
    this.world.paused = true;
    this.stopAllGameSounds();
    this.playSound("win");
    this.drawImageAndButtons("img/You won, you lost/You Won B.png");
  }

  playSound(soundName) {
    if (this.world.audioManager && !this.world[soundName + "Played"]) {
      this.world.audioManager.play(soundName);
      this.world[soundName + "Played"] = true;
    }
  }

  stopAllGameSounds() {
    try {
      if (
        this.world &&
        this.world.audioManager &&
        this.world.audioManager.sounds
      ) {
        const s = this.world.audioManager.sounds;
        if (s.boss) {
          s.boss.pause();
          s.boss.currentTime = 0;
        }
        if (s.background) {
          s.background.pause();
          s.background.currentTime = 0;
        }
        if (s.win) {
          s.win.pause();
          s.win.currentTime = 0;
        }
        if (s.gameOver) {
          s.gameOver.pause();
          s.gameOver.currentTime = 0;
        }
        if (s.lose) {
          s.lose.pause();
          s.lose.currentTime = 0;
        }
      } else {
        if (window.bossSound) {
          window.bossSound.pause();
          window.bossSound.currentTime = 0;
        }
        if (window.backgroundMusic) {
          window.backgroundMusic.pause();
          window.backgroundMusic.currentTime = 0;
        }
      }
    } catch (e) {
      console.warn("stopAllGameSounds UI failed:", e);
    }
  }

  drawImageAndButtons(imgPath) {
    const img = new Image();
    img.src = imgPath;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const width = 400;
    const height = 200;

    img.onload = () => {
      this.drawImage(img, centerX, centerY, width, height);
      this.worldUI.drawRestartAndHomeButtons();
    };
    if (img.complete) {
      this.drawImage(img, centerX, centerY, width, height);
      this.worldUI.drawRestartAndHomeButtons();
    }
  }

  drawImage(img, centerX, centerY, width, height) {
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
