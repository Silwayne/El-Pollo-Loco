class WorldUI {
  constructor(world) {
    this.world = world;
    this.ctx = world.ctx;
    this.canvas = world.canvas;
    this.gameOverUI = new WorldUIGameOver(this);
  }

  draw() {
    this.clearAndDrawBackground();
    this.drawMainOrOverlay();
  }

  clearAndDrawBackground() {
    this.clearCanvas();
    this.drawBackgroundObjects();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawBackgroundObjects() {
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToCanvas(this.world.level.backgroundObjects);
    this.ctx.translate(-this.world.camera_x, 0);
  }

  drawMainOrOverlay() {
    if (this.world.character.isDead()) {
      this.showGameOver();
    } else if (this.isEndbossDead()) {
      this.showGameWin();
    } else {
      this.drawGameObjects();
    }
  }

  showGameOver() {
    this.gameOverUI.drawGameOverImage();
  }

  showGameWin() {
    this.gameOverUI.drawGameWinImage();
  }

  isEndbossDead() {
    const boss = this.world.level.enemies.find((e) => e instanceof Endboss);
    return boss && boss.isDead;
  }

  drawGameObjects() {
    this.drawWorldObjects();
    this.drawStatusBars();
  }

  drawWorldObjects() {
    this.ctx.translate(this.world.camera_x, 0);
    this.drawAllWorldEntities();
    this.ctx.translate(-this.world.camera_x, 0);
  }

  drawAllWorldEntities() {
    this.addObjectsToCanvas(this.world.level.clouds);
    this.addToCanvas(this.world.character);
    this.addObjectsToCanvas(this.world.level.enemies);
    this.addObjectsToCanvas(this.world.level.bottles);
    this.addObjectsToCanvas(this.world.level.coins);
    this.addObjectsToMap(this.world.throwableObjects);
  }

  drawStatusBars() {
    this.addToCanvas(this.world.statusBar);
    this.addToCanvas(this.world.bottleBar);
    this.addToCanvas(this.world.coinBar);
    this.addToCanvas(this.world.bossBar);
  }

  addObjectsToCanvas(objects) {
    objects.forEach((obj) => this.addToCanvas(obj));
  }

  addObjectsToMap(objects) {
    objects.forEach((obj) => this.addToMap(obj));
  }

  addToCanvas(obj) {
    this.addToMap(obj);
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.world.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.world.flipImageBack(mo);
    }
  }

  drawRestartAndHomeButtons() {
    const buttonConfig = this.getButtonConfig();
    this.drawRestartButton(buttonConfig);
    this.drawHomeButton(buttonConfig);
  }

  getButtonConfig() {
    const centerX = this.canvas.width / 2;
    const btnY = this.canvas.height / 2 + 180;
    const btnWidth = 200;
    const btnHeight = 50;
    const gap = 30;

    return {
      centerX,
      btnY,
      btnWidth,
      btnHeight,
      gap,
    };
  }

  drawRestartButton(config) {
    const restartX = config.centerX - config.btnWidth - config.gap / 2;
    this.drawButton(
      restartX,
      config.btnY,
      config.btnWidth,
      config.btnHeight,
      "New Game"
    );
    this.setRestartButtonArea(
      restartX,
      config.btnY,
      config.btnWidth,
      config.btnHeight
    );
  }

  setRestartButtonArea(x, y, width, height) {
    this.world.restartButtonArea = {
      x: x,
      y: y,
      width: width,
      height: height,
    };
  }

  drawHomeButton(config) {
    const homeX = config.centerX + config.gap / 2;
    this.drawButton(
      homeX,
      config.btnY,
      config.btnWidth,
      config.btnHeight,
      "Home"
    );
    this.setHomeButtonArea(
      homeX,
      config.btnY,
      config.btnWidth,
      config.btnHeight
    );
  }

  setHomeButtonArea(x, y, width, height) {
    this.world.homeButtonArea = {
      x: x,
      y: y,
      width: width,
      height: height,
    };
  }

  drawButton(x, y, width, height, label) {
    this.ctx.save();
    this.drawButtonBackground(x, y, width, height);
    this.drawButtonBorder(x, y, width, height);
    this.drawButtonText(x, y, width, height, label);
    this.ctx.restore();
  }

  drawButtonBackground(x, y, width, height) {
    this.ctx.fillStyle = "#a0220a";
    this.ctx.fillRect(x, y, width, height);
  }

  drawButtonBorder(x, y, width, height) {
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);
  }

  drawButtonText(x, y, width, height, label) {
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(label, x + width / 2, y + height / 2);
  }
}
