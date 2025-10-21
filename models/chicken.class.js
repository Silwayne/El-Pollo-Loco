class Chicken extends MovableObject {
  y = 355;
  height = 70;
  width = 70;
  isDead = false;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");
    this.x = 400 + Math.random() * 2000;
    this.speed = 0.15 + Math.random() * 0.5;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  die() {
    this.isDead = true;
    this.playAnimation(this.IMAGES_DEAD);
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
    setInterval(() => {
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);
    setInterval(() => {
      if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
