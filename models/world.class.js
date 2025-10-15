class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  bottleBar = new BottleBar();
  coinBar = new CoinBar();
  bossBar = new BossBar();
  throwableObjects = [];
  bottleCount = 0;
  coinCount = 0;
  audioManager = new AudioManager();

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
    this.audioManager = new AudioManager();
    this.audioManager.sounds.background.volume = 0.3; // leiser machen
    this.audioManager.sounds.background.play();
    this.level = level1;
    this.endboss = new Endboss();
    this.endboss.world = this;
    this.level.enemies.push(this.endboss);
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkBottleCollisions();
      this.checkCoinCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D && this.bottleCount > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );

      this.throwableObjects.push(bottle);
      this.bottleCount--;
      this.bottleBar.setPercentage(this.bottleCount);
      this.audioManager.play("throw");
    }

    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
      let bottle = this.throwableObjects[i];

      if (!bottle) continue;

      const boss =
        this.level.endboss ||
        this.level.enemies.find((e) => e instanceof Endboss);
      if (boss && !bottle.isShattered && bottle.isColliding(boss)) {
        boss.hit();
        this.audioManager.play("bottleSmash");

        if (world.bossBar) {
          world.bossBar.setPercentage(boss.energy);
        }

        bottle.shatter();
        continue;
      }

      if (!bottle.isShattered && bottle.y > 350) {
        this.audioManager.play("bottleSmash");
        bottle.shatter();
        continue;
      }

      if (bottle.remove) {
        this.throwableObjects.splice(i, 1);
      }
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (enemy instanceof Endboss) {
        if (
          this.character.isColliding(enemy) &&
          !enemy.isDead &&
          !this.character.isHurt()
        ) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
          this.audioManager.play("hurt");
        }
      } else {
        if (!enemy.isDead && this.character.isColliding(enemy)) {
          if (this.character.isFallingOn(enemy)) {
            enemy.die();
            this.audioManager.play("enemyDead");
          } else if (!this.character.isHurt()) {
            this.character.hit();
            this.statusBar.setPercentage(this.character.energy);
            this.audioManager.play("hurt");
          }
        }
      }
    });
    this.level.enemies = this.level.enemies.filter((e) => !e.remove);
  }

  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.bottleCount++;
        this.audioManager.play("bottle");
        this.level.bottles.splice(index, 1);
        this.bottleBar.setPercentage(this.bottleCount);
      }
    });
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.coinCount++;
        this.audioManager.play("coin");
        this.level.coins.splice(index, 1);
        this.coinBar.setPercentage(this.coinCount);
      }
    });
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.checkCollisions();
    this.ctx.translate(this.camera_x, 0);
    this.addObjectToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);

    this.addToMap(this.statusBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.bossBar);

    this.ctx.translate(this.camera_x, 0);
    this.addToMap(this.character);
    this.addObjectToMap(this.level.clouds);
    this.addObjectToMap(this.level.enemies);
    this.addObjectToMap(this.level.bottles);
    this.addObjectToMap(this.level.coins);
    this.addObjectToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
    
    let self = this;
    requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }
}
