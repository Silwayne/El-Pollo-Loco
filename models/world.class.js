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
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
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
      this.audioManager.play("throw");
      this.bottleBar.setPercentage(this.bottleCount);
    }
  }

  checkCollisions() {
  this.level.enemies.forEach((enemy, index) => {
    if (this.character.isColliding(enemy)) {

      let topBox = enemy.getTopHitbox();

      // Prüfen: kommt Pepe von oben UND trifft die obere Hitbox?
      if (this.character.speedY < 0 && this.character.isCollidingBox(topBox)) {
        enemy.die();
        this.audioManager.play("enemyDead");
        this.character.speedY = 15; // Bounce nach oben

      } else if (!enemy.isDead) {
        // Seitlich oder unten → Schaden
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
        this.audioManager.play("hurt");
      }
    }
  });

  // Tote Gegner aus Array entfernen
  this.level.enemies = this.level.enemies.filter(e => !e.remove);
}


  // checkCollisions() {
  //   this.level.enemies.forEach((enemy) => {
  //     if (this.character.isColliding(enemy)) {
  //       let characterBottom = this.character.y + this.character.height;
  //       let enemyTop = enemy.y + enemy.height / 2;

  //       if (this.character.speedY < 0 && characterBottom < enemyTop) {
  //         enemy.die();
  //         this.audioManager.play("enemyDead");
  //         this.character.speedY = 15;
  //       } else if (!enemy.isDead) {
  //         this.character.hit();
  //         this.statusBar.setPercentage(this.character.energy);
  //         this.audioManager.play("hurt");
  //       }
  //     }
  //   });

  //   this.level.enemies = this.level.enemies.filter((e) => !e.remove);
  // }

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

    this.ctx.translate(this.camera_x, 0);

    this.addObjectToMap(this.level.backgroundObjects);
    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
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
