class World {
  character = new Character();
  level = createNewLevel();
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
  paused = false;

  animateInterval = null;
  walkInterval = null;
  attackInterval = null;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;

    if (this.level && Array.isArray(this.level.enemies)) {
      this.level.enemies = this.level.enemies.filter(
        (e) => !(e instanceof Endboss)
      );
    }

    this.endboss = new Endboss();
    this.endboss.world = this;
    this.level = createNewLevel();
    this.level.enemies.push(this.endboss);

    this.ui = new WorldUI(this);

    this.character = new Character();
    this.setWorld();

    this.statusBar = new StatusBar();
    this.bottleBar = new BottleBar();
    this.coinBar = new CoinBar();
    this.bossBar = new BossBar();

    this.throwableObjects = [];
    this.bottleCount = 0;
    this.coinCount = 0;

    this.audioManager = new AudioManager();

    try {
      if (
        window.soundOn &&
        this.audioManager &&
        this.audioManager.sounds &&
        this.audioManager.sounds.background
      ) {
        this.audioManager.sounds.background.volume = 0.3;
        this.audioManager.sounds.background.currentTime = 0;
        this.audioManager.sounds.background.play().catch(() => {});
      } else if (
        this.audioManager &&
        this.audioManager.sounds &&
        this.audioManager.sounds.background
      ) {
        this.audioManager.sounds.background.pause();
        this.audioManager.sounds.background.currentTime = 0;
      }
    } catch (e) {
      console.warn("Audio start failed:", e);
    }

    this.run();
    this.draw();
  }

  setWorld() {
    this.character.world = this;
    this.character.animate();
  }

  run() {
    this.logicInterval = setInterval(() => {
      if (!this.paused) {
        this.checkBottleCollisions();
        this.checkCoinCollisions();
        this.checkThrowObjects();
      }
    }, 200);
  }

  checkThrowObjects() {
    let now = Date.now();
    let THROW_COOLDOWN = 300; // ms

    if (this.keyboard && (this.keyboard.SPACE || this.keyboard.E)) {
      if (this.bottleCount > 0) {
        if (!this.lastThrowTime || now - this.lastThrowTime > THROW_COOLDOWN) {
          let bottle = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 100
          );
          this.throwableObjects.push(bottle);
          this.bottleCount--;
          this.bottleBar.setPercentage(this.bottleCount);
          this.audioManager.play("throw");
          this.lastThrowTime = now;
        }
      }
    }

    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
      let bottle = this.throwableObjects[i];
      if (!bottle) continue;

      let boss =
        this.level.endboss ||
        this.level.enemies.find((e) => e instanceof Endboss);
      if (boss && !bottle.isShattered && bottle.isColliding(boss)) {
        boss.hit();
        this.audioManager.play("bottleSmash");
        if (this.bossBar) this.bossBar.setPercentage(boss.energy);
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

  const boss = this.level.enemies.find((e) => e instanceof Endboss);
  const endbossDead = boss ? boss.isDead : false;
  const characterDead = this.character.isDead && this.character.isDead(); 

  if ((characterDead || endbossDead) && !this.gameEnded) {
    this.gameEnded = true;     
    this.paused = true;        

    try {
      if (this.audioManager && typeof this.audioManager.stopAll === "function") {
        this.audioManager.stopAll();
      }
      if (characterDead && this.audioManager && this.audioManager.play) {
        this.audioManager.play("lose");   // Name anpassen an deine Audionamen
      } else if (endbossDead && this.audioManager && this.audioManager.play) {
        this.audioManager.play("win");
      }
    } catch (e) {
      console.warn("Failed to stop/play end sounds:", e);
    }
  }
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
    if (!this.paused) {
      this.checkCollisions();
    }
    this.ui.draw();

    if (
      window.innerWidth <= 1023 &&
      typeof this.drawMobileControls === "function"
    ) {
      this.drawMobileControls();
    }

    let self = this;
    requestAnimationFrame(() => self.draw());
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
