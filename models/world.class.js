class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.checkCollisions();
  }

  setWorld() {
    this.character.world = this;
  }

  checkCollisions() {
    setInterval(() => {
      this.level.enemies.forEach((enemy) => {
        if (this.character.isColliding(enemy)) {
          console.log("Collision detected! ", enemy);
        }
      });
    }, 200);
  }

  draw() {
    // Leere den Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Leere den Canvas

    this.ctx.translate(this.camera_x, 0); // Verschiebe die Kamera

    // Zeichne alle Objekte auf den Canvas
    this.addObjectToMap(this.level.backgroundObjects); // Zeichne die Hintergrundobjekte
    this.addToMap(this.character); // Zeichne den Charakter
    this.addObjectToMap(this.level.enemies); // Zeichne die Gegner
    this.addObjectToMap(this.level.clouds); // Zeichne die Wolken

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
