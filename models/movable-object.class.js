class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY; // Bewegt das Objekt nach unten
        this.speedY -= this.acceleration; // Verringert die Geschwindigkeit nach unten
      }
    }, 1000 / 25);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      // Wenn das Objekt ein ThrowableObject ist fällt es runter
      return true;
    } else {
      return this.y < 180;
    }
  }

  isColliding(obj) {
    if (!obj) return false;
    return (
      this.x + this.width > obj.x &&
      this.x < obj.x + obj.width &&
      this.y + this.height > obj.y &&
      this.y < obj.y + obj.height
    );
  }

  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit; // Differenz in ms
    timepassed = timepassed / 1000; // Differenz in s
    return timepassed < 0.4;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    // Walk Animation
    let i = this.currentImage % images.length; // Modulus-Operator, um den Index zu begrenzen
    let path = images[i]; // Mit dem i startet das Array wieder von vorne
    this.img = this.imageCache[path]; // Greift auf das Bild im Cache zu
    this.currentImage++; // Erhöht den Index für das nächste Bild
  }

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
