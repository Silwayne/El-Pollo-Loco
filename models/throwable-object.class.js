/**
 * Represents a throwable bottle projectile with physics and animation
 * Handles bottle rotation during flight and splash effects on impact
 * Extends MovableObject to inherit physics and collision capabilities
 * @class
 * @extends MovableObject
 */
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

  /**
   * Initiates the throwing sequence with physics and animation
   * @returns {void}
   */
  throw() {
    this.setThrowPhysics();
    this.applyGravity();
    this.startThrowAnimation();
  }

  /**
   * Sets initial physics parameters for throwing motion
   * @returns {void}
   */
  setThrowPhysics() {
    this.speedY = 25;
    this.speed = 10;
  }

  /**
   * Starts the throw animation loop
   * @returns {void}
   */
  startThrowAnimation() {
    this.throwInterval = setInterval(() => {
      this.updateThrow();
    }, 25);
  }

  /**
   * Updates throwable object state each frame
   * @returns {void}
   */
  updateThrow() {
    if (!this.isShattered) {
      this.moveBottle();
      this.animateRotation();
    }
  }

  /**
   * Moves bottle horizontally based on current speed
   * @returns {void}
   */
  moveBottle() {
    this.x += this.speed;
  }

  /**
   * Animates bottle rotation during flight
   * @returns {void}
   */
  animateRotation() {
    if (this.IMAGES_ROTATION.length) {
      this.playAnimation(this.IMAGES_ROTATION);
    }
  }

  /**
   * Handles bottle shattering on impact
   * Stops movement, plays splash animation, and schedules removal
   * @returns {void}
   */
  shatter() {
    if (this.isShattered) return;

    this.isShattered = true;
    this.stopMovement();
    this.clearThrowInterval();
    this.setFirstSplashImage();
    this.playSplashAnimation();
    this.scheduleRemoval();
  }

  /**
   * Stops all bottle movement physics
   * @returns {void}
   */
  stopMovement() {
    this.speed = 0;
    this.speedY = 0;
  }

  /**
   * Clears the throw animation interval
   * @returns {void}
   */
  clearThrowInterval() {
    if (this.throwInterval) {
      clearInterval(this.throwInterval);
    }
  }

  /**
   * Sets the first splash animation frame immediately
   * @returns {void}
   */
  setFirstSplashImage() {
    const firstPath = this.IMAGES_SPLASH[0];
    if (this.imageCache && this.imageCache[firstPath]) {
      this.img = this.imageCache[firstPath];
    }
  }

  /**
   * Plays the complete splash animation sequence
   * @returns {void}
   */
  playSplashAnimation() {
    this.playAnimation(this.IMAGES_SPLASH);
  }

  /**
   * Schedules removal of the bottle from the game world
   * @returns {void}
   */
  scheduleRemoval() {
    setTimeout(() => {
      this.remove = true;
    }, 350);
  }

  /**
   * Defines the collision box for bottle interactions
   * @returns {{x: number, y: number, width: number, height: number}} Collision box
   */
  getCollisionBox() {
    return {
      x: this.x + 30,
      y: this.y + 10,
      width: this.width - 60,
      height: this.height - 20,
    };
  }
}
