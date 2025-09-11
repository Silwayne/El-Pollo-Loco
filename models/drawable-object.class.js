class DrawableObject {
  img;
  imageCache = {};
  currentImage = 0; // Index des aktuellen Bildes
  x = 120;
  y = 280;
  height = 150;
  width = 100;

  // loadImage("img/test.png");
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById("image") <img id="image" src>
    this.img.src = path;
  }

  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
      ctx.beginPath();
      // Hitbox Start
      ctx.lineWidth = "2";
      ctx.strokeStyle = "blue";
      ctx.rect(this.x, this.y, this.width, this.height);
      // Hitbox Ende
      ctx.stroke();
    }

    if (this instanceof Chicken) {
      let topBox = this.getTopHitbox();
      ctx.beginPath();
      // Hitbox Start
      ctx.lineWidth = "2";
      ctx.strokeStyle = "red"; 
      ctx.rect(topBox.x, topBox.y, topBox.width, topBox.height);
      // Hitbox Ende
      ctx.stroke();
    }
  }

  /**
   *
   * @param {Array} arr - ["img/image1.png", "img/image2.png"]
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
