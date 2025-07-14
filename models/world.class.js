class World {
  character = new Character();
  enemies = [new Chicken(), new Chicken(), new Chicken()];
  clouds = [new Cloud()];
  backgroundObjects = [
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),
  ];
  canvas;
  ctx;

  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.draw();
  }

  draw() {
    // Leere den Canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Zeichne alle Objekte auf den Canvas
    this.addObjectToMap(this.clouds); // Zeichne die Wolken
    this.addObjectToMap(this.backgroundObjects); // Zeichne die Hintergrundobjekte
    this.addToMap(this.character); // Zeichne den Charakter
    this.addObjectToMap(this.enemies); // Zeichne die Gegner
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
    this.ctx.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
  }
}
