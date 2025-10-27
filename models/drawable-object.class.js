class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0;
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this.shouldDrawFrame()) {
      this.drawCollisionBox(ctx);
    }
  }

  shouldDrawFrame() {
    return (
      this instanceof Character ||
      this instanceof Chicken ||
      this instanceof Endboss
    );
  }

  drawCollisionBox(ctx) {
    if (this.getCollisionBox) {
      const box = this.getCollisionBox();
      this.setupCollisionBox(ctx);
      this.drawCollisionPath(ctx, box);
    }
  }

  setupCollisionBox(ctx) {
    ctx.beginPath();
    // Zum Debuggen Kollisionsboxen anzeigen:
    // ctx.lineWidth = "2";
    // ctx.strokeStyle = "red";
  }

  drawCollisionPath(ctx, box) {
    // Zum Debuggen Kollisionsboxen anzeigen:
    // ctx.rect(box.x, box.y, box.width, box.height);
    ctx.stroke();
  }

  loadImages(arr) {
    arr.forEach((path) => {
      this.loadSingleImage(path);
    });
  }

  loadSingleImage(path) {
    let img = new Image();
    img.src = path;
    this.imageCache[path] = img;
  }
}
