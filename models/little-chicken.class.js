class LittleChicken extends MovableObject {
  y = 355;
  height = 70;
  width = 70;
  isDead = false;

  constructor() {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.x = (typeof x === "number") ? x : (400 + Math.random() * 2000);
    this.speed = 0.25 + Math.random() * 0.5;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.animate();
  }

  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  die() {
    if (this.isDead) return;
    this.isDead = true;
    this.playAnimation(this.IMAGES_DEAD);
    setTimeout(() => {
      this.remove = true; // wird später vom World-Filter entfernt
    }, 500);
  }

  getCollisionBox() {
    // etwas schmalere Hitbox als das Bild, damit Kollision realistischer ist
    return {
      x: this.x + 10,
      y: this.y + 10,
      width: this.width - 20,
      height: this.height - 10,
    };
  }

  animate() {
    // Bewegung (60 FPS)
    this.walkInterval = setInterval(() => {
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);

    // Sprite-Animation (Animation-Takt)
    this.animInterval = setInterval(() => {
      if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }
}
