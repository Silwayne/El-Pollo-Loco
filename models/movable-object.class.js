class MovableObject {
  x = 120;
  y = 280;
  img;
  height = 150;
  width = 100;
  imageCache = {};
  currentImage = 0; // Index des aktuellen Bildes
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY; // Bewegt das Objekt nach unten
        this.speedY -= this.acceleration; // Verringert die Geschwindigkeit nach unten
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    return this.y < 180;
  }

  // loadImage("img/test.png");
  loadImage(path) {
    this.img = new Image(); // this.img = document.getElementById("image") <img id="image" src>
    this.img.src = path;
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

  playAnimation(images) {
    // Walk Animation
    let i = this.currentImage % this.IMAGES_WALKING.length; // Modulus-Operator, um den Index zu begrenzen
    let path = images[i]; // Mit dem i startet das Array wieder von vorne
    this.img = this.imageCache[path]; // Greift auf das Bild im Cache zu
    this.currentImage++; // Erhöht den Index für das nächste Bild
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
      this.x -= this.speed; // Bewegt die Wolke nach links
  }

  jump() {
    this.speedY = 30;
  }
}
