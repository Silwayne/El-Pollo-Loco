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

    this.x = 400 + Math.random() * 2000;
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
      x: this.x + 5,
      y: this.y, // statt y - 1
      width: this.width - 10, // etwas schmaler
      height: this.height / 2 + 5, // etwas größer oben
    };
  }

  getTopHitbox() {
    return {
      x: this.x + 5, // links etwas verkleinern
      y: this.y, // exakt oben am Chicken beginnen
      width: this.width - 10, // rechts auch etwas verkleinern
      height: this.height / 3 + 10, // größer machen, damit mehr Fläche oben zählt
    };
  }

  getBodyHitbox() {
    return {
      x: this.x + 5,
      y: this.y + this.height / 3, // ab 1/3 der Höhe beginnt der Körper
      width: this.width - 10,
      height: (this.height / 3) * 2, // restliche 2/3 sind Körper
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
