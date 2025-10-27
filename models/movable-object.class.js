class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      this.updateGravity();
    }, 1000 / 25);
  }

  updateGravity() {
    if (this.shouldApplyGravity()) {
      this.applyVerticalMovement();
    } else {
      this.resetToGround();
    }
  }

  shouldApplyGravity() {
    return this.isAboveGround() || this.speedY > 0;
  }

  applyVerticalMovement() {
    this.y -= this.speedY;
    this.speedY -= this.acceleration;
  }

  resetToGround() {
    this.y = 180;
    this.speedY = 0;
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  isColliding(obj) {
    const a = this.getCollisionEntity();
    const b = this.getOtherCollisionEntity(obj);
    return this.checkCollision(a, b);
  }

  getCollisionEntity() {
    return this.getCollisionBox ? this.getCollisionBox() : this;
  }

  getOtherCollisionEntity(obj) {
    return obj.getCollisionBox ? obj.getCollisionBox() : obj;
  }

  checkCollision(a, b) {
    return (
      a.x + a.width > b.x &&
      a.y + a.height > b.y &&
      a.x < b.x + b.width &&
      a.y < b.y + b.height
    );
  }

  hit() {
    this.reduceEnergy();
    this.updateLastHitTime();
  }

  reduceEnergy() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
  }

  updateLastHitTime() {
    this.lastHit = new Date().getTime();
  }

  isHurt() {
    let timepassed = this.getTimeSinceLastHit();
    return timepassed < 1.0;
  }

  getTimeSinceLastHit() {
    let timepassed = new Date().getTime() - this.lastHit;
    return timepassed / 1000;
  }

  isDead() {
    return this.energy == 0;
  }

  playAnimation(images) {
    let i = this.currentImage % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImage++;
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
