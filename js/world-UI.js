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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.world.camera_x, 0);
    this.addObjectsToCanvas(this.world.level.backgroundObjects);
    this.ctx.translate(-this.world.camera_x, 0);
  }

  drawMainOrOverlay() {
    if (this.world.character.isDead()) {
      this.gameOverUI.drawGameOverImage();
    } else if (this.isEndbossDead()) {
      this.gameOverUI.drawGameWinImage();
    } else {
      this.drawGameObjects();
    }
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
    this.addObjectsToCanvas(this.world.level.clouds);
    this.addToCanvas(this.world.character);
    this.addObjectsToCanvas(this.world.level.enemies);
    this.addObjectsToCanvas(this.world.level.bottles);
    this.addObjectsToCanvas(this.world.level.coins);
    this.addObjectsToMap(this.world.throwableObjects);
    this.ctx.translate(-this.world.camera_x, 0);
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
    if (mo.otherDirection) this.world.flipImage(mo);
    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);
    if (mo.otherDirection) this.world.flipImageBack(mo);
  }

  drawRestartAndHomeButtons() {
    const centerX = this.canvas.width / 2;
    const btnY = this.canvas.height / 2 + 180;
    const btnWidth = 200;
    const btnHeight = 50;
    const gap = 30;

    const restartX = centerX - btnWidth - gap / 2;
    this.drawButton(restartX, btnY, btnWidth, btnHeight, "New Game");
    this.world.restartButtonArea = {
      x: restartX,
      y: btnY,
      width: btnWidth,
      height: btnHeight,
    };

    const homeX = centerX + gap / 2;
    this.drawButton(homeX, btnY, btnWidth, btnHeight, "Home");
    this.world.homeButtonArea = {
      x: homeX,
      y: btnY,
      width: btnWidth,
      height: btnHeight,
    };
  }

  drawButton(x, y, width, height, label) {
    this.ctx.save();
    this.ctx.fillStyle = "#a0220a";
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "24px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(label, x + width / 2, y + height / 2);
    this.ctx.restore();
  }
}
