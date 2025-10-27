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

    this.initializeWorld();
    this.setupAudio();
    this.run();
    this.draw();
  }

  initializeWorld() {
    this.cleanupEnemies();
    this.setupEndboss();
    this.setupUI();
    this.setupCharacter();
    this.setupBars();
    this.resetCounters();
  }

  cleanupEnemies() {
    if (this.level && Array.isArray(this.level.enemies)) {
      this.level.enemies = this.level.enemies.filter(
        (e) => !(e instanceof Endboss)
      );
    }
  }

  setupEndboss() {
    this.endboss = new Endboss();
    this.endboss.world = this;
    this.level = createNewLevel();
    this.level.enemies.push(this.endboss);
  }

  setupUI() {
    this.ui = new WorldUI(this);
  }

  setupCharacter() {
    this.character = new Character();
    this.setWorld();
  }

  setupBars() {
    this.statusBar = new StatusBar();
    this.bottleBar = new BottleBar();
    this.coinBar = new CoinBar();
    this.bossBar = new BossBar();
  }

  resetCounters() {
    this.throwableObjects = [];
    this.bottleCount = 0;
    this.coinCount = 0;
  }

  setupAudio() {
    this.audioManager = new AudioManager();
    this.handleBackgroundMusic();
  }

  handleBackgroundMusic() {
    try {
      if (this.shouldPlayBackgroundMusic()) {
        this.playBackgroundMusic();
      } else {
        this.pauseBackgroundMusic();
      }
    } catch (e) {
      console.warn("Audio start failed:", e);
    }
  }

  shouldPlayBackgroundMusic() {
    return window.soundOn && this.hasBackgroundSound();
  }

  hasBackgroundSound() {
    return this.audioManager?.sounds?.background;
  }

  playBackgroundMusic() {
    const bgSound = this.audioManager.sounds.background;
    bgSound.volume = 0.3;
    bgSound.currentTime = 0;
    bgSound.play().catch(() => {});
  }

  pauseBackgroundMusic() {
    if (this.hasBackgroundSound()) {
      const bgSound = this.audioManager.sounds.background;
      bgSound.pause();
      bgSound.currentTime = 0;
    }
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
    }, 60);
  }

  checkThrowObjects() {
    this.handleThrowInput();
    this.updateThrowableObjects();
  }

  handleThrowInput() {
    const THROW_COOLDOWN = 100;
    const now = Date.now();

    if (this.canThrow(now, THROW_COOLDOWN)) {
      this.throwBottle(now);
    }
  }

  canThrow(now, cooldown) {
    const isThrowKeyPressed = this.keyboard && this.keyboard.E;
    if (!isThrowKeyPressed) return false;

    if (this.bottleCount <= 0) return false;

    const isCooldownOver =
      !this.lastThrowTime || now - this.lastThrowTime > cooldown;
    return isCooldownOver;
  }

  throwBottle(now) {
    const throwX = this.character.otherDirection
      ? this.character.x - 50
      : this.character.x + 100;

    const throwY = this.character.y + 100;
    const bottle = new ThrowableObject(throwX, throwY);
    bottle.speed = this.character.otherDirection ? -10 : 10;

    this.throwableObjects.push(bottle);
    this.bottleCount--;
    this.bottleBar.setPercentage(this.bottleCount);
    this.audioManager.play("throw");
    this.lastThrowTime = now;
  }

  updateThrowableObjects() {
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
      const bottle = this.throwableObjects[i];
      if (!bottle) continue;

      this.handleBottleCollisions(bottle, i);
      this.handleBottleRemoval(bottle, i);
    }
  }

  handleBottleCollisions(bottle, index) {
    if (bottle.isShattered) return;

    const boss = this.getBoss();
    if (boss && bottle.isColliding(boss)) {
      this.hitBossWithBottle(boss, bottle);
    } else if (bottle.y > 350) {
      this.shatterBottle(bottle);
    }
  }

  getBoss() {
    return (
      this.level.endboss || this.level.enemies.find((e) => e instanceof Endboss)
    );
  }

  hitBossWithBottle(boss, bottle) {
    boss.hit();
    this.audioManager.play("bottleSmash");
    if (this.bossBar) this.bossBar.setPercentage(boss.energy);
    bottle.shatter();
  }

  shatterBottle(bottle) {
    this.audioManager.play("bottleSmash");
    bottle.shatter();
  }

  handleBottleRemoval(bottle, index) {
    if (bottle.remove) {
      this.throwableObjects.splice(index, 1);
    }
  }

  checkCollisions() {
    this.checkEnemyCollisions();
    this.cleanupEnemiesList();
    this.checkGameEnd();
  }

  checkEnemyCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.shouldCheckCollision(enemy)) {
        this.handleEnemyCollision(enemy);
      }
    });
  }

  shouldCheckCollision(enemy) {
    return !enemy.isDead && this.character.isColliding(enemy);
  }

  handleEnemyCollision(enemy) {
    if (enemy instanceof Endboss) {
      this.handleEndbossCollision(enemy);
    } else {
      this.handleRegularEnemyCollision(enemy);
    }
  }

  handleEndbossCollision(endboss) {
    if (!this.character.isHurt()) {
      this.hurtCharacter();
    }
  }

  handleRegularEnemyCollision(enemy) {
    if (this.character.isFallingOn(enemy)) {
      this.killEnemy(enemy);
    } else if (!this.character.isHurt()) {
      this.hurtCharacter();
    }
  }

  hurtCharacter() {
    this.character.hit();
    this.statusBar.setPercentage(this.character.energy);
    this.audioManager.play("hurt");
  }

  killEnemy(enemy) {
    enemy.die();
    this.audioManager.play("enemyDead");
  }

  cleanupEnemiesList() {
    this.level.enemies = this.level.enemies.filter((e) => !e.remove);
  }

  checkGameEnd() {
    const boss = this.getBoss();
    const endbossDead = boss ? boss.isDead : false;
    const characterDead = this.character.isDead && this.character.isDead();

    if ((characterDead || endbossDead) && !this.gameEnded) {
      this.endGame(characterDead, endbossDead);
    }
  }

  endGame(characterDead, endbossDead) {
    this.gameEnded = true;
    this.paused = true;
    this.handleEndSounds(characterDead, endbossDead);
  }

  handleEndSounds(characterDead, endbossDead) {
    try {
      this.stopAllAudio();
      this.playEndSound(characterDead, endbossDead);
    } catch (e) {
      console.warn("Failed to stop/play end sounds:", e);
    }
  }

  stopAllAudio() {
    if (this.audioManager && typeof this.audioManager.stopAll === "function") {
      this.audioManager.stopAll();
    }
  }

  playEndSound(characterDead, endbossDead) {
    if (characterDead) {
      this.audioManager.play("gameOver");
    } else if (endbossDead) {
      this.audioManager.play("win");
    }
  }

  checkBottleCollisions() {
    this.level.bottles.forEach((bottle, index) => {
      if (this.character.isColliding(bottle)) {
        this.collectBottle(index);
      }
    });
  }

  collectBottle(index) {
    this.bottleCount++;
    this.audioManager.play("bottle");
    this.level.bottles.splice(index, 1);
    this.bottleBar.setPercentage(this.bottleCount);
  }

  checkCoinCollisions() {
    this.level.coins.forEach((coin, index) => {
      if (this.character.isColliding(coin)) {
        this.collectCoin(index);
      }
    });
  }

  collectCoin(index) {
    this.coinCount++;
    this.audioManager.play("coin");
    this.level.coins.splice(index, 1);
    this.coinBar.setPercentage(this.coinCount);
  }

  draw() {
    if (!this.paused) {
      this.checkCollisions();
    }

    this.ui.draw();
    this.drawMobileControlsIfNeeded();

    let self = this;
    requestAnimationFrame(() => self.draw());
  }

  drawMobileControlsIfNeeded() {
    if (
      window.innerWidth <= 1023 &&
      typeof this.drawMobileControls === "function"
    ) {
      this.drawMobileControls();
    }
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
