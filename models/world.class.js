class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
  }

  run() {
    setInterval(() => {
      this.checkCollisions();
      this.checkThrowObjects();
    }, 200);
  }

  checkThrowObjects() {
    if (this.keyboard.D) {
      let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
      this.throwableObjects.push(bottle);
    }
  }

  checkCollisions() {
    this.level.enemies.forEach((enemy) => {
      if (this.character.isColliding(enemy)) {
        this.character.hit();
        this.statusBar.setPercentage(this.character.energy);
      }
    });
  }

  draw() {
    // Leere den Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Leere den Canvas

    this.ctx.translate(this.camera_x, 0); // Verschiebe die Kamera

    // Zeichne alle Objekte auf den Canvas
    this.addObjectToMap(this.level.backgroundObjects); // Zeichne die Hintergrundobjekte
    this.ctx.translate(-this.camera_x, 0); // Kamera zurücksetzen
    this.addToMap(this.statusBar); // Zeichne die Statusleiste
    this.ctx.translate(this.camera_x, 0); // Kamera verschieben
    this.addToMap(this.character); // Zeichne den Charakter
    this.addObjectToMap(this.level.clouds); // Zeichne die Wolken
    this.addObjectToMap(this.level.enemies); // Zeichne die Gegner
    this.addObjectToMap(this.throwableObjects); // Zeichne die Wurfobjekte
    this.ctx.translate(-this.camera_x, 0); // Rückgängig machen der Verschiebung
    // draw() wird immer wieder ausgeführt
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
