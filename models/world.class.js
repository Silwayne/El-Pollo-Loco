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

  // checkThrowObjects() {
  //   if (this.keyboard.D && this.bottleCount > 0) {
  //     let bottle = new ThrowableObject(
  //       this.character.x + 100,
  //       this.character.y + 100
  //     );
  //     this.throwableObjects.push(bottle);
  //     this.bottleCount--;
  //     this.audioManager.play("throw");
  //     this.bottleBar.setPercentage(this.bottleCount);
  //   }
  //   this.throwableObjects.forEach((bottle) => {
  //     if (bottle && this.level.enemies.find(e => e instanceof Endboss) && bottle.isColliding(this.level.enemies.find(e => e instanceof Endboss))) {
  //       this.level.enemies.find(e => e instanceof Endboss).hit();
  //       this.audioManager.play("bottleSmash");
  //       bottle.shatter();
  //     }
  //     if (bottle && bottle.y >350) {
  //       this.audioManager.play("bottleSmash");
  //       bottle.shatter();
  //     }
  //   });
  //   this.throwableObjects = this.throwableObjects.filter(b => !b.remove);
  // }

  checkThrowObjects() {
    // 1) Flasche werfen
    if (this.keyboard.D && this.bottleCount > 0) {
      let bottle = new ThrowableObject(
        this.character.x + 100,
        this.character.y + 100
      );

      // Falls du willst, dass die Flasche in Blickrichtung fliegt:
      // if (this.character.otherDirection) bottle.speed = -Math.abs(bottle.speed);

      this.throwableObjects.push(bottle);
      this.bottleCount--;
      this.bottleBar.setPercentage(this.bottleCount);
      this.audioManager.play("throw");
    }

    // 2) Kollisionen prüfen & Flaschen entfernen (rückwärts iterieren -> sicher splicen)
    for (let i = this.throwableObjects.length - 1; i >= 0; i--) {
      let bottle = this.throwableObjects[i];

      if (!bottle) continue;

      // a) Boss vorhanden und Flasche trifft Boss?
      const boss =
        this.level.endboss ||
        this.level.enemies.find((e) => e instanceof Endboss);
      if (boss && !bottle.isShattered && bottle.isColliding(boss)) {
        boss.hit(); // Boss verliert Leben
        this.audioManager.play("bottleSmash");

        if (world.bossBar) {
          world.bossBar.setPercentage(boss.energy);
        }

        bottle.shatter(); // startet Shatter-Animation -> setzt remove=true später
        continue; // weiter zur nächsten Flasche
      }

      // b) Flasche trifft den Boden?
      if (!bottle.isShattered && bottle.y > 350) {
        this.audioManager.play("bottleSmash");
        bottle.shatter();
        continue;
      }

      // c) Aufräumen: wenn remove true => aus Array entfernen
      if (bottle.remove) {
        this.throwableObjects.splice(i, 1);
      }
    }
  }

  // checkCollisions() {
  //   this.level.enemies.forEach((enemy) => {
  //     if (this.character.isColliding(enemy)) {
  //       let topBox = enemy.getTopHitbox();

  //       if (
  //         this.character.speedY < 0 &&
  //         this.character.isCollidingBox(topBox)
  //       ) {
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

  checkCollisions() {
  this.level.enemies.forEach((enemy) => {
    if (this.character.isColliding(enemy)) {
      if (enemy instanceof Endboss) {
        // Boss darf NICHT durch Draufspringen sterben
        if (!enemy.isDead) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
          this.audioManager.play("hurt");
        }
      } else {
        // Normale Gegner (z. B. Chicken)
        let topBox = enemy.getTopHitbox();

        if (
          this.character.speedY < 0 &&
          this.character.isCollidingBox(topBox)
        ) {
          enemy.die();
          this.audioManager.play("enemyDead");
          this.character.speedY = 15;
        } else if (!enemy.isDead) {
          this.character.hit();
          this.statusBar.setPercentage(this.character.energy);
          this.audioManager.play("hurt");
        }
      }
    }
  });

  // Entferne tote Gegner aus dem Array
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
