class Chicken extends MovableObject {
  y = 355;
  height = 80;
  width = 60;
  isDead = false;

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_normal/2_dead/dead.png"];

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_normal/1_walk/1_w.png");

    this.x = 200 + Math.random() * 500; 
    this.speed = 0.15 + Math.random() * 0.5;

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.animate();
  }

  die() {
    this.isDead = true;
    this.playAnimation(this.IMAGES_DEAD);

    setTimeout(() => {
      this.remove = true; 
    }, 500);
  }

  getTopHitbox() {
    return {
      x: this.x,
      y: this.y - 1, 
      width: this.width,
      height: this.height / 2 + 1, 
    };
  }

  getBodyHitbox() {
    return {
      x: this.x,
      y: this.y + this.height / 2,
      width: this.width,
      height: this.height / 2, 
    };
  }

  animate() {
    setInterval(() => {
      if (!this.isDead) {
        this.moveLeft();
      }
    }, 1000 / 60);

    setInterval(() => {
      if (!this.isDead) {
        this.playAnimation(this.IMAGES_WALKING);
      }
    }, 200);
  }
}
