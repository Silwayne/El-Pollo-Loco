class ThrowableObject extends MovableObject {
  IMAGES_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  IMAGES_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y) {
    super();
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png");
    this.loadImages(this.IMAGES_ROTATION);
    this.loadImages(this.IMAGES_SPLASH);
    this.x = x;
    this.y = y;
    this.height = 100;
    this.width = 100;
    this.isShattered = false;
    this.remove = false;
    this.throw();
  }

  throw() {
    this.setThrowPhysics();
    this.applyGravity();
    this.startThrowAnimation();
  }

  setThrowPhysics() {
    this.speedY = 25;
    this.speed = 10;
  }

  startThrowAnimation() {
    this.throwInterval = setInterval(() => {
      this.updateThrow();
    }, 25);
  }

  updateThrow() {
    if (!this.isShattered) {
      this.moveBottle();
      this.animateRotation();
    }
  }

  moveBottle() {
    this.x += this.speed;
  }

  animateRotation() {
    if (this.IMAGES_ROTATION.length) {
      this.playAnimation(this.IMAGES_ROTATION);
    }
  }

  shatter() {
    if (this.isShattered) return;

    this.isShattered = true;
    this.stopMovement();
    this.clearThrowInterval();
    this.setFirstSplashImage();
    this.playSplashAnimation();
    this.scheduleRemoval();
  }

  stopMovement() {
    this.speed = 0;
    this.speedY = 0;
  }

  clearThrowInterval() {
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
    }
  }

  setFirstSplashImage() {
    const firstPath = this.IMAGES_SPLASH[0];
    if (this.imageCache && this.imageCache[firstPath]) {
      this.img = this.imageCache[firstPath];
    }
  }

  playSplashAnimation() {
    this.playAnimation(this.IMAGES_SPLASH);
  }

  scheduleRemoval() {
    setTimeout(() => {
      this.remove = true;
    }, 350);
  }
}
