class LittleChicken extends MovableObject {
  y = 355;
  height = 70;
  width = 70;
  isDead = false;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.initializeChicken();
    this.animate();
  }

  initializeChicken() {
    this.setPosition();
    this.setSpeed();
    this.loadAllImages();
  }

  setPosition() {
    this.x = typeof x === "number" ? x : 400 + Math.random() * 2000;
  }

  setSpeed() {
    this.speed = 0.25 + Math.random() * 0.5;
  }

  loadAllImages() {
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  die() {
    if (this.isDead) return;

    this.setDeadState();
    this.playDeathAnimation();
    this.scheduleRemoval();
  }

  setDeadState() {
    this.isDead = true;
  }

  playDeathAnimation() {
    this.playAnimation(this.IMAGES_DEAD);
  }

  scheduleRemoval() {
    setTimeout(() => {
      this.remove = true;
    }, 500);
  }

  getCollisionBox() {
    return {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 10,
    };
  }

  animate() {
    this.startMovement();
    this.startAnimation();
  }

  startMovement() {
    this.walkInterval = setInterval(() => {
      this.handleMovement();
    }, 1000 / 60);
  }

  handleMovement() {
    if (!this.isDead) {
      this.moveLeft();
    }
  }

  startAnimation() {
    this.animInterval = setInterval(() => {
      this.handleAnimation();
    }, 200);
  }

  handleAnimation() {
    if (!this.isDead) {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}
